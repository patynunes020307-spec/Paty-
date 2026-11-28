# Reels falados da Paty — Cortejo, Entrada e ritmo, Seu único trabalho
- Data: 2026-11-28 | Slug: fala-* | Status: teste de validação (Cortejo)

## Fontes das regras
- Drive (pasta de trabalho 1yIzpRoxnt2ZKJu-mZYnJnI1AJhfvZuDA): "Instrucoes de edicao v2 - videos fala Paty 28nov.txt", "Notas e direcao visual", 3 arquivos "- fala.txt".
- Guia de Publicações (Notion), conferido em 28/11 — versão de 26/11/2026.
- Paty, 28/11: "quero que você seja meu editor… pode seguir com as recomendações… pode usar coisas antigas, fotos, takes da gente trabalhando, desde que com resolução bacana".

## Decisões (recomendações aceitas pela Paty em 28/11)
- Usar as gravações já existentes (Cortejo 14h40, IMG_9673, IMG_9674), sem trocar palavras; só tirar frases inteiras quando o conteúdo prometer o que as notas proíbem.
- Logo só na capa (Guia). Sem os 1,5 s de logo no fim pedidos na v2.
- Gancho e legenda em Montserrat 600 (fonte oficial, "grossa"). Fala sem acelerar (v2 prevalece sobre o 1,2x da ficha pessoal).
- Voz real mantida (pedido explícito). Sem SFX; música a Paty põe no app.

## Inventário (originais/2026-11-28-fala/, só leitura)
- cortejo-1440.mp4 — 1080×1920, 27,3 s, fala limpa (ruído de fundo -57 dB: sem redução de ruído).
- entrada-ritmo-IMG_9673.mp4 — 1080×1920, 121,7 s, 2 tomadas com pausas longas.
- seu-unico-IMG_9674.mp4 — 1080×1920, 39,2 s.
- teste-IMG_9671.mp4 — 4K, ensaio ("não tô gostando") — não usar como fala.
- novos/: IMG_9608 (equipe com prancheta, 1080p, ótimo) · IMG_9600.jpeg (altar decorado, 2268×4032, sem rostos) · IMG_9605.jpeg (equipe em roda, 2268×4032) · IMG_9635–9638/9646–9648 (720p, cerimônia/making of, com música — só trechos curtos, sem rosto, áudio descartado) · IMG_9641 e IMG_9645 (Reels já editados com texto — não usar).

## Vídeo 1 — Cortejo (`FalaCortejo`, src/FalaPaty.tsx)
- Fala 1,0–27,3 s do arquivo (26,3 s). Gancho "Quem decide a ordem / das entradas?" 0–3,3 s.
- Apoios: 9635 2,0 s (noiva e pai de costas, véu) em "Quem entra com você…"; 9608 (equipe com prancheta) em "A gente alinha…"; 9635 9,0 s (corredor de longe) em "cada entrada tem o ritmo…".
- Legenda: transcrição local palavra a palavra, agrupada à mão (src/legendas/cortejo.ts).
- Render: Chrome do Remotion não baixa aqui → usar `--browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.

## Vídeos 2 e 3 — cortes previstos
- Entrada e ritmo: tirar "o convidado larga o celular e olha pra você" (notas). Melhor tomada de cada frase.
- Seu único trabalho: tirar "você nem fica sabendo que teve algum imprevisto" e "casamento bom… nem fica sabendo que teve" (notas). Fecha em "Você só vive o momento".

## Log de versões
- 28/11 — exports/fala-cortejo-teste.mp4 (0–10 s) enviado para validar estilo.
