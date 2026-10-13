#!/usr/bin/env python3
"""hookscore.py - score a YouTube hook before you waste a take on it.

Five properties, 0-100 each, and a verdict that is 60% the mean and 40% the weakest one. The
weakest-link weighting is deliberate: a hook with four strong properties and one dead one is a hook
that leaks at the dead one, and averaging hides that.

    python3 hookscore.py hooks.txt            # one hook per line, ranked
    python3 hookscore.py --hook "one line"    # score a single hook
    python3 hookscore.py --json hooks.txt     # machine-readable

WHAT THIS CAN AND CANNOT TELL YOU. Measured against 74 real short-form hooks (first 15 seconds of
auto-captions, top-8 and bottom-8 by views across five channels): it separates deliberately bad
hooks from real ones well, and it separates a creator's own hits from their own misses barely at
all. Treat a low score as a reason to look again, never a high score as a promise.

PORTUGUES. Hooks em portugues sao pontuados com os mesmos cinco criterios, usando listas de
palavras em PT ao lado das em ingles, e classificados pelos padroes `match_pt` de hooks.json. Os
acentos sao removidos antes da comparacao, entao "voce" e "voce" com acento contam igual. A
calibracao original foi feita so em ingles: em PT a nota e uma adaptacao, nao uma medicao.
"""
import json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
FORMULAS = json.load(open(os.path.join(HERE, "hooks.json")))["hooks"]

FILLER = {"basically","actually","literally","just","really","very","so","kind","sort","like",
          "guys","hey","welcome","today","video","subscribe","channel",
          # pt
          "basicamente","literalmente","tipo","entao","mesmo","muito","realmente","gente",
          "pessoal","oi","ola","bem","vindo","vindos","hoje","canal","inscreva","inscrevam",
          "inscreve","assim","ne","ai"}
VAGUE = {"amazing","incredible","insane","crazy","huge","massive","game","changer","secret",
         "powerful","ultimate","best","revolutionary","mind","blowing","unbelievable",
         # pt
         "incrivel","incriveis","absurdo","insano","louco","enorme","gigante","segredo","segredos",
         "poderoso","definitivo","melhor","revolucionario","surreal","inacreditavel","top",
         "perfeito","maravilhoso","sensacional","espetacular"}
CONCRETE = re.compile(r"\b(\d[\d,.]*\s?(%|k|m|x|s|m|h|mil)?|\$\d|\d+\s?(second|minute|hour|day|week|month|year)s?"
                      r"|\d+\s?(segundo|minuto|hora|dia|semana|mes|meses|ano)s?)\b|\br\$\s?\d", re.I)
YOU = re.compile(r"\b(you|your|you're|youre|yourself"
                 r"|voce|voces|vc|seu|sua|seus|suas|te|ti|contigo)\b", re.I)
STAKE = re.compile(r"\b(lose|lost|wasting|waste|quit|fail|broke|cost|risk|before|stop|never|die|dying|dead"
                   r"|perde|perder|perdendo|perdeu|perda|desperdica\w*|gasta\w*|custa\w*|custo|risco|arrisca\w*"
                   r"|antes|pare|parar|nunca|erra\w*|erro|erros|falha\w*|prejuizo|multa|atraso|cancela\w*"
                   r"|desist\w*|quebr\w*|atras\w*|esquec\w*|estour\w*)\b", re.I)
CURIOSITY = re.compile(r"\b(why|how|what|which|until|before|but|nobody|almost|except|reason|actually"
                       r"|por que|como|o que|qual|quais|ate|mas|ninguem|quase|exceto|motivo|razao|na verdade)\b", re.I)
CLOSED = re.compile(r"\b(because|so that|which means|porque|para que|ou seja|o que significa)\b", re.I)
PT_MARKERS = {"voce","voces","vc","nao","que","para","pra","uma","isso","esse","essa","seu","sua",
              "de","do","da","dos","das","com","por","mas","sao","esta","e","ao","sobre","vamos",
              "na","um","mais","gente","hoje","oi"}

def norm(t):
    """lowercase and strip accents, so 'Você' and 'voce' score the same."""
    t = unicodedata.normalize("NFKD", t)
    return "".join(c for c in t if not unicodedata.combining(c)).lower()

def is_pt(t): return len(PT_MARKERS & set(words(t))) >= 2

def words(t): return re.findall(r"[a-z0-9'%$.]+", norm(t))

def specificity(t):
    w = words(t)
    if not w: return 0
    nums = len(CONCRETE.findall(norm(t)))
    vague = sum(1 for x in w if x in VAGUE)
    filler = sum(1 for x in w if x in FILLER)
    s = 34 + nums * 22 - vague * 16 - filler * 5
    # proper nouns that are not sentence-initial read as named things
    s += min(18, 6 * sum(1 for x in t.split()[1:] if x[:1].isupper()))
    return max(0, min(100, s))

