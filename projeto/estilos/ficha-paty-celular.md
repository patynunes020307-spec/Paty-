# Ficha de estilo da Paty — "editado no celular"
- Criada em 20/11/2026 a pedido da Paty: "salva essa ficha de estilo e segue ela toda vez que editar pra mim".
- Status: **FECHADA com 6 itens** (21/11/2026: a Paty deixou a decisão comigo; o item 7 nunca foi enviado). Se ela mandar um item novo, acrescentar.
- Escopo: **CONFIRMADO pela Paty em 20/11 ("Ok"): vale para vídeos falados (pessoa falando para a câmera).** Reels de bastidor da Impactar seguem o Guia do Notion. Histórico: Conflita com o Guia de Publicações da Impactar (Notion) em: caixa branca e faixa preta (o Guia proíbe "caixas com borda, faixas"), legenda minúscula sem fonte da marca, logos de outros sistemas. Até a resposta: vale para **vídeos falados (pessoa falando para a câmera)**; os Reels de bastidor da Impactar seguem `impactar-guia-oficial.md`.

## Regras

1. **Cara de vídeo gravado e editado no celular**, nada de cara de agência. Na dúvida, menos.
2. **Corta quase todo silêncio e toda repetição, sem engolir palavra.** Acelera o vídeo final para **1,2x**.
3. **Abertura de 3 a 5 s acima da cabeça:**
   - fila com as **logos dos sistemas que o vídeo cita**;
   - a **frase principal numa caixa branca com letra preta**;
   - **uma faixa preta embaixo** (ex.: `PASSO A PASSO + PROMPTS`).
   - **Nunca cobre o rosto.**
4. **Legenda minimalista:** 2 ou 3 palavras por vez, **minúscula, branca, sem caixa e sem cor**, **no peito**, sempre no mesmo lugar.
5. **Peças pequenas acima da cabeça**, uma de cada vez, **entrando na palavra falada**:
   - selo com ícone e nome;
   - lista com ✅;
   - fluxo caixa → caixa.
   - **No máximo uma a cada 8 a 10 s.**
6. **Movimento:** cada peça entra com **um pulo rápido (0,3 s)** e **sai seca**. **Aproximação seca de ~14%** no começo das frases fortes.

## Como aplicar no Remotion (notas técnicas)
- Posição: detectar o rosto **uma vez por plano** (não seguir quadro a quadro — proibido no CLAUDE.md) e reservar a faixa acima da cabeça para abertura/peças e a faixa do peito para a legenda.
- Corte de silêncio: transcrição local (whisper.cpp, palavra a palavra) + detecção de silêncio; nunca cortar dentro de palavra.
- 1,2x: `playbackRate` no `<Video>`/`<Audio>` ou acelerar no ffmpeg (atempo 1.2, sem alterar o tom da voz) — legendas recalculadas.
- "Pulo" = escala 0 → 1,08 → 1 em 0,3 s, uma vez (não é pulsar em loop). "Sai seca" = corte, sem fade.
- Aproximação de 14% = corte seco de escala 1 → 1,14 no início da frase forte (sem animação de zoom), volta seca no próximo corte.
