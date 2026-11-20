---
name: iniciar
description: Inicia uma produção de vídeo vertical no projeto Remotion (projeto/) — briefing, inventário dos brutos, transcrição local, ficha de estilo, trecho de validação e só depois o vídeo inteiro. Use para "INICIAR", "começar um vídeo", "novo vídeo", "editar esses brutos" ou quando a Paty colocar arquivos em projeto/originais/.
---

# INICIAR — nova produção de vídeo

Regras do CLAUDE.md da raiz valem em todas as etapas. Em especial: `originais/` é só leitura,
transcrição é sempre local, e a lista do que é proibido na edição.

Trabalhe dentro de `projeto/`. Faça você mesmo tudo o que não depender da Paty.
Pare e chame a Paty **só** nos dois portões marcados com ⛔.

## 0. Checagem rápida (sem perguntar nada)

- `projeto/node_modules` existe? Se não, `npm install`.
- Liste `originais/`, `referencias/`, `estilos/`, `briefings/`.
- Studio rodando em http://localhost:3000? Se não, suba com `npm run dev` (config "studio" em `.claude/launch.json`).
- Carregue a skill `remotion-best-practices` antes de escrever qualquer markup.

## 1. Briefing ⛔ (portão 1)

Monte o rascunho de `briefings/AAAA-MM-DD-<slug>.md` com o que já dá para inferir dos arquivos e do pedido.
Pergunte **numa única mensagem**, só o que faltar (no máximo 5 itens):

1. Objetivo do vídeo e ação esperada de quem assiste (CTA).
2. Plataforma e duração-alvo (Reels/Shorts/TikTok; ex.: 30–60 s).
3. Quais brutos de `originais/` entram (se não for óbvio).
4. Estilo: ficha existente em `estilos/`, vídeo em `referencias/` ou "o padrão".
5. Algo que não pode faltar ou não pode aparecer.

Modelo do briefing:

```md
# <Título>
- Data: | Slug: | Status: briefing
## Objetivo / CTA
## Plataforma e duração
## Público
## Brutos usados (originais/)
## Estilo (estilos/… ou referencias/…)
## Obrigatório / Proibido neste vídeo
## Inventário técnico          (etapa 2)
## Plano de edição             (etapa 5)
## Log de versões
```

Tudo que a Paty não confirmou entra como **"não confirmado"** — nunca preencha por suposição.

## 2. Inventário dos brutos (só leitura)

Para cada bruto usado: `ffprobe` (duração, resolução, fps, rotação, codec, faixa de áudio).
Registre no briefing. Sinalize: vídeo horizontal (vai precisar de reenquadramento fixo, nunca seguir rosto quadro a quadro),
fps diferente de 30, áudio ruim ou ausente.

Para usar no Remotion, **copie** (nunca mova) para `public/brutos/<slug>/` — essa pasta fica fora do git.
Se precisar converter (ex.: HEVC/VFR → H.264 30 fps), o resultado vai para `public/brutos/<slug>/`, o original fica intacto.

## 3. Transcrição local

Sempre local, nunca serviço pago ou API externa.
Atalho pronto: `npm run transcrever -- <video> <slug>` (faz os passos 1–3 abaixo; modelo via `WHISPER_MODELO`).

1. Extraia o áudio para `.tmp/<slug>.wav` (16 kHz, mono): `ffmpeg -i <bruto> -ar 16000 -ac 1 .tmp/<slug>.wav`.
2. Use `@remotion/install-whisper-cpp` (instale com `npx remotion add @remotion/install-whisper-cpp` na primeira vez):
   `installWhisperCpp` + `downloadWhisperModel` em `projeto/whisper.cpp/` (fora do git),
   `transcribe` com `language: "pt"` e `tokenLevelTimestamps: true`, `toCaptions` para o formato `Caption` de `@remotion/captions`.
   Modelo padrão: `medium`; use `large-v3-turbo` se a máquina aguentar.
3. Salve em `public/legendas/<slug>.json`.
4. Revise nomes próprios, termos do setor e marcas — liste no briefing as correções feitas e o que ficou em dúvida.

(A skill `remotion-captions` sugere `@remotion/whisper-webgpu`; aqui o padrão é whisper.cpp porque roda em CPU em qualquer máquina. WebGPU só se a Paty pedir.)

## 4. Estilo

- Se houver ficha em `estilos/`, siga-a.
- Se houver vídeo em `referencias/`, estude-o antes: `ffprobe`, detecção de cortes
  (`ffmpeg -i ref -vf "select='gt(scene,0.3)',showinfo" -f null -`), alguns frames em `.tmp/` para olhar.
  Escreva `estilos/<nome>.md`: ritmo médio de corte, legenda (fonte, peso, tamanho, posição, cor, destaque de palavra),
  uso de SFX, transições, zooms/movimentos, cores, abertura e fechamento.
- Sem nenhum dos dois: estilo limpo — legenda centralizada no terço inferior, fonte Google via `@remotion/google-fonts`,
  cortes secos, SFX só em momentos-chave.

## 5. Plano de edição

