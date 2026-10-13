---
name: "pos-evento-impactar"
description: "Gera o Relatório Final do evento da Impactar Cerimonial e conduz o encerramento pós-evento: dados do evento previsto x real, avaliação de cada fornecedor, ocorrências, quebras e avarias, encaminhamentos com responsável e prazo, e o fechamento interno (avaliação no banco de fornecedores, ressarcimentos nas pendências, hora extra e extras no financeiro, mensagem de entrega e pedido de depoimento ao casal). Use sempre que Paty pedir relatório final, relatório pós-evento, 'como foi o evento', registrar ocorrências, quebras, atrasos de fornecedor, ressarcimento, ou mandar anotações, áudios, prints ou fotos do dia do evento depois que ele aconteceu — mesmo sem dizer 'relatório'. Casamento, 15 anos e aniversário. Não é o Checklist (preparação) nem as Pendências (antes do evento)."
---

# Relatório Final e Encerramento — Impactar Cerimonial

O Relatório Final é uma **entrega contratada** (pacote Premium e proposta: "Relatório pós-evento enviado por e-mail"). Ele existe para três coisas:

1. **Prestar contas ao cliente** — o que aconteceu, o que falhou, o que a Impactar resolveu no dia.
2. **Dar base para cobrança** — ressarcimento de itens não entregues, quebras e atrasos só se cobram com fato, horário e registro.
3. **Fechar o ciclo interno** — o que aprendemos sobre cada fornecedor e sobre o nosso processo.

Visual: `padrao-visual-impactar` (v6) — ler aquela skill e montar com `impactar_docx.js`. Eyebrow do banner: **"Relatório Final"**. Nada de emoji no conteúdo (o v6 proíbe; versões antigas do relatório usavam 📋 🎩 etc. — não copiar).

## 1. Fontes e proveniência

Fontes típicas: anotações da equipe no dia, áudio transcrito, prints de WhatsApp, fotos de quebras, Checklist e Roteiros do evento (para o **previsto**), contratos dos fornecedores (para o **contratado**).

- **Fato só entra se estiver na fonte.** Horário, quantidade, nome do item: se não está escrito, fica `pendente()` (A CONFIRMAR) e vira pergunta à Paty. Nada de "aproximadamente" inventado.
- **Previsto vem do Checklist/Roteiros; real vem do relato do dia.** Se não houver horário real registrado, não calcule atraso.
- **Duas fontes divergem** (ex.: anotação diz 14h30, áudio diz 14h45) → sinalize a divergência à Paty, não escolha.
- **Fornecedor sem ocorrência registrada** não vira automaticamente "Cumpriu conforme contratado". Liste esses fornecedores para a Paty confirmar antes de fechar (seção 5). Ausência de anotação pode ser só esquecimento da equipe.

## 2. Estrutura do documento (ordem fixa)

Seção sem dado **não aparece**. Rótulos por tipo de evento: `references/tipos-evento.md` do padrão visual.

### 1. Banner
`criarDocumento({ eyebrow: 'Relatório Final', nome, subtitulo: 'dd/mm/aaaa · Local', versao })`.

### 2. Dados do evento — `infoGrid`
Local da cerimônia · Local da recepção · Horário do convite · Horário oficial da cerimônia · **Início real da cerimônia** (com atraso em minutos, se houver horário real) · Recepção (início–fim real) · **Convidados presentes** (e previstos, se a fonte tiver) · Celebrante · Protagonistas (nomes; telefones só na versão equipe).

### 3. Previsto x real — `tabela(['Momento','Previsto','Real','Obs.'])`
Só os marcos que tiverem horário real registrado: abertura do espaço/portaria, chegada dos fornecedores críticos, início da cerimônia, entrada na recepção, jantar, encerramento, **hora extra** (quanto, de quem, autorizada por quem). Sem horário real na fonte → a seção não aparece. Hora extra é dado financeiro: nunca omitir quando houver.

### 4. Fornecedores e avaliação — `tabela(['Fornecedor','Serviço','Avaliação'], …, [3,2,6])`
- Uma linha por fornecedor do evento (fonte: Checklist / lista de fornecedores).
- **A Impactar não se autoavalia nesta tabela** — ela é a autora do relatório; a autoavaliação enfraquece o documento perante o cliente.
- Avaliação sem ocorrência confirmada: "Cumpriu conforme contratado".
- Com ocorrência: resumo de uma linha + "ver ocorrência N".

### 5. Ocorrências — uma `alerta(titulo, texto, 'atencao')` por ocorrência, numeradas
Cada ocorrência em **bloco próprio** (nunca duas no mesmo parágrafo) com:
- **Fato** — o que aconteceu, com horário e quantidade. Sem adjetivo, sem culpa ("o porteiro chegou às 14h30; o combinado era 13h30"), nunca "o porteiro foi irresponsável".
- **Contratado** — o que estava combinado, se houver contrato/alinhamento na fonte.
- **Impacto** — o que isso causou no evento (ou "sem impacto para os convidados").
- **Como a Impactar resolveu no dia**, se resolveu.
- **Encaminhamento** — remete à seção 7.

