# Ficha de estilo da Paty — "editado no celular"
- Criada em 20/11/2026 a pedido da Paty: "salva essa ficha de estilo e segue ela toda vez que editar pra mim".
- Status: **completa** (6 regras; o "7." da mensagem original era só um número que sobrou — confirmado pela Paty em 20/11).
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
   - Segue a fala do **vídeo já cortado e a 1,2x**; palavra que caiu no corte não aparece.
   - **Nunca atravessa um corte** e **não termina em palavra fraca** ("de", "que", "para", "o") — ela desce para a próxima.
   - **Sem relâmpago:** legenda com menos de 0,3 s se junta à vizinha.
   - **Entra na hora, sem fade, e fica até a próxima** (nada de saída gradual).
   - Lista de grafia por vídeo: nomes próprios, marcas e sistemas mantêm a grafia correta (ex.: Impactar); o resto fica minúsculo.
5. **Peças pequenas acima da cabeça**, uma de cada vez, **entrando na palavra falada**:
   - selo com ícone e nome;
   - lista com ✅;
   - fluxo caixa → caixa.
   - **No máximo uma a cada 8 a 10 s.**
6. **Movimento:** cada peça entra com **um pulo rápido (0,3 s)** e **sai seca**. **Aproximação seca de ~14%** no começo das frases fortes.
   - A aproximação seca acontece **só no corte** que antecede a frase forte. Sem corte ali, não aproxima (salto de escala no meio da fala parece defeito).
   - **Contra "nada parado mais de 2 s":** em fala longa sem peça, uma aproximação **muito lenta e contínua (3–5% no trecho)**; se ainda faltar ritmo, alternar o plano a cada corte entre aberto (100%) e fechado (114%).
   - O zoom **nunca mostra a borda do quadro**.
   - No plano fechado, **olhos a ~35% da altura**, com espaço acima da cabeça (onde entram as peças).
   - **Um movimento de escala por vez** (a aproximação lenta é a única que corre por baixo).

## Som (efeitos sonoros)
- **Um efeito por evento** (regra do projeto; nada empilhado).
- **Só ganha som o que aparece:** peça entrando, aproximação seca. Corte sem mudança de plano e aproximação lenta ficam **sem som**.
- **Whoosh:** o pico cai no frame em que a peça **para**, não no começo do movimento. Pop, clique e ding começam no evento.
- **Nível bem abaixo da voz**, sempre.
- **Escalada:** o impacto mais forte do vídeo vai na frase-chave da abertura; no corpo, nada maior que ele.
- Biblioteca atual tem só 6 efeitos (`public/sfx/`): repetição é aceita por enquanto; ampliar só se incomodar na revisão.

_Itens de legenda, câmera e som acima adaptados dos guias da skill `fluxo-de-edicao` (MIT), em 20/11/2026. Ficaram de fora por conflito com o CLAUDE.md ou com esta ficha: trava/seguir o rosto, até 3 sons empilhados, legenda abaixo do queixo e câmera com aceleração/rampa (cara de agência)._

## Como aplicar no Remotion (notas técnicas)
- Posição: detectar o rosto **uma vez por plano** (não seguir quadro a quadro — proibido no CLAUDE.md) e reservar a faixa acima da cabeça para abertura/peças e a faixa do peito para a legenda.
- Corte de silêncio: transcrição local (whisper.cpp, palavra a palavra) + detecção de silêncio; nunca cortar dentro de palavra.
- 1,2x: `playbackRate` no `<Video>`/`<Audio>` ou acelerar no ffmpeg (atempo 1.2, sem alterar o tom da voz) — legendas recalculadas.
- "Pulo" = escala 0 → 1,08 → 1 em 0,3 s, uma vez (não é pulsar em loop). "Sai seca" = corte, sem fade.
- Aproximação de 14% = corte seco de escala 1 → 1,14 no início da frase forte (sem animação de zoom), volta seca no próximo corte.