No briefing, escreva o plano antes de codar: trechos usados (in/out em segundos), cortes de silêncio e repetições,
gancho dos primeiros 3 s, legendas, textos de apoio, b-roll, SFX (um por evento — nunca empilhar) e fechamento/CTA.

Confira o plano contra a lista do que é proibido (CLAUDE.md): sem tremida, sem pulsar, sem seguir rosto quadro a quadro,
sem sons empilhados, nada parado mais de 2 s em vídeo falado.

## 6. Trecho de validação ⛔ (portão 2)

- Crie a composição `src/<Slug>.tsx`, registre em `Root.tsx` (1080 × 1920, 30 fps).
- Valide com `npm run lint` e `npx remotion compositions`.
- Renderize só um trecho curto e representativo (5–10 s, com legenda e pelo menos um SFX):
  `npx remotion render <Id> exports/<slug>-teste.mp4 --frames=<ini>-<fim>`.
- Mostre o trecho e o link do Studio para a Paty. **Pare e espere a aprovação.** Ajuste e repita se ela pedir.

## 7. Vídeo inteiro

Só depois da aprovação:

- `npx remotion render <Id> exports/<slug>-v1.mp4` (versões seguintes: `-v2`, `-v3`…; nunca sobrescreva uma versão entregue).
- Confira com `ffprobe`: 1080 × 1920, 30 fps, duração esperada, áudio presente.
- Faça mais uma passada pela lista do que é proibido.
- Atualize o briefing: status "entregue", versão, o que mudou.
- Entregue em poucas linhas: arquivo, duração, o que ficou "não confirmado" ou em dúvida.

---

## Variante: versões de gancho (uma gravação, 5 começos)

Use quando a Paty gravar **vários ganchos seguidos + o corpo uma vez só** (ou pedir "versões de gancho", "testar ganchos", "5 versões").
Cada versão = 1 gancho + o MESMO corpo, para postar como **Reels de teste** (só para não seguidores) e levar o vencedor ao feed.
Composição `VersaoGancho` (`src/VersaoGancho.tsx`), dados em `ganchos/<slug>.json`, registro de resultados em `ganchos/registro.md`.

**Como a Paty grava (mandar antes, se ela perguntar):** 5 ganchos de tipos diferentes (pergunta, dor, número real, promessa, polêmica),
pausa de **2 s** entre eles; depois o corpo inteiro uma vez. Errou? Para, respira e repete a frase inteira. Corpo de 15–30 s (Guia).
Conferir antes se a conta mostra a opção de Reels de teste; sem ela, as 5 versões no feed viram repetição — não fazer.
Se aparecer casal/cliente, confirmar autorização de uso de imagem para 5 publicações.

Etapas 0–2 iguais (briefing, inventário). Copie o bruto para `public/brutos/<slug>/gravacao.mp4`. Depois:

1. **Transcrição:** `npm run transcrever -- public/brutos/<slug>/gravacao.mp4 <slug>` → `public/legendas/<slug>.json`.
   Revise nomes e termos (corrija direto no JSON).
2. **Achar ganchos:** `npm run ganchos:achar -- <slug>` (opções `--ganchos 5`, `--pausa 1.0`).
   Lista os blocos de fala com tempo e texto e grava `ganchos/<slug>.json` como **RASCUNHO**.
   Remova à mão do `corpo` as tentativas erradas e frases repetidas; preencha `palavrasChave` (2–5 palavras de destaque)
   e ajuste `enquadramento` (fixo, olhando um quadro do bruto).
3. ⛔ **Portão 1b:** mostre à Paty a tabela "versão · início–fim · texto do gancho" e o texto do corpo.
   Só depois da confirmação troque `status` para `"confirmado"` (o render recusa rascunho).
4. ⛔ **Portão 2 (validação):** `npm run ganchos:render -- <slug> --teste` → `exports/<slug>-teste.mp4` (versão 1, 8 s) + relatório.
5. **Todas as versões:** `npm run ganchos:render -- <slug>` → `exports/<slug>-versao-N.mp4` + `exports/<slug>-relatorio.md`.
   Nova rodada: `--rodada v2` (nunca sobrescreve). Uma versão só: `--so 3`.
   O script iguala o volume da voz (-14 LUFS) e confere cada arquivo: 1080×1920, 30 fps, duração, áudio,
   quadro preto, pausa > 1,2 s e **nova transcrição comparada ao texto esperado** (acusa palavra faltando/sobrando).
6. Assista ao menos o primeiro corte de cada versão (estalo e legenda sobre o rosto não são detectados automaticamente).
   Entregue a tabela do relatório e abra a rodada em `ganchos/registro.md` com os textos e tipos dos ganchos.

Na nuvem (sessão do Claude Code), exporte antes `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` para o download do modelo
do whisper passar pelo proxy (os scripts `npm run` já ligam `NODE_USE_ENV_PROXY=1`). Modelo: `WHISPER_MODELO` (padrão `medium`).
Correção pedida duas vezes pela Paty vira regra fixa: na composição, nesta skill ou em `estilos/`.
