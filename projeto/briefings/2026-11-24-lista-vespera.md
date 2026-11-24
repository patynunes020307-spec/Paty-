# Teste de formato: lista em blocos + "comenta PALAVRA" — Checklist da véspera
- Data: 24/11/2026 | Slug: lista-vespera | Status: **trecho de validação (aguardando Paty)**
- Origem: estudo `estilos/ref-2026-11-24-tutorial-e-lista.md` (Ref B, @filipe.viana). Pedido da Paty: "Inventa um brinde fictício e testa para mim. Prefiro os que verde água."

## Objetivo / CTA
Testar o formato salvável com CTA de palavra-chave. CTA: "Comenta VÉSPERA que eu te envio o checklist completo da véspera do casamento".
⚠ **Brinde FICTÍCIO** (inventado a pedido da Paty). Não publicar até existir o checklist real para enviar.

## Plataforma e duração
Reels, 1080 × 1920, 30 fps, 21,2 s (Guia: 15–30 s). Não confirmado se vai ao ar.

## Público
Noivas/casais em fase final de preparação (não confirmado).

## Brutos usados
Nenhum — tela só com texto sobre petróleo escuro + selo nude suave no canto (sinal de marca para telas sem foto).

## Estilo
Guia oficial (Cormorant + palavra-chave em itálico nude, Montserrat nas etiquetas, sem caixas/pílulas/ícones, sem tela final de logo) + destaques em **verde-água** (escolha da Paty, 24/11): fio e etiqueta "BLOCO n/4", numeração dos itens.

## Obrigatório / Proibido neste vídeo
- Sem som no arquivo (música pela biblioteca do Instagram); por isso o trecho não tem SFX.
- Sem pulsar: o único movimento contínuo é o fio verde-água crescendo durante cada bloco (marca o tempo, nunca volta).
- ⚠ Conflito com o Guia: "um texto por vez". Aqui cada bloco tem título + 3–4 itens — é a essência do formato testado.

## Inventário técnico
Sem brutos. Composição `ListaVespera` em `src/ListaBlocos.tsx` (636 quadros).

## Plano de edição
| Tempo | Tela |
|---|---|
| 0–2,6 s | Gancho: "CHECKLIST DA VÉSPERA" / "O que resolver *um dia antes do sim*" |
| 2,6–6,2 s | Bloco 1/4 Documentos e *alianças* (3 itens) |
| 6,2–10,2 s | Bloco 2/4 Kit de *emergência* (4 itens) |
| 10,2–13,8 s | Bloco 3/4 Fornecedores *confirmados* (3 itens) |
| 13,8–17,2 s | Bloco 4/4 E vocês *dois* (3 itens) |
| 17,2–21,2 s | CTA: Comenta *"VÉSPERA"* + promessa (termina aqui, sem tela final) |
Itens entram em cascata (0,18 s de intervalo, sobem 24 px saindo do desfoque); cada tela sai seca em 0,2 s.
Blocos com 3,4–4 s (a Ref B usa ~2 s; alongado para dar leitura).

## Log de versões
- 24/11 — `exports/lista-vespera-teste.mp4` (0–8 s: gancho + bloco 1 + início do bloco 2).

## Nota técnica
O render tentava baixar o Chrome de remotion.media (bloqueado na rede). Usar `--browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
