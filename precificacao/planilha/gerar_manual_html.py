# Gera o manual em HTML (convertido em Google Doc no Drive).
from pathlib import Path
from html import escape
from manual_conteudo import MANUAL
out = ['<html><head><meta charset="utf-8"></head><body style="font-family:Arial">']
for tipo, txt in MANUAL:
    if tipo == "tab":
        out.append('<table border="1" cellpadding="6" style="border-collapse:collapse">')
        for k, linha in enumerate(txt):
            tag = "th" if k == 0 else "td"
            out.append("<tr>" + "".join(f"<{tag}>{escape(v)}</{tag}>" for v in linha) + "</tr>")
        out.append("</table><p></p>")
    elif tipo == "t": out.append(f"<h1>{escape(txt)}</h1>")
    elif tipo == "s": out.append(f"<h2>{escape(txt)}</h2>")
    elif tipo == "x": out.append(f"<p><i>{escape(txt)}</i></p>")
    elif tipo == "a": out.append(f"<p><b>Atenção:</b> {escape(txt)}</p>")
    elif tipo == "d": out.append(f"<p><b>Dica:</b> {escape(txt)}</p>")
    else: out.append(f"<p>{escape(txt)}</p>")
out.append("</body></html>")
p = Path(__file__).with_name("Manual Controle Financeiro Impactar.html")
p.write_text("\n".join(out), encoding="utf-8")
print(p, p.stat().st_size)
