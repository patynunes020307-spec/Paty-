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
- 28/11 — Paty: "Gostei, só quero o texto conforme o guia, motions, cortes, edições mais animadas".
  v1 completa: texto no padrão do Guia (fio nude + etiqueta Montserrat + Cormorant com 2ª linha itálico nude),
  gancho digitado, lista com check ("Alinhado semanas antes:"), frases do Guia em "Cada entrada tem ritmo / e tem sentido."
  e "A equipe já sabe / o que vai fazer.", 12 cortes (enquadramento fechado 1,16 em cortes secos + apoios 9635, 9647, 9608, foto 9605),
  legenda Montserrat 52 px escondida enquanto lista/frase do Guia está na tela.
  exports/fala-cortejo-v1.mp4 (26,3 s, 1080×1920, 30 fps, com a voz) + exports/fala-cortejo-v1-capa.jpg (frame 26,7 s, logo Logo-original-1.png pequena).
- 28/11 — Paty pediu retoque (manchas, dentes, batom suave), notou "cabelo curto" e pediu melhor enquadramento.
  v2: retoque GLOBAL no vídeo da fala, sem rastrear rosto (public/brutos/cortejo/fala-ret.mp4):
  bilateral sigmaS 6/sigmaR 0,05 (pele) · colortemperature 7600 mix 0,6 + eq sat 1,08 (tira o tom sépia; dentes mais claros) ·
  huesaturation r+m -0,3 (batom mais suave). Enquadramento: aberto 1,08 / fechado 1,22, origem 50% 22%.
  Cabelo: na gravação das 14h40 ela está sem as tranças (nos IMG_9673/9674 está com tranças) — não é editável.
  exports/fala-cortejo-v2.mp4 + exports/fala-cortejo-v2-capa.jpg.
- 28/11 — Paty: "Ótimo" (sobre o Cortejo v2). Feitos os vídeos 2 e 3 no mesmo estilo e retoque.
  Entrada e ritmo v1 (47,2 s): montagem de IMG_9673 (15,80–23,50 · 24,42–34,25 · 34,94–43,70 · 52,10–61,85 · 103,95–110,20 · 111,28–116,15),
  sem "Quando isso é conduzido… o convidado larga o celular e olha pra você". Gancho "Decoração linda. / E o ritmo da entrada?",
  lista "O ritmo é:" (tempo certo · música junto · pausa antes do sim), frases "Não é a decoração, / é o ritmo." e "A entrada começa / antes do dia.".
  Apoios: foto altar 9600, corredor 9647 (10 s), coro 9647 (1 s), véu 9635, casal no altar 9636 (39,5 s).
  Seu único trabalho v1 (17,1 s): montagem de IMG_9674 (6,55–19,40 · 21,95–24,72 · 28,05–29,50) →
  "Quando tem alguém que está conduzindo, você só vive o momento." (sem as frases "nem fica sabendo").
  Lista "Quem resolve?" (fornecedor · convidado · chuva), fecho "Você só vive / o momento.". Apoios: equipe 9608, foto 9605.
  Enquadramento destes dois: origem da aproximação embaixo (rosto mais baixo no quadro). Capas: entrada 2,5 s · único 14,0 s (zoom 1,15).
- 28/11 — Paty: "o primeiro vídeo tá com delay, slow motion". Diagnóstico: faixas sincronizadas; IMG_9673 (cópia 1080p do Drive)
  com voz ~6 % mais grave (F0 219 Hz × 232 Hz no IMG_9674 da mesma sessão) e fala a 2,0 palavras/s (×2,9 nos outros) → cópia desacelerada.
  Correção: fala-ret-vn.mp4 (setpts/1,0594 + asetrate ×1,0594; F0 volta a 232 Hz). Tempos convertidos (naVelocidade), legenda conferida (±0,05 s).
  exports/fala-entrada-v2.mp4 (44,5 s) + capa v2.
  Cortejo (cortejo-1440.mp4, "conversão, não é o original MOV"): ~27 % de quadros repetidos → imagem travadinha. Não dá para criar os quadros que faltam; pedir o MOV original.
- 28/11 — Paty: "continua em slow motion, travando muito". Diagnóstico refeito:
  (1) Correção de velocidade da v2 estava ERRADA — teste boca × voz confere na escala 1,0; desfeita.
  (2) IMG_9673 (cópia 1080p do Drive) repete 1 quadro a cada 2 (imagem a 15 q/s). Montagem refeita com só os quadros reais +
      quadros intermediários (minterpolate mci/aobmc, 30 q/s), mesma duração/sincronia. Original .MOV pedido à Paty.
  (3) Quadros corrompidos (imagem "picotada" em tiras) no render com <Video> do @remotion/media — nos 3 vídeos.
      Trocado por <OffthreadVideo>; varredura quadro a quadro sem falhas.
  (4) Clipe do altar 9636 começava com a câmera subindo do chão → início 2,2 s.
  Cortejo: medida correta = 1 % de quadros repetidos (normal) — o "27 %" anterior foi erro de medição.
  Entregues: fala-cortejo-v3, fala-entrada-v4, fala-unico-v2 (+ capas).
- 28/11 — Paty mandou referência (referencias/ref-2026-11-28-efeitos.mp4, "4 estilos de edição") e pediu "efeitos assim" + legenda TikTok
  do vídeo "No dia do seu casamento". Feito `EditorialUnico` (src/EditorialUnico.tsx), 18,6 s: capa de revista ("O DIA / do seu casamento…"),
  palavras gigantes (ÚNICO, NOIVA, VOCÊ, MOMENTO), tela dividida (Paty em cima, equipe embaixo + lista "Quem resolve?"),
  cartão flutuante com a equipe, tela tipográfica final (modelo B). Mecânica adaptada, sem copiar layout; sem caixas atrás da legenda.
  Conflitos com o Guia (letra a letra, cartão com sombra leve, tela final tipográfica) — decisão expressa da Paty prevalece; avisado.
  exports/editorial-unico-v1.mp4 + capa (CapaFalaUnico).
  Legenda TikTok proposta (não publicada): ver resposta de 28/11.
- 28/11 — Paty: "Crie todos os vídeos" (estilo editorial). src/Editorial.tsx (modelo por dados) substitui EditorialUnico.tsx.
  Entregues: exports/editorial-cortejo-v1.mp4 (27,4 s) · editorial-entrada-v1.mp4 (48,4 s) · editorial-unico-v2.mp4 (18,6 s) + capas.
  Varredura quadro a quadro: só cortes e entrada da capa (sem quadros corrompidos).
