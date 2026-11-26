#!/usr/bin/env python3
"""Hook PreToolUse: bloqueia qualquer alteração em projeto/originais/.

Regra 1 do CLAUDE.md: os brutos da Paty nunca são alterados. Ler é permitido
(ffprobe, ffmpeg -i, cp de lá para outro lugar); gravar, mover, renomear,
apagar ou usar originais/ como destino é bloqueado.

Saída 2 = bloqueia a ferramenta e devolve a mensagem ao Claude.
Em qualquer falha interna, deixa passar (exit 0) para não travar o trabalho.
"""
import json
import os
import re
import shlex
import sys

PASTA = "originais"
MSG = (
    "BLOQUEADO pelo hook protege-originais: projeto/originais/ é só leitura "
    "(regra 1 do CLAUDE.md). Gere o arquivo em .tmp/, public/brutos/ ou exports/."
)

# Comandos que alteram qualquer caminho de originais/ que receberem.
ALTERA_TUDO = {
    "rm", "rmdir", "unlink", "mv", "truncate", "shred", "touch", "chmod",
    "chown", "chgrp", "tee", "rename", "setfattr", "xattr",
}
# Comandos cujo último argumento é o destino.
DESTINO_NO_FIM = {"cp", "rsync", "ln", "install", "ffmpeg", "scp", "convert", "magick"}
# Comandos que editam no lugar com -i / --in-place.
EDITA_NO_LUGAR = {"sed", "perl", "gsed"}
OPERADORES = {";", "&&", "||", "|", "&", "(", ")", "\n"}


def dentro_originais(caminho: str, base: str) -> bool:
    if not caminho:
        return False
    caminho = os.path.expanduser(caminho.strip("'\""))
    if not os.path.isabs(caminho):
        caminho = os.path.join(base, caminho)
    real = os.path.realpath(caminho)
    partes = real.split(os.sep)
    # .../projeto/originais/... (o próprio diretório também conta)
    for i in range(len(partes) - 1):
        if partes[i] == "projeto" and partes[i + 1] == PASTA:
            return True
    return False


def menciona(token: str, base: str) -> bool:
    return PASTA in token and dentro_originais(token, base)


def checa_bash(comando: str, base: str) -> bool:
    """True se o comando altera algo em originais/."""
    if PASTA not in comando and "clean" not in comando:
        return False
    try:
        lex = shlex.shlex(comando, posix=True, punctuation_chars=";&|()<>")
        lex.whitespace_split = True
        tokens = list(lex)
    except ValueError:
        # Aspas quebradas: na dúvida, bloqueia se houver redirecionamento ou verbo de escrita.
        return bool(re.search(r">\s*\S*" + PASTA, comando)) or any(
            re.search(rf"\b{c}\b", comando) for c in ALTERA_TUDO
        )

    # Redirecionamento para dentro de originais/ (> ou >>).
    for i, t in enumerate(tokens):
        if t in (">", ">>", ">|", "&>", "&>>") and i + 1 < len(tokens):
            if menciona(tokens[i + 1], base):
                return True

    # Separa em comandos simples.
    segmentos, atual = [], []
    for t in tokens:
        if t in OPERADORES or set(t) <= set(";&|()"):
            if atual:
                segmentos.append(atual)
            atual = []
        else:
            atual.append(t)
    if atual:
        segmentos.append(atual)

    for seg in segmentos:
        # Remove redirecionamentos e seus alvos, prefixos tipo sudo/env/VAR=.
        limpo, pula = [], False
        for t in seg:
            if pula:
                pula = False
                continue
            if t in ("<", ">", ">>", "<<", "<<<"):
                pula = True
                continue
            limpo.append(t)
        while limpo and (limpo[0] in ("sudo", "env", "nice", "command", "exec", "xargs")
                         or re.match(r"^\w+=", limpo[0])):
            limpo = limpo[1:]
        if not limpo:
            continue
        cmd = os.path.basename(limpo[0])
        args = limpo[1:]
        caminhos = [a for a in args if not a.startswith("-")]

        # git clean -x/-X apaga arquivos ignorados — e originais/ é ignorado.
        if cmd == "git" and "clean" in args:
            depois = args[args.index("clean") + 1:]
            if any(re.match(r"^-[a-zA-Z]*[xX]", a) for a in depois):
                return True

        if cmd in ALTERA_TUDO and any(menciona(a, base) for a in args):
            return True
        if cmd in DESTINO_NO_FIM and caminhos:
            destino = caminhos[-1]
            if cmd in ("cp", "rsync", "ln", "install"):
                # -t DESTINO
                for j, a in enumerate(args):
                    if a in ("-t", "--target-directory") and j + 1 < len(args):
                        destino = args[j + 1]
                    elif a.startswith("--target-directory="):
                        destino = a.split("=", 1)[1]
            if menciona(destino, base):
                return True
        if cmd in EDITA_NO_LUGAR and any(a.startswith("-i") or a == "--in-place" for a in args):
            if any(menciona(a, base) for a in args):
                return True
        if cmd == "find" and any(menciona(a, base) for a in args):
            if "-delete" in args or any(x in args for x in ("rm", "mv", "-execdir")):
                return True
        if cmd == "dd" and any(a.startswith("of=") and menciona(a[3:], base) for a in args):
            return True
        if cmd in ("python", "python3", "node", "bash", "sh") and any(
            menciona(a, base) for a in args
        ):
            # Rodar script que só lê é comum (ex.: ffprobe via python); só bloqueia
            # quando o código embutido escreve/apaga.
            codigo = " ".join(args)
            if re.search(r"(remove|unlink|rmtree|rename|replace|writeFile|open\([^)]*['\"][wa])", codigo):
                return True
    return False


def main() -> int:
    try:
        dados = json.load(sys.stdin)
    except Exception:
        return 0
    ferramenta = dados.get("tool_name", "")
    entrada = dados.get("tool_input", {}) or {}
    base = dados.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()

    try:
        if ferramenta in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
            caminho = entrada.get("file_path") or entrada.get("notebook_path") or ""
            if dentro_originais(caminho, base):
                print(MSG, file=sys.stderr)
                return 2
        elif ferramenta == "Bash":
            if checa_bash(entrada.get("command", ""), base):
                print(MSG, file=sys.stderr)
                return 2
    except Exception:
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