def address(t):
    t = norm(t)
    n = len(YOU.findall(t))
    first = 30 if YOU.search(" ".join(t.split()[:6])) else 0
    return max(0, min(100, 26 + n * 20 + first))

def stakes(t):
    t = norm(t)
    n = len(STAKE.findall(t))
    return max(0, min(100, 22 + n * 26 + (14 if CONCRETE.search(t) else 0)))

def curiosity(t):
    t = norm(t)
    n = len(CURIOSITY.findall(t))
    q = 18 if t.strip().endswith("?") else 0
    # a hook that resolves itself has no gap left
    closed = -18 if CLOSED.search(t) else 0
    return max(0, min(100, 24 + n * 17 + q + closed))

def brevity(t):
    n = len(words(t))
    if n == 0: return 0
    # 9-24 words is the band a spoken hook lands in at ~150wpm inside 10 seconds
    if 9 <= n <= 24: return 100
    if n < 9:  return max(30, 100 - (9 - n) * 11)
    return max(10, 100 - (n - 24) * 7)

PROPS = [("SPECIFICITY", specificity), ("ADDRESS", address), ("STAKES", stakes),
         ("CURIOSITY", curiosity), ("BREVITY", brevity)]

def classify(t):
    best, hits = None, 0
    t = norm(t)
    for f in FORMULAS:
        n = sum(1 for p in f["match"] + f.get("match_pt", []) if re.search(p, t, re.I))
        if n > hits: best, hits = f, n
    return (best["name"] if best else "Unclassified"), hits

def score(t):
    parts = {n: fn(t) for n, fn in PROPS}
    vals = list(parts.values())
    verdict = round(0.6 * (sum(vals) / len(vals)) + 0.4 * min(vals))
    name, hits = classify(t)
    return parts, verdict, name, hits

def band(v): return "STRONG" if v >= 72 else "WORKABLE" if v >= 55 else "WEAK"
BAND_PT = {"STRONG": "FORTE", "WORKABLE": "RAZOAVEL", "WEAK": "FRACO"}

def report(t, parts, verdict, name, hits):
    print(f"\n  {t.strip()}")
    print(f"  {'-' * min(72, max(20, len(t.strip())))}")
    for k, v in parts.items():
        print(f"    {k:<12} {v:3d}  {'#' * (v // 5)}")
    pt = is_pt(t)
    b = band(verdict)
    print(f"    {'VERDICT':<12} {verdict:3d}  {b}" + (f" ({BAND_PT[b]})" if pt else ""))
    print(f"    formula      {name}" + (f"  ({hits} pattern{'s' if hits != 1 else ''} matched)" if hits else "  (no formula matched - that is usually a summary, not a hook)"))
    low = min(parts, key=parts.get)
    print(f"    weakest      {low} - {(FIX_PT if pt else FIX)[low]}")

FIX = {
 "SPECIFICITY": "swap one adjective for a number, a name or a date",
 "ADDRESS": "say 'you' in the first six words",
 "STAKES": "name what it costs them to keep doing it the current way",
 "CURIOSITY": "cut the half of the sentence that answers itself",
 "BREVITY": "9 to 24 words. Read it out loud and stop where you run out of breath",
}
FIX_PT = {
 "SPECIFICITY": "troque um adjetivo por um numero, um nome ou uma data",
 "ADDRESS": "diga 'voce' nas seis primeiras palavras",
 "STAKES": "diga o que custa para a pessoa continuar fazendo do jeito atual",
 "CURIOSITY": "corte a metade da frase que ja responde a pergunta",
 "BREVITY": "de 9 a 24 palavras. Leia em voz alta e pare onde faltar o folego",
}

def main():
    a = sys.argv[1:]
    as_json = "--json" in a
    a = [x for x in a if x != "--json"]
    if "--hook" in a:
        lines = [a[a.index("--hook") + 1]]
    elif a and os.path.exists(a[0]):
        lines = [l for l in open(a[0]).read().splitlines() if l.strip()]
    else:
        print(__doc__); sys.exit(1 if not a else 0)
    out = []
    for t in lines:
        parts, verdict, name, hits = score(t)
        out.append({"hook": t.strip(), "properties": parts, "verdict": verdict,
                    "band": band(verdict), "formula": name, "matched": hits})
    out.sort(key=lambda r: -r["verdict"])
    if as_json:
        print(json.dumps([{k: v for k, v in r.items() if k != "matched"} for r in out], indent=1, ensure_ascii=False)); return
    for r in out:
        report(r["hook"], r["properties"], r["verdict"], r["formula"], r["matched"])
    if len(out) > 1:
        print(f"\n  winner: {out[0]['hook'].strip()}  ({out[0]['verdict']}, {out[0]['band']})\n")

if __name__ == "__main__":
    main()
