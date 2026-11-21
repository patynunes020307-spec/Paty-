# Gera a planilha "Controle Financeiro Impactar" (.xlsx) para importar no Google Planilhas.
# Período: dezembro de 2026 a dezembro de 2027, começando sem lançamentos.
# Uso: python3 precificacao/planilha/gerar_financeiro.py
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule

OUT = Path(__file__).with_name("Controle Financeiro Impactar.xlsx")
N = 300  # linhas disponíveis em Lançamentos
BRL = '"R$" #,##0.00;-"R$" #,##0.00;"-"'
DATA = 'dd/mm/yyyy'
F = "Arial"
f_base = Font(name=F, size=10)
f_in = Font(name=F, size=10, color="0000FF")
f_tit = Font(name=F, size=14, bold=True, color="203F51")
f_nota = Font(name=F, size=9, italic=True, color="5B6B73")
f_head = Font(name=F, size=10, bold=True, color="FFFFFF")
f_sec = Font(name=F, size=10, bold=True, color="203F51")
f_tot = Font(name=F, size=10, bold=True)
fill_head = PatternFill("solid", fgColor="203F51")
fill_sec = PatternFill("solid", fgColor="E6DED4")
fill_tot = PatternFill("solid", fgColor="EAF1F1")
fill_in = PatternFill("solid", fgColor="FFF9E6")
verde = PatternFill("solid", fgColor="E2F1E8")
verm = PatternFill("solid", fgColor="F8E3E0")
amar = PatternFill("solid", fgColor="FBF0D9")
font_verm = Font(name=F, size=10, color="A3322B", bold=True)
font_verde = Font(name=F, size=10, color="1E6B4A", bold=True)

