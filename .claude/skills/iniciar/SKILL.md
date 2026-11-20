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

1. Extraia o áudio para `.tmp/<slug>.wav` (16 kHz, mono): `ffmpeg -i <bruto> -ar 16000 -ac 1 .tmp/<slug>.wav`.
2. Use `@remotion/install-whisper-cpp` (instale com `npx remotion add @remotion/install-whisper-cpp` na primeira vez):
   `installWhisperCpp` + `downloadWhisperModel` em `projeto/whisper.cpp/` (fora do git),
   `transcribe` com `language: "pt"` e `tokenLevelTimestamps: true`, `toCaptions` para o formato `Caption` de `@remotion/captions`.
   Modelo padrão: `medium`; use `large-v3-turbo` se a máquina aguentar.
3. Salve em `public/legendas/<slug>.json`.
4. Corrija os termos de `estilos/glossario-transcricao.md` (Impactar, Alma & Afeto, nomes recorrentes).
   Revise também os outros nomes próprios, termos do setor e marcas — liste no briefing as correções feitas e o que ficou em dúvida.
   Erro que aparecer em mais de um vídeo vai para o glossário (resolve na origem, não a cada vídeo).
5. **Calibre o silêncio desta gravação** (nunca use limite fixo como `-30dB`: celular em salão tem ruído de fundo alto).
   Meça o volume médio (RMS) em janelas de 50 ms:
   `ffmpeg -i .tmp/<slug>.wav -af "asetnsamples=800,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=.tmp/<slug>-rms.txt" -f null -`
   (800 amostras = 50 ms a 16 kHz). Ruído de fundo F ≈ percentil 10 das janelas, fala S ≈ percentil 90.
   **Silêncio = sequência de janelas abaixo de F + 6 dB que dure pelo menos 0,14 s.**
   Não use `silencedetect` com áudio ruidoso: ele compara amostra por amostra, os picos do ruído passam do limite e ele não acha
   silêncio nenhum (testado em 20/11).
   Se `S − F < 8 dB` (áudio ruidoso), o volume não separa fala de silêncio: corte só pelos tempos das palavras e avise no briefing.

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

### Regras de corte

- **Nunca comer palavra.** A borda de cada corte vai para o silêncio real medido no áudio (limite da etapa 3), não para o
  tempo da transcrição (que costuma marcar fim de palavra cedo). Folga de 30–40 ms antes e 40–60 ms depois; fade de áudio de ~12 ms.
  Corte só onde há pausa dos dois lados. **Melhor sobrar uma hesitação do que comer meia palavra.**
- **Quanto cortar:**
  - Vídeo falado (ficha `ficha-paty-celular.md`, regra 2 "corta quase todo silêncio"): pausa de 0,25–1 s vira ~0,1 s; acima de 1 s vira ~0,2 s.
  - Demais vídeos: pausa de 0,25–1 s vira 0,3 s; de 1–3 s vira 0,8 s; acima de 3 s vira 0,5 s.
  - Pausa abaixo de 0,25 s fica. Pausa intencional depois de frase forte fica com pelo menos 0,4 s.
- **Regravações:** procure a mesma frase repetida em até 60 s (mesmo começo de frase ou 4 palavras seguidas iguais).
  Mantenha a **última** tomada, salvo se ela estiver incompleta ou com tropeço. Liste cada grupo no plano —
  `"<frase>" → tomadas em 12,4 s e 31,0 s → mantendo 31,0 s` — para a Paty poder trocar.
- **Nunca cortar:** risada, suspiro, reação ("nossa", "ai"). Antes de cortar um "silêncio", confira o volume: se a janela
  estiver mais de ~10 dB acima do ruído de fundo, tem som ali — mantenha e cite no plano.
- **O CTA final nunca é cortado.** Para encurtar, corte o meio.

Confira o plano contra a lista do que é proibido (CLAUDE.md): sem tremida, sem pulsar, sem seguir rosto quadro a quadro,
sem sons empilhados, nada parado mais de 2 s em vídeo falado.

## 5.5 Conferência (antes de cada ⛔ e antes de entregar)

Nada vai para a Paty sem passar por aqui. Se você não publicaria, não mostre.

1. **Fala completa:** extraia o áudio do vídeo renderizado e transcreva de novo (whisper.cpp local, mesmo modelo).
   Compare com as palavras que deviam estar no trecho (a legenda já cortada), ignorando acento, pontuação e fala coloquial
   (pra/para, tá/está, tô/estou). Se mais de 1,2x, espere a mesma fala, só mais rápida.
   - **Menos de 97% das palavras encontradas, ou palavra faltando a até 0,5 s de um corte = palavra comida.** Volte a borda
     daquele corte e renderize de novo.
   - Atenção: a retranscrição pode "inventar" palavra numa emenda ou "juntar" uma repetição real. Na dúvida, transcreva
     só uma janela de ~4 s em volta daquele corte.
2. **Folha dos cortes:** extraia o quadro logo depois de cada corte (`ffmpeg -ss <t+0.05> -i <video> -frames:v 1 .tmp/qa/corte-NN.jpg`)
   e olhe as imagens: pulo de enquadramento estranho, olho fechado, elemento cobrindo o rosto.
3. **Proibidos e técnico:** passe de novo pela lista do que é proibido; `ffprobe` com 1080 × 1920, 30 fps e áudio presente.
4. Registre no briefing (Log de versões): % de fala encontrada, cortes corrigidos, o que ficou em dúvida.

## 6. Trecho de validação ⛔ (portão 2)

- Crie a composição `src/<Slug>.tsx`, registre em `Root.tsx` (1080 × 1920, 30 fps).
- Valide com `npm run lint` e `npx remotion compositions`.
- Renderize só um trecho curto e representativo (5–10 s, com legenda e pelo menos um SFX):
  `npx remotion render <Id> exports/<slug>-teste.mp4 --frames=<ini>-<fim>`.
- Rode a **Conferência (5.5)** no trecho e corrija o que ela apontar.
- Mostre o trecho e o link do Studio para a Paty. **Pare e espere a aprovação.** Ajuste e repita se ela pedir.

## 7. Vídeo inteiro

Só depois da aprovação:

- `npx remotion render <Id> exports/<slug>-v1.mp4` (versões seguintes: `-v2`, `-v3`…; nunca sobrescreva uma versão entregue).
- Rode a **Conferência (5.5)** no vídeo inteiro (inclui `ffprobe`: 1080 × 1920, 30 fps, duração esperada, áudio presente).
- Faça mais uma passada pela lista do que é proibido.
- Atualize o briefing: status "entregue", versão, o que mudou.
- Entregue em poucas linhas: arquivo, duração, o que ficou "não confirmado" ou em dúvida.
