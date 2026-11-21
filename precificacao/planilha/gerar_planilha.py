# Gera a planilha "Financeiro e Precificação Impactar" (.xlsx) para importar no Google Planilhas.
# Uso: python3 precificacao/planilha/gerar_planilha.py
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule

OUT = Path(__file__).with_name("Financeiro e Precificacao Impactar.xlsx")
N = 100  # linhas disponíveis nas listas (contratos, parcelas, lançamentos)

BRL = '"R$" #,##0.00;-"R$" #,##0.00;"-"'
PCT = '0.0%'
DATA = 'dd/mm/yyyy'
MES = 'mmm/yyyy'
HORAS = '0.0"h"'
INT = '0'

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
linha = Side(style="thin", color="D9D9D9")
borda = Border(bottom=linha)

wb = Workbook()


def ws_new(title, first=False):
    ws = wb.active if first else wb.create_sheet()
    ws.title = title
    ws.sheet_view.showGridLines = False
    return ws


def put(ws, ref, value, font=f_base, fmt=None, fill=None, bold=False, align=None, wrap=False):
    c = ws[ref]
    c.value = value
    c.font = Font(name=font.name, size=font.size, bold=bold or font.bold, italic=font.italic, color=font.color)
    if fmt:
        c.number_format = fmt
    if fill:
        c.fill = fill
    if align or wrap:
        c.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    return c


def header(ws, row, labels, col=1):
    for i, t in enumerate(labels):
        c = ws.cell(row=row, column=col + i, value=t)
        c.font = f_head
        c.fill = fill_head
        c.alignment = Alignment(horizontal="center" if i else "left", vertical="center", wrap_text=True)
    ws.row_dimensions[row].height = 30


def section(ws, row, text, ncols):
    for i in range(ncols):
        c = ws.cell(row=row, column=1 + i)
        c.fill = fill_sec
    c = ws.cell(row=row, column=1, value=text)
    c.font = f_sec
    c.fill = fill_sec


def legenda(ws, ref):
    put(ws, ref, "Azul com fundo amarelo claro: valor que você digita ou altera. Preto: fórmula, não digite por cima.", f_nota)


# ---------------------------------------------------------------- Estrutura
ws = ws_new("Estrutura", first=True)
put(ws, "A1", "Estrutura mensal e premissas", f_tit)
legenda(ws, "A2")
put(ws, "A3", "Valores informados pela Paty em 20 e 21/11/2026.", f_nota)
header(ws, 5, ["Saída fixa", "Valor por mês", "Peso em cada evento"])
fixas = [("Pró-labore Paty", 3000), ("Pró-labore Viviane", 3000), ("Décimo terceiro", 200),
         ("Assessoria VIP", 150), ("Caixa (reserva)", 100), ("Contador", 90),
         ("DAS (CNPJ 1)", 82), ("DAS (CNPJ 2)", 82)]
for i in range(12):  # linhas 6 a 17: 8 itens + 4 livres
    r = 6 + i
    nome, val = fixas[i] if i < len(fixas) else (None, None)
    put(ws, f"A{r}", nome, f_in, fill=fill_in)
    put(ws, f"B{r}", val, f_in, BRL, fill_in)
    put(ws, f"C{r}", f'=IF(OR(B{r}="",$B$22=0),"",B{r}*12/$B$22)', fmt=BRL)
put(ws, "A18", "Total da estrutura", f_tot, fill=fill_tot)
put(ws, "B18", "=SUM(B6:B17)", f_tot, BRL, fill_tot)
put(ws, "C18", '=IF($B$22=0,0,B18*12/$B$22)', f_tot, BRL, fill_tot)
put(ws, "A19", "Linhas em branco: use para um novo custo fixo. O total e a simulação já incluem.", f_nota)

section(ws, 21, "Premissas", 3)
prem = [
    (22, "Eventos previstos por ano", 25, INT),
    (23, "Parcela da estrutura por evento (média)", "=IF(B22=0,0,B18*12/B22)", BRL),
    (24, "Meta de sobra por evento", 500, BRL),
    (25, "Taxa de recebimento (Pix)", 0, PCT),
    (26, "Imposto sobre a venda", 0, PCT),
    (27, "CNPJs que emitem nota", 2, INT),
    (28, "Limite anual de faturamento por CNPJ (MEI)", 81000, BRL),
    (29, "Tolerância antes do desenquadramento", 0.2, PCT),
    (30, "Valor por hora das contratadas", 35, BRL),
    (31, "Ajuda de manhã, por pessoa", 25, BRL),
    (32, "Deslocamento acima de 50 km, por pessoa", 40, BRL),
]
for r, lab, val, fmt in prem:
    put(ws, f"A{r}", lab)
    formula = isinstance(val, str)
    put(ws, f"B{r}", val, f_base if formula else f_in, fmt, None if formula else fill_in)
