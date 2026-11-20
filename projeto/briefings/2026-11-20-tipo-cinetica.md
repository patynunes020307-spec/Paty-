# Motion — Tipografia cinética (10 s)
- Data: 2026-11-20 | Composição: `TipoCinetica` (src/TipoCinetica.tsx) | Status: v1 APROVADA — no Drive › Criativos
- Objetivo: frase entrando com tipografia cinética, nas cores do Guia. Sem brutos (só texto).
- Estilo: Guia oficial (estilos/impactar-guia-oficial.md) + skill `kinetic-typography` (iart-ai/kinetic-typography-skills, MIT).
- Formato: 1080 × 1920, 30 fps, 10 s, sem áudio.

## Como mudar o texto
Props em `TIPO_PADRAO` (src/TipoCinetica.tsx): `texto`, `destaque` (palavra em itálico nude; padrão = última), `etiqueta` (opcional, Montserrat caixa-alta).

## Linha do tempo
0,2 s fio nude desenha · 0,5 s palavras sobem por máscara (100 ms entre palavras, ease-out expo) · palavra-chave entra com desfoque→nítido e espaçamento fechando · 3,0 s fio verde-água sublinha · bloco deriva devagar o tempo todo · 9,1 s palavras saem para cima.

## Pendências
- Frase: a Paty pediu para eu criar ("Pode criar"). v1: etiqueta "Assessoria de casamentos" + "Vocês vivem o dia. / A gente cuida do *resto.*" — APROVADA.
- Monograma IC no canto (telas sem foto): o arquivo oficial é JPG com fundo branco e não pode ir sobre fundo escuro.
- Reels pedem 15–20 s (até 30 s se narrativo, regra de 20/11); esta peça de 10 s serve como abertura/trecho, não como Reel sozinho.

## Log
- 2026-11-20 — exports/tipo-cinetica-previa.mp4 (texto provisório). Quadros conferidos: 10, 22, 45, 120, 285, 299; corrigido vazamento do "]" itálico pela máscara.
- 2026-11-20 — v1: exports/tipo-cinetica-v1.mp4 com a frase criada. Suporte a quebra de linha ("\n") e folga maior na máscara para acentos.
- 2026-11-20 — APROVADA ("Aprovado"). Drive › Criativos › 2026-11-20_Motion_TipoCinetica_APROVADO.mp4 (1xIiVFXH9Mj2Qa4BcaNoCfVK-zaX67H7x, 1.326.585 bytes, idêntico ao export). Não publicado.
