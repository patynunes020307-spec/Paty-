# Fonte do Reel

- `template.html`: animação (1440 × 2560). `__LOGO__` é trocado pelo conteúdo de `logo-path.txt`.
- `vectorize.py`: vetoriza o logo (`python3 vectorize.py logo.png logo.svg`).
- `capture.js`: grava os quadros com Playwright (`node capture.js frames 30`).
- Fontes: Cormorant Garamond e Montserrat (licença OFL, via @fontsource).

Montagem: `python3 -c "t=open('template.html').read(); open('reel.html','w').write(t.replace('__LOGO__', open('logo-path.txt').read()))"`,
depois `node capture.js frames 30` e
`ffmpeg -framerate 30 -i frames/%04d.png -c:v libx264 -crf 14 -pix_fmt yuv420p -movflags +faststart -an reel.mp4`.

Logo atual: vetorizado do `logo-impactar.png` de 280 px (padrão de documentos). Trocar pela versão
oficial em alta (01.5.png da pasta de logos no Drive) quando estiver disponível.
