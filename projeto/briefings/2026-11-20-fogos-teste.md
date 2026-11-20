# Reel TESTE — Fornecedor na hora certa (fogos no beijo)
- Data: 2026-11-20 | Slug: `fogos-teste` | Composição: `ReelFogosTeste` (src/MotionReel.tsx, preset `FOGOS`) | Status: v2 de teste enviada — NÃO aprovada

## Objetivo / CTA
Teste pedido pela Paty ("um vídeo só pra teste"). Tema escolhido por Claude: a Impactar coordenando fornecedores (assunto ainda não usado nos reels). CTA: "Manda a data e a cidade no direct." (mesmo dos reels aprovados).

## Plataforma e duração
Reels 9:16, 15,1 s (11,6 s de vídeo + 3,5 s de tela final) na v2.

## Público
Casais noivos (não confirmado para este teste).

## Brutos usados
- `originais/lote-fornecedores/d973d512770b47258ca69ba241382f65.mp4` — Drive › 06 — Institucional › Durante o Evento / Execução › Vídeos (id 1g6UMe-5Vv2ZTSi_Ig5G6ybyWpVX1byYF). Baixado pelo conector (8,7 MB).
- Também baixado e NÃO usado: `166d1c40…mov` (17 s, convidadas se abraçando no salão) — fora do tema.

## Estilo
Guia oficial (`estilos/impactar-guia-oficial.md`), no padrão dos MotionReels aprovados: gancho digitado, uma frase, tela final petróleo com CTA. Ficha pessoal não se aplica (não é vídeo falado).

## Obrigatório / Proibido neste vídeo
Casal não identificado (nome não aparece). Sem SFX (padrão dos reels aprovados; música entra pelo Instagram).

## Inventário técnico
- d973d512: 9,7 s, HEVC 720 × 1280 vertical, 30 fps, 7,4 Mbps, AAC (áudio não usado). Criação 20/05/2026. Fogos acesos no beijo no altar; aos ~4 s aparece um fotógrafo em frente ao casal.
- Convertido para `public/brutos/fogos/fogos.mp4` (H.264 CRF 16, sem áudio).
- Filtro de qualidade: ampliação 1,5x (720 → 1080). Quadro ampliado conferido: levemente macio, sem blocos/granulação visível. Passa para teste; para publicar, buscar arquivo maior se existir.

## Plano de edição
- 0–4,6 s: gancho digitado "Você vê os fogos. / *A gente vê o relógio.*" (etiqueta "Bastidores da Impactar").
- 4,8–9,6 s: "Cada fornecedor entra / *na hora certa.*" (etiqueta "No grande dia").
- 9,7–13,2 s: tela final "O momento é de vocês. / *O relógio é nosso.*" + "Manda a data e a cidade no direct."
- Clipe inteiro, sem cortes internos (não há fala).

## Não confirmado / decisões para a Paty
1. ~~Coordenação da pirotecnia~~ — CONFIRMADO pela Paty em 20/11: a Impactar coordenou. Não há vídeo de bastidor do sinal.
2. Autoria do vídeo (videomaker?) — o Guia pede crédito.
3. Cor x P&B: o Guia pede P&B para beijo; mantido em cor porque o assunto são os fogos.
4. O bloco de texto passa sobre a parte de baixo do vestido (rostos livres). Alternativa: subir o texto só neste reel.

## Log de versões
- 2026-11-20 — Conferência 5.5: ffprobe 1080 × 1920, 30 fps, 13,2 s. Sem fala → checagem de palavras não se aplica; sem áudio por padrão. Folha de quadros: quebra ruim no itálico da tela final ("gente." sozinha) → frase trocada para "O relógio é nosso." e re-render conferido.
- 2026-11-20 — exports/fogos-teste.mp4 enviado para validação.
- Render local: `npx remotion render ReelFogosTeste exports/fogos-teste.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (o download do Chrome do Remotion é bloqueado na rede deste ambiente).
- 2026-11-20 — Paty pediu sugestões; aplicadas na v2: gancho "Esse beijo teve / *hora marcada.*" (coordenação confirmada); plano dos fogos (2–9,7 s do bruto) a 0,8x por duplicação de quadros, sem interpolação → `public/brutos/fogos/fogos_lento.mp4`, total 15,1 s.
- 2026-11-20 — Som original NÃO usado: espectrograma mostra música com voz cantada (vibrato 3–9 s) — o bruto já é um vídeo editado com trilha (cortes em 0,63 s, 1,03 s e 2,0 s). Risco de direitos autorais. Reforça a pendência de crédito ao videomaker.
- 2026-11-20 — Conferência 5.5 da v2: 1080 × 1920, 30 fps, 15,1 s; folha de quadros ok (gancho, frase, tela final sem quebra ruim). Câmera lenta conferida só em quadros parados — possível leve tranco no movimento, a avaliar no celular. exports/fogos-teste-v2.mp4 enviado.