Separar fato de opinião: sugestões de processo ("exigir aviso formal de substituição") vão para a seção 7 ou para o fechamento interno, não misturadas ao fato.

### 6. Quebras e avarias — `tabela(['Item','Quantidade','Responsável','Status'])`
Uma tabela para todos os fornecedores (coluna Responsável = de quem é o item). Status: **Pendente ressarcimento** / **Ressarcido** / **Sem cobrança** (decisão do cliente ou do fornecedor). Abaixo, `para()` com o registro fotográfico: quem fez, quando ("Registro fotográfico feito pela equipe Impactar no encerramento, dd/mm/aaaa"). Sem foto registrada → dizer isso; afeta a força da cobrança. **Sem valores em R$** no documento (valor fica no financeiro).

### 7. Encaminhamentos — `tabela(['Ação','Quem resolve','Prazo'])`
Tudo que ainda está aberto depois do evento: formalizar ocorrência por escrito ao fornecedor X, cobrar ressarcimento, devolver item, entregar presentes/sobras, aguardar fotos. **Quem resolve**: `Noivos` · `Fornecedor: [nome]` · `Espaço` · `Impactar` — só preencha se a fonte disser; senão `pendente()`. Quem cobra ressarcimento de fornecedor contratado pelo casal é decisão de escopo: se a Impactar assumir, é trabalho pós-evento que precisa estar no contrato (ver seção 4, item 3). Sem esta tabela o ressarcimento morre no relatório.

### 8. Considerações finais — `para()`, 3 a 5 linhas
Resultado geral, convidados presentes, atraso relevante (ou ausência dele), o que a equipe resolveu no dia sem chegar ao casal, e que os encaminhamentos da seção 7 seguem em acompanhamento. Tom: firme, acolhedor, sem autoelogio.

## 3. Versões

- **Cliente** (padrão — é o que se entrega): `versao: 'cliente'`, sem telefones, sem notas internas sobre fornecedores, sem avaliação comercial ("não indicaríamos mais"). Entregar **.docx + PDF**.
- **Equipe** (só se houver conteúdo interno relevante): `versao: 'equipe'`, com telefones e observações internas.
- Não confundir com a ficha de avaliação do banco de fornecedores, que é sempre interna.

Nome fixo, pasta operacional do evento (mesmas regras de Drive do Checklist — criar uma vez, depois atualizar o mesmo arquivo; nunca duplicar):
`04 — Relatório Final — [Nomes] (dd-mm).docx` e o PDF com o mesmo nome.

## 4. Fechamento interno (depois do relatório, no chat)

Entregar à Paty, em lista curta, o que o evento gera para fora do relatório — e executar com a skill de cada área quando ela confirmar:

1. **Banco de fornecedores** (`banco-fornecedores`, Modo Avaliação) — uma avaliação por fornecedor com ocorrência; os demais com nota padrão confirmada pela Paty.
2. **Pendências** (`pendencias-evento-impactar`) — cada encaminhamento da seção 7 vira pendência "Pós-evento" com quem resolve e prazo.
3. **Financeiro** (`gestao-financeira`, Custo por Evento) — hora extra da equipe Impactar, horas além do contratado, extras feitos no dia. **Sinalizar sempre** hora extra ou serviço extra da Impactar que não está no contrato — incluindo a Impactar conduzir cobranças e ressarcimentos junto a fornecedores do casal depois do evento: é margem perdida se ninguém cobrar ou delimitar.
4. **Mensagem ao casal** (WhatsApp, pronta para copiar) — curta: agradecimento, envio do relatório, o que a Impactar está encaminhando por eles. Pedido de depoimento **em mensagem separada**, depois que os encaminhamentos estiverem resolvidos — pedir avaliação com ressarcimento pendente é pedir no pior momento.
5. **Causa-raiz** — para cada ocorrência, uma linha: a falha era evitável por algum alinhamento nosso? Se sim, propor o ajuste no Checklist ou na mensagem a fornecedores (ex.: "confirmar por escrito horário da portaria em D-2"). Problema que se repete entre eventos é mudança de processo, não nota de rodapé.

## 5. Antes de fechar — perguntar à Paty (só o que faltar)

- Fornecedores sem ocorrência: "Posso marcar como 'Cumpriu conforme contratado': [lista]?"
- Horários reais e convidados presentes, se não vieram na fonte.
- Hora extra: houve? de quem? foi autorizada por quem?
- Quebras: há registro fotográfico?
- Versão: só cliente, ou também equipe?

## 6. No chat

Resumo de 4 a 6 linhas: ocorrências (quantas, com quem), itens a ressarcir, encaminhamentos abertos, alertas financeiros (hora extra/extras não cobrados) e o que ainda está A CONFIRMAR. Depois, o fechamento interno da seção 4.

## Exemplo

`exemplos/relatorio_final_modelo.js` monta um Relatório Final completo (Renata & Pedro, 01/05/2026) só com componentes do padrão visual. Rodar: `node exemplos/relatorio_final_modelo.js <caminho>/padrao-visual-impactar/scripts/impactar_docx.js <saida.docx>`. Use como ponto de partida — os dados são de um evento real, não reaproveite conteúdo em outro evento.