put(ws, "C26", "0% enquanto forem MEI: o DAS já está na estrutura.", f_nota)
put(ws, "C28", "Valor de 2026. Confirmar com a contabilidade se mudar em 2027.", f_nota)
ws.column_dimensions["A"].width = 44
ws.column_dimensions["B"].width = 18
ws.column_dimensions["C"].width = 22
ws.freeze_panes = "A6"

# ---------------------------------------------------------------- Pacotes
wp = ws_new("Pacotes")
put(wp, "A1", "Pacotes", f_tit)
legenda(wp, "A2")
header(wp, 4, ["Item", "Essencial", "Plus", "Premium Completa"])
E = "Estrutura!"
rows = [
    # (linha, rótulo, [ess, plus, prem] ou fórmula com {c}, formato, tipo)
    (5, "Preço de referência", [4200, 6900, 10435], BRL, "in"),
    (6, "Duração do contrato (meses)", [None, None, 12], INT, "in"),
    (7, "Horas de preparação", None, None, "sec"),
    (8, "Reuniões (quantidade)", [3, 4, 7], INT, "in"),
    (9, "Duração de cada reunião (h)", [2, 2, 2], HORAS, "in"),
    (10, "Visitas ou encontros (quantidade)", [0, 3, 5], INT, "in"),
    (11, "Duração de cada visita ou encontro (h)", [0, 3.5, 3.5], HORAS, "in"),
    (12, "Alinhamentos e preparação final (h no total)", [30, 30, 30], HORAS, "in"),
    (13, "Cotações (h por mês de contrato)", [0, 0, 3], HORAS, "in"),
    (14, "Profissionais presentes em cada atividade", [1, 1, 1], INT, "in"),
    (15, "Total de horas de preparação", "=({c}8*{c}9+{c}10*{c}11+{c}12+{c}13*N({c}6))*{c}14", HORAS, "tot"),
    (16, "Escala do dia", None, None, "sec"),
    (17, "Sócias na escala (pró-labore, sem custo extra)", [2, 2, 2], INT, "in"),
    (18, "Contratadas até o encerramento (pessoas)", [2, 2, 2], INT, "in"),
    (19, "Horas de cada contratada", [9, 9, 9], HORAS, "in"),
    (20, "Profissional adicional (pessoas)", [0, 0, 1], INT, "in"),
    (21, "Horas do profissional adicional", [0, 0, 4], HORAS, "in"),
    (22, "Pessoas com ajuda de manhã", [0, 0, 0], INT, "in"),
    (23, "Pessoas com deslocamento acima de 50 km", [0, 0, 0], INT, "in"),
    (24, "Total de pessoas na escala", "={c}17+{c}18+{c}20", INT, "f"),
    (25, "Custo da equipe contratada", "=({c}18*{c}19+{c}20*{c}21)*" + E + "$B$30", BRL, "f"),
    (26, "Ajudas de custo", "={c}22*" + E + "$B$31+{c}23*" + E + "$B$32", BRL, "f"),
    (27, "Despesas do evento", None, None, "sec"),
    (28, "Gasolina", [100, 100, 100], BRL, "in"),
    (29, "Impressos (reserva)", [40, 40, 40], BRL, "in"),
    (30, "Maleta (reposição, opcional: R$ 50 a R$ 100)", [0, 0, 0], BRL, "in"),
    (31, "Outras despesas", [0, 0, 0], BRL, "in"),
    (32, "Custo do evento", "={c}25+{c}26+SUM({c}28:{c}31)", BRL, "tot"),
    (33, "Resultado no preço de referência", None, None, "sec"),
    (34, "Parcela da estrutura", "=" + E + "$B$23", BRL, "f"),
    (35, "Taxa e imposto sobre a venda", "={c}5*(" + E + "$B$25+" + E + "$B$26)", BRL, "f"),
    (36, "Sobra estimada", "={c}5-{c}35-{c}32-{c}34", BRL, "tot"),
    (37, "Margem", "=IF({c}5=0,0,{c}36/{c}5)", PCT, "f"),
    (38, "Preço mínimo (sobra zero)", "=({c}32+{c}34)/(1-" + E + "$B$25-" + E + "$B$26)", BRL, "f"),
    (39, "Preço para atingir a meta", "=({c}32+{c}34+" + E + "$B$24)/(1-" + E + "$B$25-" + E + "$B$26)", BRL, "tot"),
    (40, "Sobra por hora de preparação", "=IF({c}15=0,0,{c}36/{c}15)", BRL, "f"),
]
for r, lab, vals, fmt, kind in rows:
    if kind == "sec":
        section(wp, r, lab, 4)
        continue
    put(wp, f"A{r}", lab, f_tot if kind == "tot" else f_base, fill=fill_tot if kind == "tot" else None)
    for j, col in enumerate("BCD"):
        if kind == "in":
            put(wp, f"{col}{r}", vals[j], f_in, fmt, fill_in, align="right")
        else:
            put(wp, f"{col}{r}", vals.format(c=col), f_tot if kind == "tot" else f_base, fmt,
                fill_tot if kind == "tot" else None, align="right")
