# Reel TESTE — Fornecedor na hora certa (fogos no beijo)
- Data: 2026-11-20 | Slug: `fogos-teste` | Composição: `ReelFogosTeste` (src/MotionReel.tsx, preset `FOGOS`) | Status: v3 APROVADA — pacote completo no Drive

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

## Plano de edição (v2)
- 0–4,6 s: gancho digitado "Esse beijo teve / *hora marcada.*" (etiqueta "Bastidores da Impactar").
- 4,9–11,4 s: "Cada fornecedor entra / *na hora certa.*" (etiqueta "No grande dia").
- 11,6–15,1 s: tela final "O momento é de vocês. / *O relógio é nosso.*" + "Manda a data e a cidade no direct."
- Vídeo: 0–2 s no ritmo original; plano dos fogos a 0,8x. Sem áudio (som original tem música).
- v1 (histórico): gancho "Você vê os fogos. / *A gente vê o relógio.*", 13,2 s, sem câmera lenta.

## Não confirmado / decisões para a Paty
1. ~~Coordenação da pirotecnia~~ — CONFIRMADO pela Paty em 20/11: a Impactar coordenou. Não há vídeo de bastidor do sinal.
2. ~~Autoria~~ — CONFIRMADO em 20/11: vídeo feito pela Impactar (crédito Impactar).
3. ~~Cor x P&B~~ — cor aprovada; virou exceção no Guia (cena cujo protagonista é a luz).
4. O bloco de texto passa sobre a parte de baixo do vestido (rostos livres). Alternativa: subir o texto só neste reel.

## Log de versões
- 2026-11-20 — Conferência 5.5: ffprobe 1080 × 1920, 30 fps, 13,2 s. Sem fala → checagem de palavras não se aplica; sem áudio por padrão. Folha de quadros: quebra ruim no itálico da tela final ("gente." sozinha) → frase trocada para "O relógio é nosso." e re-render conferido.
- 2026-11-20 — exports/fogos-teste.mp4 enviado para validação.
- Render local: `npx remotion render ReelFogosTeste exports/fogos-teste.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (o download do Chrome do Remotion é bloqueado na rede deste ambiente).
- 2026-11-20 — Paty pediu sugestões; aplicadas na v2: gancho "Esse beijo teve / *hora marcada.*" (coordenação confirmada); plano dos fogos (2–9,7 s do bruto) a 0,8x por duplicação de quadros, sem interpolação → `public/brutos/fogos/fogos_lento.mp4`, total 15,1 s.
- 2026-11-20 — Som original NÃO usado: espectrograma mostra música com voz cantada (vibrato 3–9 s) — o bruto já é um vídeo editado com trilha (cortes em 0,63 s, 1,03 s e 2,0 s). Risco de direitos autorais. Reforça a pendência de crédito ao videomaker.
- 2026-11-20 — Conferência 5.5 da v2: 1080 × 1920, 30 fps, 15,1 s; folha de quadros ok (gancho, frase, tela final sem quebra ruim). Câmera lenta conferida só em quadros parados — possível leve tranco no movimento, a avaliar no celular. exports/fogos-teste-v2.mp4 enviado.
- 2026-11-20 — APROVADA ("Aprovado nós que fizemos"). Paty autorizou mudar o Guia: 3 decisões registradas no Notion (Guia de Publicações) e em estilos/impactar-guia-oficial.md — exceção de cor para cenas de luz; tela final frase + CTA sem logo; vídeo editado com trilha não reaproveita áudio + câmera lenta ≤ 0,8x + crédito Impactar.
- 2026-11-20 — Capa `CapaFogos` (exports/fogos-capa.png/.jpg) SEM logo: as 4 logos originais do Drive (Logo-original-1 a 4) e os JPGs oficiais são escuros; recolorir é proibido. Pendência: versão clara oficial da logo para imagens noturnas.
- 2026-11-20 — Drive › Criativos › 2026-11-20_Reel_Fogos_Hora_Marcada (1THlD1o3qgvmxcdGbAyHAUn3Y8_5GUN9Q): capa APROVADO.jpg + legenda (Google Doc). Vídeo (15,5 MB) acima do limite de 10 MB do conector → a subir pela Paty como 2026-11-20_Reel_Fogos_Hora_Marcada_APROVADO.mp4 (cópia local: exports/fogos-v2-APROVADO.mp4).
- 2026-11-20 — Paty: "Até lá final com logo é melhor, a logo aparecendo." v3: tela final em fundo claro #F7F2EF, texto petróleo, itálico azul auxiliar, logo original nude + verde-água (multiply) a 480 px da base, fora da área da legenda do Instagram. Guia no Notion e ficha local corrigidos (substitui a regra "sem logo" registrada mais cedo no mesmo dia). exports/fogos-v3.mp4 (15,1 s, 1080 × 1920, 30 fps) conferido e enviado.
- 2026-11-20 — v3 APROVADA ("Aprovado"). Substitui a v2 (que não chegou a subir). Cópia local: exports/fogos-v3-APROVADO.mp4. A subir pela Paty em Criativos › 2026-11-20_Reel_Fogos_Hora_Marcada como 2026-11-20_Reel_Fogos_Hora_Marcada_APROVADO.mp4.
- 2026-11-20 — Cartão criado no Calendário Editorial (Notion): https://app.notion.com/p/41e0c576a2f981e4ad3cc4a9d6e19c70 — Etapa Aprovado, Pilar Confiança, sem data/horário (aguarda Paty). Pendência geral: os outros reels aprovados deste projeto (Antes dos convidados, Diário, Padrinhos, Cauda etc.) não têm cartão no Calendário.
- 2026-11-20 — Vídeo v3 subido pela Paty (2 cópias em Criativos). Cópia 1GUh2LTePkiwmSzJ5HykNXFWML5XVgPqx (15.690.962 bytes = export local) movida para a pasta do reel e renomeada 2026-11-20_Reel_Fogos_Hora_Marcada_APROVADO.mp4. Cópia duplicada 1QS_KT5SJZCNr8vz7YNTOepmhYFj3hB1N (fogos-v3.mp4) deixada na raiz de Criativos — aguardando OK da Paty para ir para a lixeira. Na pasta do reel havia outro arquivo com o mesmo nome APROVADO (44 MB, id 133XzUfbj7IwrAoxjPr2MX1I9DtkAeFra, enviado 13h02 e renomeado/movido 13h15) — não é este reel; renomeado para CONFERIR_nao-e-o-reel-fogos_44MB.mp4, nada apagado. Pacote completo: capa + legenda + vídeo.
