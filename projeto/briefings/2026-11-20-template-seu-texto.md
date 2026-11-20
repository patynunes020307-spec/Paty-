# Modelo editável "[SEU TEXTO]"
- Data: 2026-11-20 | Composição: `TemplateSeuTexto` (src/TemplateSeuTexto.ts + src/MotionReel.tsx) | Status: modelo aprovado (20/11); v1 1080p com mais cenas enviada

## Origem
- Pedido: instalar blixvip/MotionClone e recriar as animações de `referencia.mp4` como projeto editável com "[SEU TEXTO]".
- MotionClone: repositório inexistente/privado (não instalado). `referencia.mp4`: não encontrado (local nem Drive › Banco de imagens).
- Paty liberou "qualquer vídeo". O clipe escolhido é bruto (sem animações): motions = os já aprovados do MotionReel.

## Bruto
- Drive › Banco de imagens › copy_DC1A82DC-74E5-4440-999F-964DBF2CF244.MP4 (6,7 s, 720×1280, 30 fps, corte em 2,8 s).
- Cópia em originais/template-seu-texto/ e cópia de trabalho em public/brutos/template/clip.mp4 (fora do git).
- ⚠ 720p ampliado 1,5× → não passa no filtro de qualidade para publicação; serve como modelo. Para publicar: trocar por arquivo 1080p+.

## Estrutura (10,2 s)
- 0–3,0 s gancho digitado (etiqueta + linha + itálico) · 3,2–6,6 s bloco "01" · 6,7–10,2 s tela final petróleo com fio.
- Editar: textos e tempos em src/TemplateSeuTexto.ts ou no painel de props do Studio.

## Log
- 2026-11-20 — exports/template-seu-texto-teste.mp4 (10,2 s, 1080×1920). freezedetect ok. Render local exige `--browser-executable` (download do Chrome bloqueado na nuvem).
- 2026-11-20 — Paty: "Aprovado, coloque mais cenas e troque por 1080".
- Clipes do Drive até 10 MB eram 720p; originais 4K baixados direto (drive.usercontent.google.com, já liberado no ambiente): IMG_9461/9462/9463.MOV (mesmo casamento do clipe do teste, brinde dos noivos) → originais/template-seu-texto/; cópias 1080×1920 H.264 em public/brutos/template/. clip.mp4 (720p) removido.
- **v1**: exports/template-seu-texto-v1.mp4 (18,4 s, 1080×1920): 9463 0–4,0 · 9462 0–3,8 · 9461 0–2,7 · 9463 13,0–17,4 · CTA 3,5 s. Textos: gancho 0–3,8 · 01 4,0–10,3 · 02 10,7–14,7. freezedetect ok. Filtro de qualidade: ok (fonte 4K reduzida).