put(wp, "A42", "Premium: 6 reuniões bimestrais + 1 reunião final = 7 reuniões; 5 encontros; cotações de 3h por mês × 12 meses.", f_nota)
put(wp, "A43", "Profissional adicional da Premium: previsto de 4 a 5h (custo do evento de R$ 910 a R$ 945).", f_nota)
wp.column_dimensions["A"].width = 48
for col in "BCD":
    wp.column_dimensions[col].width = 18
wp.freeze_panes = "B5"

# ---------------------------------------------------------------- Simulação
wsim = ws_new("Simulação")
put(wsim, "A1", "Simulação de proposta", f_tit)
legenda(wsim, "A2")
put(wsim, "A3", "Escolha o pacote e digite o preço. Na coluna Neste evento, preencha só o que mudar; em branco vale o valor do pacote.", f_nota)
put(wsim, "A5", "Pacote")
put(wsim, "B5", "Plus", f_in, fill=fill_in)
put(wsim, "A6", "Preço que pretende cobrar")
put(wsim, "B6", 6900, f_in, BRL, fill_in)
put(wsim, "A7", "Desconto")
put(wsim, "B7", 0, f_in, BRL, fill_in)
put(wsim, "A8", "Preço com desconto", f_tot, fill=fill_tot)
put(wsim, "B8", "=B6-B7", f_tot, BRL, fill_tot)
dv = DataValidation(type="list", formula1='"Essencial,Plus,Premium Completa"', allow_blank=False)
wsim.add_data_validation(dv)
dv.add("B5")

header(wsim, 10, ["Ajustes deste evento", "Do pacote", "Neste evento", "Usado no cálculo"])
ajustes = [(11, "Contratadas até o encerramento (pessoas)", 18, INT),
           (12, "Horas de cada contratada", 19, HORAS),
           (13, "Profissional adicional (pessoas)", 20, INT),
           (14, "Horas do profissional adicional", 21, HORAS),
           (15, "Pessoas com ajuda de manhã", 22, INT),
           (16, "Pessoas com deslocamento acima de 50 km", 23, INT),
           (17, "Gasolina", 28, BRL),
           (18, "Impressos (reserva)", 29, BRL),
           (19, "Maleta (reposição)", 30, BRL),
           (20, "Outras despesas", 31, BRL),
           (21, "Horas de preparação", 15, HORAS)]
for r, lab, pr, fmt in ajustes:
    put(wsim, f"A{r}", lab)
    put(wsim, f"B{r}", f"=INDEX(Pacotes!$B${pr}:$D${pr},MATCH($B$5,Pacotes!$B$4:$D$4,0))", fmt=fmt, align="right")
    put(wsim, f"C{r}", None, f_in, fmt, fill_in, align="right")
    put(wsim, f"D{r}", f'=IF(C{r}="",B{r},C{r})', fmt=fmt, align="right")

