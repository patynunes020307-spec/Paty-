# Edição de vídeo — Remotion (vertical 1080 × 1920, 30 fps)

O projeto de vídeo fica em `projeto/` (Remotion 4.0.535, template blank sem Tailwind).
As outras pastas da raiz (`youtube/`, `templates/`, `.claude/skills/yt-*`) são do fluxo de roteiro e não devem ser mexidas por este fluxo.

## Estrutura de pastas

```
projeto/
├── originais/     brutos da Paty — NUNCA alterados (só leitura)
├── referencias/   vídeos que ela quer estudar
├── estilos/       fichas de estilo (.md)
├── briefings/     um .md por projeto de vídeo
├── exports/       vídeos finais
├── public/sfx/    6 efeitos CC0 (whoosh, pop, impacto, ding, notificacao, clique) + LICENSE + FONTES.md
├── src/           composições Remotion (Root.tsx registra tudo)
├── .tmp/          TEMP/TMP do render (definido em remotion.config.ts)
└── .claude/skills/remotion-*   skills oficiais remotion-dev/skills
```

`originais/`, `referencias/`, `exports/` e `.tmp/` ficam fora do git (arquivos pesados).

## Como começar

Toda produção nova começa com a skill `/iniciar` (`.claude/skills/iniciar/SKILL.md`): briefing → inventário → transcrição local → estilo → plano → trecho de validação → vídeo inteiro.

## Regras

1. **Originais nunca são alterados.** Nada de sobrescrever, recodificar no lugar, renomear ou apagar arquivos em `originais/`. Todo processamento gera arquivo novo em outro lugar (`.tmp/`, `public/` ou `exports/`).
2. **Transcrição é sempre local.** Nunca usar serviço pago ou API externa de transcrição. Caminho padrão: `@remotion/install-whisper-cpp` (whisper.cpp local). Não há whisper/faster-whisper em Python instalado.
3. **Toda produção começa por um briefing** em `briefings/<projeto>.md` (objetivo, público, duração, estilo de referência em `estilos/`, brutos usados, entregável).
4. **Validar um trecho curto antes do todo.** Renderizar ~5–10 s representativos, aprovar, e só então montar/renderizar o vídeo inteiro.
5. Renders finais vão para `exports/`.

## Proibido na edição

- Tremida de câmera (camera shake).
- Pulsar elementos (escala/opacidade em loop).
- Seguir rosto quadro a quadro (face tracking/reenquadramento por frame).
- Sons empilhados (mais de um SFX no mesmo instante; um efeito por evento).
- Nada parado mais de 2 s em vídeo falado — sempre algum movimento, corte, legenda ou elemento entrando.

## Comandos (dentro de `projeto/`)

- `npm run dev` — Remotion Studio (http://localhost:3000; config "studio" em `.claude/launch.json`)
- `npm run lint` — ESLint + TypeScript
- `npx remotion compositions` — lista composições
- `npx remotion render <Id> exports/<nome>.mp4` — render final

## Skills Remotion

Antes de escrever ou alterar markup Remotion, carregar `remotion-best-practices` (roteador) e a skill específica:
`remotion-markup` (animação, fontes, áudio/SFX, transições), `remotion-captions` (legendas/transcrição),
`remotion-render` (export), `remotion-studio` (preview), `remotion-docs` (consultar API atual), `remotion-upgrade`.
