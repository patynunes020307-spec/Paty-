# Bastidores da semana
- Data: 2026-10-14 | Slug: `bastidores-semana` | Composição: `BastidoresSemana` | Status: entregue (v1)

## Objetivo / CTA
CONFIRMADO: bastidores da semana. CTA: não confirmado (fechamento só com selo + @impactarcerimonial).

## Plataforma e duração
CONFIRMADO: 20 s. Plataforma: Instagram (Reels — inferido do "vou colocar a música no Instagram").
**Exportado sem som**: CONFIRMADO — a Paty põe a música no Instagram. Por isso, sem SFX.

## Público
não confirmado (voice.md: canal fala com casais — CONFIRMADO para YouTube; vale para este vídeo? não confirmado)

## Brutos usados (originais/)
Os 3 enviados em 2026-10-14, juntos num vídeo só (implícito em "bastidor da semana").

## Estilo
CONFIRMADO: padrão limpo. Cores da marca (Azul #203F51, Pêssego #E9CEBB, Areia #FAF7F3 — padrão visual v6), Cormorant Garamond + Montserrat locais (public/fonts, OFL). Cortes secos.

## Obrigatório / Proibido neste vídeo
CONFIRMADO: nada obrigatório na tela.
Criança: corte não respondido → **cortada por padrão** (mais seguro, sem autorização confirmada).

## Inventário técnico (etapa 2 — ffprobe, só leitura)

| Arquivo | Gravado em | Duração | Vídeo | Áudio | Conteúdo (OBSERVADO nos frames) |
|---|---|---|---|---|---|
| IMG_3674.mov | 2026-10-06 10:45, iPhone 15 Pro Max | 1,05 s | HEVC 2816×1584 girado → vertical, 60 fps | AAC estéreo, muito baixo (média −37 dB) | Mulher caminhando num deck de madeira com vista para montanhas, dia nublado. Parece vídeo de Live Photo. |
| IMG_4019.mov | 2026-10-12 20:01, iPhone 15 Pro Max | 7,08 s | HEVC 1920×1080 girado → vertical, VFR (~29,8 fps, base 120) | PCM mono, alto (máx −0,9 dB) | Noite, luzes coloridas; homem de óculos escuros cantando ao microfone entre homens de camisa branca/colete. |
| 45038B4C.mov | 2026-10-10 19:28 | 16,34 s | H.264 1080×1920, 30 fps (já vertical) | AAC mono, alto (máx −0,5 dB) | Dupla ao vivo (voz/violão + acordeão) em frente a painel de folhas douradas com neon "Let's Party"; criança passa em primeiro plano; estante com logo/nome do músico visível. Metadado de criação = hoje → provavelmente reexportado/enviado por app. |

Alertas:
- **3 eventos diferentes** (06, 10 e 12/10). Juntar num vídeo só é decisão editorial (não confirmado).
- **IMG_3674 tem 1 s** — serve só como inserto rápido.
- **IMG_4019 é VFR + HEVC** → precisa conversão para H.264 30 fps constante (cópia em public/brutos/, original intacto).
- **Áudio é música ao vivo (cover?)** — não é vídeo falado; transcrição/legenda de fala pouco útil. Risco: música protegida pode ser silenciada/bloqueada no Instagram.
- **Criança identificável** (45038B4C) e convidados reconhecíveis em todos → autorização de imagem: não confirmada.
- Integridade dos originais: hashes em `.tmp/originais.sha256`; arquivos em originais/ marcados só-leitura.

## Plano de edição (etapa 5)

Cópias de trabalho em public/brutos/bastidores-semana/ (H.264 30 fps CFR, sem áudio). Deck: HDR (HLG) convertido para SDR + câmera lenta 0,5x aproveitando os 60 fps.

| # | Frames | Tempo | Trecho | Texto |
|---|---|---|---|---|
| 1 | 0–62 | 0,0–2,1 s | Deck 06/10 (1,05 s em 0,5x) | "ter · 06/10" + título "BASTIDORES / da semana" |
| 2 | 63–190 | 2,1–6,4 s | Banda 10/10, origem 1,33–5,6 s | "sáb · 10/10" |
| 3 | 191–287 | 6,4–9,6 s | Banda 10/10, origem 13,07–16,3 s | — |
| 4 | 288–499 | 9,6–16,6 s | Noite 12/10, inteiro | "seg · 12/10" |
| 5 | 500–599 | 16,6–20,0 s | Fechamento: selo + fio pêssego + @impactarcerimonial | — |

Criança fora: origem 0–1,3 s e 5,7–13,0 s da banda conferidas quadro a quadro nas bordas.
Datas dos rótulos: metadados de gravação dos arquivos (45038B4C: data do metadado, arquivo reexportado — conferir).
Checagem dos proibidos: sem tremida artificial, sem pulsar, sem seguir rosto, sem som, nenhum quadro parado (todo clipe é câmera na mão; fechamento com aproximação lenta).

## Log de versões
- 2026-10-14 — exports/bastidores-semana-teste.mp4 (0–8 s) enviado para validação.
- 2026-10-14 — trecho APROVADO pela Paty.
- 2026-10-14 — **v1 entregue**: exports/bastidores-semana-v1.mp4 — 1080×1920, 30 fps, 20,0 s (600 frames), H.264, sem áudio, 29 MB. Originais conferidos por hash: intactos.