section(wsim, 23, "Resultado", 4)
res = [
    (24, "Custo da equipe contratada", "=(D11*D12+D13*D14)*Estrutura!$B$30", BRL, ""),
    (25, "Ajudas de custo", "=D15*Estrutura!$B$31+D16*Estrutura!$B$32", BRL, ""),
    (26, "Despesas do evento", "=SUM(D17:D20)", BRL, ""),
    (27, "Custo do evento", "=SUM(B24:B26)", BRL, "tot"),
    (28, "Parcela da estrutura (média por evento)", "=Estrutura!$B$23", BRL, ""),
    (29, "Taxa e imposto sobre a venda", "=B8*(Estrutura!$B$25+Estrutura!$B$26)", BRL, ""),
    (30, "Sobra estimada", "=B8-B29-B27-B28", BRL, "tot"),
    (31, "Margem", "=IF(B8=0,0,B30/B8)", PCT, "tot"),
    (32, "Meta de sobra", "=Estrutura!$B$24", BRL, ""),
    (33, "Ainda pode gastar sem perder a meta (negativo: falta para a meta)", "=B30-B32", BRL, ""),
    (34, "Preço mínimo (sobra zero)", "=(B27+B28)/(1-Estrutura!$B$25-Estrutura!$B$26)", BRL, ""),
    (35, "Preço para atingir a meta", "=(B27+B28+B32)/(1-Estrutura!$B$25-Estrutura!$B$26)", BRL, "tot"),
    (36, "Sobra por hora de preparação", "=IF(D21=0,0,B30/D21)", BRL, ""),
    (37, "Faturamento no ano se todos os eventos fossem a este preço", "=B8*Estrutura!$B$22", BRL, ""),
    (38, "Limite de faturamento somado dos CNPJs", "=Estrutura!$B$27*Estrutura!$B$28", BRL, ""),
]
for r, lab, fml, fmt, kind in res:
    put(wsim, f"A{r}", lab, f_tot if kind else f_base, fill=fill_tot if kind else None, wrap=True)
    put(wsim, f"B{r}", fml, f_tot if kind else f_base, fmt, fill_tot if kind else None, align="right")
put(wsim, "A40", "Para guardar uma simulação: clique com o botão direito na aba Simulação, Duplicar, e renomeie com o nome do cliente.", f_nota)
wsim.column_dimensions["A"].width = 52
for col in "BCD":
    wsim.column_dimensions[col].width = 18
verde = PatternFill("solid", fgColor="E2F1E8")
verm = PatternFill("solid", fgColor="F8E3E0")
for ref in ("B30", "B33"):
    wsim.conditional_formatting.add(ref, FormulaRule(formula=[f"{ref}>=0"], fill=verde))
    wsim.conditional_formatting.add(ref, FormulaRule(formula=[f"{ref}<0"], fill=verm))
wsim.conditional_formatting.add("B37", FormulaRule(formula=["B37>B38"], fill=verm))

# ---------------------------------------------------------------- Contratos
wc = ws_new("Contratos")
put(wc, "A1", "Contratos", f_tit)
legenda(wc, "A2")
header(wc, 3, ["Cliente", "CNPJ que emite (1 ou 2)", "Pacote", "Valor do contrato", "Assinatura",
               "Data do evento", "Custo do evento", "Mês do evento", "Parcelas lançadas", "Falta lançar em parcelas"])
for r in range(4, 4 + N):
    for col, fmt in (("A", None), ("B", INT), ("C", None), ("D", BRL), ("E", DATA), ("F", DATA), ("G", BRL)):
        put(wc, f"{col}{r}", None, f_in, fmt)
    put(wc, f"H{r}", f'=IF(F{r}="","",DATE(YEAR(F{r}),MONTH(F{r}),1))', fmt=MES)
    put(wc, f"I{r}", f'=IF(A{r}="","",SUMIFS(Parcelas!$D$4:$D${3 + N},Parcelas!$A$4:$A${3 + N},A{r}))', fmt=BRL)
    put(wc, f"J{r}", f'=IF(A{r}="","",D{r}-I{r})', fmt=BRL)
dvc = DataValidation(type="list", formula1='"1,2"', allow_blank=True)
dvp = DataValidation(type="list", formula1='"Essencial,Plus,Premium Completa,Outro"', allow_blank=True)
wc.add_data_validation(dvc); wc.add_data_validation(dvp)
dvc.add(f"B4:B{3 + N}"); dvp.add(f"C4:C{3 + N}")
wc.conditional_formatting.add(f"J4:J{3 + N}", FormulaRule(formula=['AND(J4<>"",ABS(J4)>=0.01)'], fill=PatternFill("solid", fgColor="FBF0D9")))
put(wc, f"A{5 + N}", "Custo do evento: use o valor da aba Pacotes ou da Simulação (equipe, ajudas e despesas). Ele entra como saída no mês do evento.", f_nota)
for col, w in zip("ABCDEFGHIJ", (30, 14, 18, 16, 13, 13, 16, 13, 16, 16)):
    wc.column_dimensions[col].width = w
