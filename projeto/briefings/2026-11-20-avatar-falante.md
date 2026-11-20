# Briefing — Avatar falante (teste) · 20/11/2026

- **Objetivo:** testar avatar falante da Paty para stories de dúvidas frequentes (exceção B registrada em `estilos/impactar-guia-oficial.md`).
- **Público:** noivos que seguem a Impactar no Instagram.
- **Duração:** 15–20 s · vertical 1080 × 1920.
- **Estilo:** Guia oficial Impactar (Cormorant + Montserrat, paleta de `src/marca.ts`), legenda no terço inferior; etiqueta "conteúdo criado com IA".
- **Brutos:** `originais/avatar/` — 6 fotos da sessão (THI00420/421/422/530/558/563). Foto-base escolhida: **THI00422** (frontal, olhar na câmera, fundo claro, 1717×2576).
- **Voz:** áudio real da Paty lendo o roteiro (pendente).
- **Roteiro (rascunho, aguarda aprovação):**
  "Sabe o que a cerimonialista faz no dia do casamento? Ela cuida de tudo o que vocês não deveriam ver. Do horário dos fornecedores ao momento certo de abrir as portas. Pra vocês só viverem o dia."
- **Ferramenta:** ElevenLabs (foto + áudio → vídeo com lip-sync; modelos omnihuman-v1.5 / creatify-aurora / heygen-avatar6). Orçar créditos antes de gerar.
- **Entregável:** `exports/2026-11-20_Story_Avatar-FAQ-cerimonialista.mp4` — só publicar com confirmação.

## Áudio real da Paty (recebido 20/11)
- Original: `originais/avatar/audio-paty-bastidores.m4a` (38 s, somente leitura). Cópia tratada (volume normalizado, cortado em 35,2 s): `.tmp/avatar/audio-paty-tratado.m4a`.
- Transcrição local (whisper.cpp): "Das duas da tarde até a festa: um casamento pelos bastidores. Antes da cerimônia a gente confere o espaço, recebe a família, revisa o roteiro com o noivo, arruma a cauda do vestido, ajusta o véu. Depois do sim, organiza as fotos com quem precisa estar nelas. E na festa seguimos acompanhando cada momento, para vocês só precisarem viver o dia."
- Substitui o roteiro-rascunho. Duração ~35 s (story único aceita até 60 s).

## Status
- Concluído: fotos em originais/avatar/ (somente leitura); exceção registrada no Guia local e no Notion (seção 4, 20/11); flow ElevenLabs criado: "Impactar — Avatar falante (TESTE interno)" (id MaZv6QlwAJCJWHVvUyL6).
- Voz de teste interno escolhida: "Isabela" (pt-BR, voz sintética — nunca publicar). Orçamento do áudio: 193 créditos (~US$ 0,02). Geração não iniciou: fila gratuita do ElevenLabs ocupada (nada cobrado).
- Bloqueio 1: o ambiente não consegue enviar a foto ao ElevenLabs (rede bloqueia o envio). A Paty sobe THI00422 direto no flow.
- Bloqueio 2: o orçamento do vídeo só sai depois que a foto estiver no flow.
- Próxima ação: Paty sobe a foto → gerar áudio de teste → orçar vídeo → gerar 1 take com o ok dela.