MESES = ["12 - dez 2026"] + [f"{i:02d} - {m} 2027" for i, m in enumerate(
    ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"], start=1)]
CATS = ["Cliente", "Outra entrada", "Pró-labore Paty", "Pró-labore Vivi", "Custo fixo",
        "Custo variável", "Reserva (caixa e 13º)", "Imposto (DAS)"]

wb = Workbook()


def ws_new(title, first=False):
    ws = wb.active if first else wb.create_sheet()
    ws.title = title
    ws.sheet_view.showGridLines = False
    return ws


def put(ws, ref, value, font=f_base, fmt=None, fill=None, align=None, wrap=False):
    c = ws[ref]
    c.value = value
    c.font = font
    if fmt:
        c.number_format = fmt
    if fill:
        c.fill = fill
    if align or wrap:
        c.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    return c


def header(ws, row, labels, col=1, height=42):
    for i, t in enumerate(labels):
        c = ws.cell(row=row, column=col + i, value=t)
        c.font = f_head
        c.fill = fill_head
        c.alignment = Alignment(horizontal="center" if i else "left", vertical="center", wrap_text=True)
    ws.row_dimensions[row].height = height


def section(ws, row, text, ncols):
    for i in range(ncols):
        ws.cell(row=row, column=1 + i).fill = fill_sec
    c = ws.cell(row=row, column=1, value=text)
    c.font = f_sec


LEG = "Azul com fundo amarelo claro: valor que você digita. Preto: fórmula, não digite por cima."

# ---------------------------------------------------------------- Metas e fixos
wm = ws_new("Metas e fixos", first=True)
put(wm, "A1", "Metas e custos fixos do mês", f_tit)
put(wm, "A2", LEG, f_nota)
put(wm, "A3", "Valores informados pela Paty em 20 e 21/11/2026. O pró-labore de R$ 3.000 é meta.", f_nota)
section(wm, 5, "Metas", 2)
put(wm, "A6", "Meta de pró-labore Paty (por mês)"); put(wm, "B6", 3000, f_in, BRL, fill_in)
put(wm, "A7", "Meta de pró-labore Vivi (por mês)"); put(wm, "B7", 3000, f_in, BRL, fill_in)
put(wm, "A8", "Caixa no início (1º de dezembro de 2026)"); put(wm, "B8", 0, f_in, BRL, fill_in)
put(wm, "C8", "Saldo em conta no dia em que começaram os lançamentos.", f_nota)
header(wm, 10, ["Custo fixo do mês", "Valor"], height=24)
fixos = [("Pró-labore Paty (meta)", "=B6"), ("Pró-labore Vivi (meta)", "=B7"), ("Décimo terceiro (reserva)", 200),
         ("Caixa (reserva)", 100), ("Assessoria VIP", 150), ("Contador", 90), ("DAS (CNPJ 1)", 82), ("DAS (CNPJ 2)", 82)]
for i in range(12):  # linhas 11 a 22
    r = 11 + i
    nome, val = fixos[i] if i < len(fixos) else (None, None)
    formula = isinstance(val, str)
    put(wm, f"A{r}", nome, f_base if formula else f_in, fill=None if formula else fill_in)
    put(wm, f"B{r}", val, f_base if formula else f_in, BRL, None if formula else fill_in)
put(wm, "A23", "Meta de entradas do mês (paga todos os custos fixos e o pró-labore cheio)", f_tot, fill=fill_tot, wrap=True)
put(wm, "B23", "=SUM(B11:B22)", f_tot, BRL, fill_tot)
put(wm, "A24", "Linhas em branco: use para um novo custo fixo. A meta de entradas já inclui.", f_nota)
wm.column_dimensions["A"].width = 46
wm.column_dimensions["B"].width = 16
wm.column_dimensions["C"].width = 40
wm.row_dimensions[23].height = 30

# ---------------------------------------------------------------- Lançamentos
wl = ws_new("Lançamentos")
put(wl, "A1", "Lançamentos", f_tit)
put(wl, "A2", "Uma linha por entrada ou saída. Parcelas de clientes a receber ficam na aba Eventos; aqui entra o que realmente foi recebido (Realizado). Use Previsto para outras entradas e contas a pagar.", f_nota)
header(wl, 3, ["Data", "Mês", "Tipo", "Categoria", "Descrição", "Valor", "Status", "Observação"], height=24)
dados = []
for i in range(N):
    r = 4 + i
    d = dados[i] if i < len(dados) else None
    put(wl, f"A{r}", None, f_in, DATA)
    put(wl, f"B{r}", d[0] if d else None, f_in)
    put(wl, f"C{r}", d[1] if d else None, f_in)
    put(wl, f"D{r}", d[2] if d else None, f_in)
    put(wl, f"E{r}", d[3] if d else None, f_in)
    put(wl, f"F{r}", d[4] if d else None, f_in, BRL)
    put(wl, f"G{r}", "Realizado" if d else None, f_in)
    put(wl, f"H{r}", "Copiado da planilha CONTROLE FINANCEIRO — 2026" if d else None, f_nota)
last = 3 + N
for ref, lista in ((f"B4:B{last}", MESES), (f"C4:C{last}", ["Entrada", "Saída"]),
                   (f"D4:D{last}", CATS), (f"G4:G{last}", ["Realizado", "Previsto"])):
    dv = DataValidation(type="list", formula1='"' + ",".join(lista) + '"', allow_blank=True)
    wl.add_data_validation(dv)
    dv.add(ref)
wl.conditional_formatting.add(f"A4:H{last}", FormulaRule(formula=['$G4="Previsto"'], fill=amar))
for col, w in zip("ABCDEFGH", (12, 15, 10, 20, 28, 14, 12, 40)):
    wl.column_dimensions[col].width = w
wl.freeze_panes = "A4"

# ---------------------------------------------------------------- Eventos
NE = 80  # eventos
we = ws_new("Eventos")
put(we, "A1", "Eventos e parcelas a receber", f_tit)
put(we, "A2", "Uma linha por evento fechado. Em cada mês, escreva quanto daquele contrato vai entrar (entrada e parcelas, mesmo com valores diferentes ou meses pulados). " + LEG, f_nota)
MC = [chr(ord("G") + i) for i in range(len(MESES))]  # colunas dos meses: G a S
c0, c1 = MC[0], MC[-1]
TC, T27, FD = "T", "U", "V"
hdr = ["Evento / cliente", "Data do evento", "Pacote", "Valor do contrato", "Forma de pagamento", "Como foi combinado"] + MESES + [
       "Total combinado no período", "Total em 2027", "Falta distribuir"]
header(we, 4, hdr, height=48)
fim = 4 + NE
tot = fim + 1
for r in range(5, fim + 1):
    put(we, f"A{r}", None, f_in, fill=fill_in)
    put(we, f"B{r}", None, f_in, DATA, fill_in)
    put(we, f"C{r}", None, f_in, fill=fill_in)
    put(we, f"D{r}", None, f_in, BRL, fill_in)
    put(we, f"E{r}", None, f_in, fill=fill_in)
    put(we, f"F{r}", None, f_in, fill=fill_in)
    for col in MC:
        put(we, f"{col}{r}", None, f_in, BRL, fill_in)
    put(we, f"{TC}{r}", f"=SUM({c0}{r}:{c1}{r})", f_tot, BRL)
    put(we, f"{T27}{r}", f"=SUM({MC[1]}{r}:{c1}{r})", fmt=BRL)
    put(we, f"{FD}{r}", f'=IF(A{r}="","",N(D{r})-{TC}{r})', fmt=BRL)
put(we, f"A{tot}", "Total que entra por mês", f_tot, fill=fill_tot)
for col in ["D"] + MC + [TC, T27]:
    put(we, f"{col}{tot}", f"=SUM({col}5:{col}{fim})", f_tot, BRL, fill_tot)
put(we, f"A{tot + 2}", "Falta distribuir: valor do contrato menos o que foi escrito nos meses. Tem que ficar zero. Se não ficar, faltou ou sobrou parcela (ou ela cai depois de dez/2027).", f_nota)
put(we, f"A{tot + 3}", "Parcela que vai entrar fica só aqui. Dinheiro que entrou de verdade vai na aba Lançamentos, como Cliente e Realizado.", f_nota)
for ref, lista in ((f"E5:E{fim}", ["Pix", "Transferência", "Boleto", "Cartão de crédito", "Dinheiro", "Misto"]),
                   (f"C5:C{fim}", ["Essencial", "Plus", "Premium Completa", "Outro"])):
    dv = DataValidation(type="list", formula1='"' + ",".join(lista) + '"', allow_blank=True)
    we.add_data_validation(dv)
    dv.add(ref)
we.conditional_formatting.add(f"{FD}5:{FD}{fim}", FormulaRule(formula=[f'AND({FD}5<>"",ABS({FD}5)>=0.01)'], fill=amar, font=font_verm))
we.conditional_formatting.add(f"{FD}5:{FD}{fim}", FormulaRule(formula=[f'AND({FD}5<>"",ABS({FD}5)<0.01)'], fill=verde, font=font_verde))
for col, w in zip("ABCDEF", (26, 12, 15, 14, 15, 24)):
    we.column_dimensions[col].width = w
for col in MC + [TC, T27, FD]:
    we.column_dimensions[col].width = 13
we.freeze_panes = "B5"
EV_MESES = f"Eventos!${c0}$4:${c1}$4"
EV_TOT = f"Eventos!${c0}${tot}:${c1}${tot}"

# ---------------------------------------------------------------- Mês a mês
wr = ws_new("Mês a mês")
put(wr, "A1", "Financeiro mês a mês: dez/2026 a dez/2027", f_tit)
put(wr, "A2", "Realizado: o que já entrou e saiu (aba Lançamentos). Projeção: realizado mais as parcelas da aba Eventos ainda não recebidas e os valores Previsto. Meses sem saídas lançadas usam a meta de custos fixos.", f_nota)
heads = ["Mês", "Entrou", "Saiu", "Sobrou no mês", "Pró-labore Paty", "Pró-labore Vivi", "Guardado (caixa e 13º)",
         "Meta de entradas", "Bateu a meta de entradas?", "Falta para a meta", "Pró-labore na meta?",
         "Gastou mais do que entrou?", "A receber (eventos e previstos)", "A pagar (previsto)", "Sobra projetada", "Caixa acumulado"]
header(wr, 4, heads)
L = "'Lançamentos'!"
V, M, T, C, S = (f"{L}$F$4:$F${last}", f"{L}$B$4:$B${last}", f"{L}$C$4:$C${last}", f"{L}$D$4:$D${last}", f"{L}$G$4:$G${last}")
MF = "'Metas e fixos'!"
for i, mes in enumerate(MESES):
    r = 5 + i
    put(wr, f"A{r}", mes, f_tot)
    put(wr, f"B{r}", f'=SUMIFS({V},{M},$A{r},{T},"Entrada",{S},"Realizado")', fmt=BRL)
    put(wr, f"C{r}", f'=SUMIFS({V},{M},$A{r},{T},"Saída",{S},"Realizado")', fmt=BRL)
    put(wr, f"D{r}", f"=B{r}-C{r}", fmt=BRL)
    put(wr, f"E{r}", f'=SUMIFS({V},{M},$A{r},{C},"Pró-labore Paty",{S},"Realizado")', fmt=BRL)
    put(wr, f"F{r}", f'=SUMIFS({V},{M},$A{r},{C},"Pró-labore Vivi",{S},"Realizado")', fmt=BRL)
    put(wr, f"G{r}", f'=SUMIFS({V},{M},$A{r},{C},"Reserva (caixa e 13º)",{S},"Realizado")', fmt=BRL)
    put(wr, f"H{r}", f"={MF}$B$23", fmt=BRL)
    put(wr, f"I{r}", f'=IF(B{r}=0,"",IF(B{r}>=H{r},"Sim","Não"))', align="center")
    put(wr, f"J{r}", f'=IF(B{r}=0,"",MAX(0,H{r}-B{r}))', fmt=BRL)
    put(wr, f"K{r}", f'=IF(E{r}+F{r}=0,"",IF(AND(E{r}>={MF}$B$6,F{r}>={MF}$B$7),"Sim","Não"))', align="center")
    put(wr, f"L{r}", f'=IF(AND(B{r}=0,C{r}=0),"",IF(C{r}>B{r},"Sim","Não"))', align="center")
    put(wr, f"M{r}", f'=MAX(0,IFERROR(INDEX({EV_TOT},MATCH($A{r},{EV_MESES},0)),0)-SUMIFS({V},{M},$A{r},{C},"Cliente",{S},"Realizado"))+SUMIFS({V},{M},$A{r},{T},"Entrada",{S},"Previsto")', fmt=BRL)
    put(wr, f"N{r}", f'=SUMIFS({V},{M},$A{r},{T},"Saída",{S},"Previsto")', fmt=BRL)
    put(wr, f"O{r}", f"=B{r}+M{r}-IF(C{r}+N{r}=0,H{r},C{r}+N{r})", fmt=BRL)
    put(wr, f"P{r}", f"={MF}$B$8+D{r}" if i == 0 else f"=P{r - 1}+D{r}", fmt=BRL)
tr = 5 + len(MESES)  # linha do total
put(wr, f"A{tr}", "Período", f_tot, fill=fill_tot)
for col in "BCDEFGHJMNO":
    put(wr, f"{col}{tr}", f"=SUM({col}5:{col}17)", f_tot, BRL, fill_tot)
put(wr, f"I{tr}", f'=COUNTIF(I5:I17,"Sim")&" de "&COUNTIF(I5:I17,"?*")&" meses"', f_tot, fill=fill_tot, align="center")
put(wr, f"K{tr}", f'=COUNTIF(K5:K17,"Sim")&" de "&COUNTIF(K5:K17,"?*")&" meses"', f_tot, fill=fill_tot, align="center")
put(wr, f"L{tr}", f'=COUNTIF(L5:L17,"Sim")&" de "&COUNTIF(L5:L17,"?*")&" meses"', f_tot, fill=fill_tot, align="center")
put(wr, f"P{tr}", "=P17", f_tot, BRL, fill_tot)
for col in "IKL":
    good = "Não" if col == "L" else "Sim"
    bad = "Sim" if col == "L" else "Não"
    wr.conditional_formatting.add(f"{col}5:{col}17", FormulaRule(formula=[f'{col}5="{good}"'], fill=verde, font=font_verde))
    wr.conditional_formatting.add(f"{col}5:{col}17", FormulaRule(formula=[f'{col}5="{bad}"'], fill=verm, font=font_verm))
for col in "DOP":
    wr.conditional_formatting.add(f"{col}5:{col}17", FormulaRule(formula=[f"{col}5<0"], font=font_verm))

section(wr, 20, "Resumo do período até agora", 4)
res = [(21, "Total que entrou", f"=B{tr}", BRL), (22, "Total que saiu", f"=C{tr}", BRL),
       (23, "Sobra do período", f"=D{tr}", BRL),
       (24, "Média de entradas por mês lançado", '=IF(COUNTIF(B5:B17,">0")=0,0,B18/COUNTIF(B5:B17,">0"))', BRL),
       (25, "Média de pró-labore por sócia", '=IF(COUNTIF(E5:E17,">0")=0,0,(E18+F18)/2/COUNTIF(E5:E17,">0"))', BRL),
       (26, "Meta de pró-labore por sócia", f"={MF}B6", BRL),
       (27, "Ainda a receber (previsto)", f"=M{tr}", BRL)]
for r, lab, fml, fmt in res:
    put(wr, f"A{r}", lab)
    put(wr, f"D{r}", fml, fmt=fmt)
    wr.merge_cells(f"A{r}:C{r}")
put(wr, "A29", "Faturamento do ano por CNPJ e limite do MEI: ver a planilha Precificação Impactar ou a contabilidade.", f_nota)
wr.column_dimensions["A"].width = 16
for col in "BCDEFGHJMNOP":
    wr.column_dimensions[col].width = 14
for col in "IKL":
    wr.column_dimensions[col].width = 13
wr.freeze_panes = "B5"

# ---------------------------------------------------------------- Como usar
import sys
sys.path.insert(0, str(Path(__file__).parent))
from manual_conteudo import MANUAL
wh = ws_new("Como usar")
r = 1
for tipo, txt in MANUAL:
    if tipo == "tab":
        for k, linha in enumerate(txt):
            for j, v in enumerate(linha):
                c = wh.cell(row=r, column=1 + j, value=v)
                c.alignment = Alignment(wrap_text=True, vertical="top")
                if k == 0:
                    c.font = f_head; c.fill = fill_head
                else:
                    c.font = f_base
            r += 1
        r += 1
        continue
    if tipo == "s":
        r += 1
    c = wh.cell(row=r, column=1, value=txt)
    c.alignment = Alignment(wrap_text=True, vertical="top")
    c.font = {"t": f_tit, "s": Font(name=F, size=12, bold=True, color="203F51"), "a": font_verm,
              "d": Font(name=F, size=10, italic=True, color="1E6B4A"), "x": Font(name=F, size=10, color="3C6A78")}.get(tipo, f_base)
    if tipo in ("x", "a", "d"):
        c.fill = {"x": PatternFill("solid", fgColor="EAF1F1"), "a": verm, "d": verde}[tipo]
    if tipo in ("p", "n", "x", "a", "d"):
        wh.merge_cells(start_row=r, start_column=1, end_row=r, end_column=3)
        wh.row_dimensions[r].height = 16 * max(1, -(-len(txt) // 110))
    r += 1
wh.column_dimensions["A"].width = 40
wh.column_dimensions["B"].width = 55
wh.column_dimensions["C"].width = 40

wb._sheets.sort(key=lambda w: ["Como usar", "Mês a mês", "Eventos", "Lançamentos", "Metas e fixos"].index(w.title))
wb.active = 0
wb.save(OUT)
print(OUT, OUT.stat().st_size)