wc.freeze_panes = "B4"

# ---------------------------------------------------------------- Parcelas
wpa = ws_new("Parcelas")
put(wpa, "A1", "Parcelas a receber", f_tit)
put(wpa, "A2", "Uma linha por parcela. Escreva o cliente igual à aba Contratos. Política padrão: 30% na assinatura, 40% no meio do prazo, 30% até 30 dias antes do evento.", f_nota)
header(wpa, 3, ["Cliente", "CNPJ", "Vencimento", "Valor", "Recebida? (Sim/Não)", "Mês", "Situação"])
for r in range(4, 4 + N):
    put(wpa, f"A{r}", None, f_in)
    put(wpa, f"B{r}", f'=IF(A{r}="","",IFERROR(INDEX(Contratos!$B$4:$B${3 + N},MATCH(A{r},Contratos!$A$4:$A${3 + N},0)),"cliente não encontrado"))', fmt=INT, align="center")
    put(wpa, f"C{r}", None, f_in, DATA)
    put(wpa, f"D{r}", None, f_in, BRL)
    put(wpa, f"E{r}", None, f_in, align="center")
    put(wpa, f"F{r}", f'=IF(C{r}="","",DATE(YEAR(C{r}),MONTH(C{r}),1))', fmt=MES)
    put(wpa, f"G{r}", f'=IF(C{r}="","",IF(E{r}="Sim","Recebida",IF(C{r}<TODAY(),"Vencida","A receber")))')
dvs = DataValidation(type="list", formula1='"Sim,Não"', allow_blank=True)
wpa.add_data_validation(dvs); dvs.add(f"E4:E{3 + N}")
dvcli = DataValidation(type="list", formula1=f"=Contratos!$A$4:$A${3 + N}", allow_blank=True, showErrorMessage=False)
wpa.add_data_validation(dvcli); dvcli.add(f"A4:A{3 + N}")
wpa.conditional_formatting.add(f"G4:G{3 + N}", FormulaRule(formula=['G4="Vencida"'], fill=verm, font=Font(name=F, color="A3322B", bold=True)))
wpa.conditional_formatting.add(f"G4:G{3 + N}", FormulaRule(formula=['G4="Recebida"'], fill=verde))
for col, w in zip("ABCDEFG", (30, 8, 13, 15, 14, 12, 13)):
    wpa.column_dimensions[col].width = w
wpa.freeze_panes = "B4"

# ---------------------------------------------------------------- Lançamentos
wl = ws_new("Lançamentos")
put(wl, "A1", "Saídas variáveis e entradas avulsas", f_tit)
put(wl, "A2", "Gastos que mudam de mês para mês e dinheiro que não é parcela de contrato. Os custos fixos ficam na aba Estrutura; o custo de cada evento, na aba Contratos.", f_nota)
header(wl, 3, ["Data", "Descrição", "Tipo", "Valor", "Mês"])
for r in range(4, 4 + N):
    put(wl, f"A{r}", None, f_in, DATA)
    put(wl, f"B{r}", None, f_in)
    put(wl, f"C{r}", None, f_in)
    put(wl, f"D{r}", None, f_in, BRL)
    put(wl, f"E{r}", f'=IF(A{r}="","",DATE(YEAR(A{r}),MONTH(A{r}),1))', fmt=MES)
dvt = DataValidation(type="list", formula1='"Saída variável,Entrada avulsa"', allow_blank=True)
wl.add_data_validation(dvt); dvt.add(f"C4:C{3 + N}")
for col, w in zip("ABCDE", (13, 40, 16, 15, 12)):
    wl.column_dimensions[col].width = w
wl.freeze_panes = "A4"

# ---------------------------------------------------------------- Mês a mês
wm = ws_new("Mês a mês")
put(wm, "A1", "Financeiro mês a mês", f_tit)
legenda(wm, "A2")
put(wm, "A4", "Ano")
put(wm, "B4", 2026, f_in, INT, fill_in)
put(wm, "A5", "Caixa no início do ano")
put(wm, "B5", 0, f_in, BRL, fill_in)
put(wm, "C5", "Saldo em conta em 1º de janeiro.", f_nota)
header(wm, 7, ["Mês", "Entradas previstas (parcelas)", "Já recebido", "Entradas avulsas", "Saídas fixas",
               "Custo dos eventos", "Saídas variáveis", "Saldo do mês", "Caixa acumulado"])
