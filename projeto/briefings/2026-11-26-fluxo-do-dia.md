# Reel — Fluxo do dia do evento
- Data: 26/11/2026 | Slug: fluxo-do-dia | Status: teste de estilo enviado (aguardando aprovação)

## Objetivo / CTA
Versão em vídeo do carrossel "Quem cuida do dia enquanto você vive" (objetivo: Confiança).
CTA na etiqueta final: "Manda para quem vai casar com você" (confirmado no carrossel).

## Plataforma e duração
Instagram Reel 9:16, 1080 × 1920, 30 fps, 27 s (formato passo a passo: Guia permite até 30 s). Sem som; música pela biblioteca do Instagram.

## Público
Noivas de 25 a 44 anos, BH e Grande BH (Guia de Publicações, versão 25/11/2026).

## Brutos usados
Nenhum vídeo. Foto real: "Renata e Pedro — Cerimônia ao ar livre — Vertical" (Drive › Banco de imagens), 1707 × 2560, crédito Celebrizar (confirmado pela Paty). Cópia em `public/fluxo/`.

## Estilo
`estilos/impactar-guia-oficial.md` + Guia do Notion (seção 11). Componentes no padrão de `MotionReel.tsx`.

## Obrigatório / Proibido neste vídeo
- Textos das fases iguais aos do carrossel.
- Sem tela final e sem logo no fim; logo só na capa (`script-nude.png`).
- Animações só da seção 2B: digitação, fade + subida, fio desenhado, check desenhado.

## Inventário técnico
Foto única, colorida (pedido da Paty em 26/11, sobrepõe o P&B do Guia). Zoom máximo 1,28 sobre o cover, então não há ampliação além do arquivo original.
Fotos da pasta Renata e Pedro com menos de 10 MB (limite do conector). Cópias reduzidas em `public/fluxo/` (fora do git).

## Plano de edição
0–3,5 s gancho digitado · 3,5–23,5 s quatro fases de 5 s (título + 3 checks, um por vez) · 23,5–27 s frase final + CTA sobre a foto aberta.

## Log de versões
- 26/11: teste de 9 s (`exports/fluxo-do-dia-teste.mp4`), frames 0–269.
- 26/11: teste colorido (`exports/fluxo-do-dia-teste-cor.mp4`): foto colorida natural a pedido da Paty, degradê mais leve, recortes ancorados na base para o texto não cobrir o casal.
- 26/11: v1 completa (`exports/fluxo-do-dia-v1.mp4`, 27 s, 1080 × 1920, 30 fps, sem áudio) + capa (`exports/fluxo-do-dia-capa.jpg`). Fotos escolhidas da pasta Renata e Pedro (pedido da Paty), todas coloridas: 0658 (gancho, fase 01, final), 0934 beijo (fase 02), 0989 brinde (fase 03), 1046 cumprimento (fase 04). Crédito: Celebrizar. Status: prévia enviada, aguardando "aprovado".