P = f"Parcelas!$D$4:$D${3 + N}"
PM = f"Parcelas!$F$4:$F${3 + N}"
L = f"'Lançamentos'!$D$4:$D${3 + N}"
LM = f"'Lançamentos'!$E$4:$E${3 + N}"
LT = f"'Lançamentos'!$C$4:$C${3 + N}"
for i in range(12):
    r = 8 + i
    put(wm, f"A{r}", "=DATE($B$4,1,1)" if i == 0 else f"=EDATE(A{r - 1},1)", fmt=MES)
    put(wm, f"B{r}", f"=SUMIFS({P},{PM},$A{r})", fmt=BRL)
    put(wm, f"C{r}", f'=SUMIFS({P},{PM},$A{r},Parcelas!$E$4:$E${3 + N},"Sim")', fmt=BRL)
    put(wm, f"D{r}", f'=SUMIFS({L},{LM},$A{r},{LT},"Entrada avulsa")', fmt=BRL)
    put(wm, f"E{r}", "=Estrutura!$B$18", fmt=BRL)
    put(wm, f"F{r}", f"=SUMIFS(Contratos!$G$4:$G${3 + N},Contratos!$H$4:$H${3 + N},$A{r})", fmt=BRL)
    put(wm, f"G{r}", f'=SUMIFS({L},{LM},$A{r},{LT},"Saída variável")', fmt=BRL)
    put(wm, f"H{r}", f"=B{r}+D{r}-E{r}-F{r}-G{r}", fmt=BRL)
    put(wm, f"I{r}", f"=$B$5+H{r}" if i == 0 else f"=I{r - 1}+H{r}", fmt=BRL)
put(wm, "A20", "Total do ano", f_tot, fill=fill_tot)
for col in "BCDEFGH":
    put(wm, f"{col}20", f"=SUM({col}8:{col}19)", f_tot, BRL, fill_tot)
put(wm, "I20", "=I19", f_tot, BRL, fill_tot)
wm.conditional_formatting.add("H8:I19", FormulaRule(formula=["H8<0"], font=Font(name=F, color="A3322B")))

section(wm, 22, "Limite de faturamento no ano (por vencimento da parcela)", 9)
header(wm, 23, ["CNPJ", "Previsto no ano", "Já recebido", "Limite", "Uso do limite", "Situação"])
for i, cn in enumerate((1, 2)):
    r = 24 + i
    ini, fim = "DATE($B$4,1,1)", "DATE($B$4,12,31)"
    put(wm, f"A{r}", cn, fmt=INT, align="center")
    put(wm, f"B{r}", f'=SUMIFS({P},Parcelas!$B$4:$B${3 + N},$A{r},Parcelas!$C$4:$C${3 + N},">="&{ini},Parcelas!$C$4:$C${3 + N},"<="&{fim})', fmt=BRL)
    put(wm, f"C{r}", f'=SUMIFS({P},Parcelas!$B$4:$B${3 + N},$A{r},Parcelas!$C$4:$C${3 + N},">="&{ini},Parcelas!$C$4:$C${3 + N},"<="&{fim},Parcelas!$E$4:$E${3 + N},"Sim")', fmt=BRL)
    put(wm, f"D{r}", "=Estrutura!$B$28", fmt=BRL)
    put(wm, f"E{r}", f"=IF(D{r}=0,0,B{r}/D{r})", fmt=PCT)
    put(wm, f"F{r}", f'=IF(B{r}<=D{r},"Dentro do limite",IF(B{r}<=D{r}*(1+Estrutura!$B$29),"Na tolerância: DAS complementar sobre o excesso","Acima da tolerância: risco de desenquadramento"))')
wm.conditional_formatting.add("F24:F25", FormulaRule(formula=['LEFT(F24,6)="Acima "'], fill=verm))
wm.conditional_formatting.add("F24:F25", FormulaRule(formula=['LEFT(F24,6)="Na tol"'], fill=PatternFill("solid", fgColor="FBF0D9")))
put(wm, "A27", "Confirme com a contabilidade se o limite do MEI de vocês conta pelo recebimento ou pela emissão da nota.", f_nota)
put(wm, "A28", "Saídas fixas vêm do total da aba Estrutura. Mudou um custo fixo, mude lá.", f_nota)
wm.column_dimensions["A"].width = 14
for col in "BCDEFGHI":
    wm.column_dimensions[col].width = 16
wm.column_dimensions["F"].width = 18
wm.freeze_panes = "B8"

wb.save(OUT)
print(OUT, OUT.stat().st_size)
