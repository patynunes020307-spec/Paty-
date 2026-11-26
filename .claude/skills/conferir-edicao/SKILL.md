---
name: conferir-edicao
description: Conferência obrigatória de um vídeo do projeto Remotion (projeto/) antes de mostrar qualquer prévia ou entregar — regras proibidas do CLAUDE.md, ficha da Paty (vídeo falado) ou Guia da Impactar (Reels de marca), filtro de qualidade, logos oficiais, lint e checagem técnica do arquivo. Use antes de mostrar trecho de validação ou vídeo final, e quando a Paty pedir "confere", "revisa o vídeo", "está pronto?".
---

# CONFERIR EDIÇÃO — antes de mostrar qualquer prévia

Roda sobre **uma composição** (`src/<Slug>.tsx`) e, se já existir, o render em `exports/`.
Só leitura: esta skill aponta problemas; a correção é um passo separado.
Se algum item **reprovar**, não mostrar a peça à Paty — corrigir primeiro ou avisar o impedimento.

## 0. Identificar o vídeo e as regras que valem

1. Qual composição e qual briefing (`briefings/*.md` do slug). Sem briefing → reprova (regra 3 do CLAUDE.md).
2. Tipo do vídeo, pelo briefing:
   - **Falado** (pessoa falando para a câmera) → `estilos/ficha-paty-celular.md`.
   - **Marca Impactar** (Reels, bastidores) → `estilos/impactar-guia-oficial.md`.
   - Se o briefing não deixa claro → perguntar à Paty, não presumir.
3. Se for Impactar: o Guia do Notion foi conferido **nesta produção**? (link na ficha). Se não deu para acessar, registrar a pendência — não tratar a ficha local como atual.

## 1. Proibidos (CLAUDE.md) — ler o código da composição

| Item | Como checar | Reprova se |
|---|---|---|
| Tremida de câmera | `grep -nE "shake|random\(|noise" src/<Slug>.tsx` | deslocamento aleatório por frame |
| Pulsar | `Math.sin`/`Math.cos` sobre `frame` em `scale`/`opacity`; `loop` em animação | escala ou opacidade em ciclo |
| Seguir rosto | posição/recorte recalculado a cada frame a partir de detecção | reenquadramento por frame (uma vez por plano é ok) |
| Sons empilhados | listar todos os `<Audio>`/SFX com o frame de início | dois SFX começando no mesmo instante (±3 frames) |
| Parado > 2 s (só falado) | listar cortes, legendas e entradas de elementos na linha do tempo | algum intervalo > 60 frames sem corte, legenda nova ou elemento entrando |

## 2. Estilo — conforme o tipo

**Falado (ficha da Paty):** legenda 2–3 palavras, minúscula, branca, sem caixa, no peito, mesma posição;
abertura 3–5 s acima da cabeça sem cobrir rosto; peças pequenas no máximo uma a cada 8–10 s, entrando na palavra;
pulo de 0,3 s e saída seca; aproximação seca de ~14% sem animação de zoom; velocidade final 1,2x; silêncios cortados sem engolir palavra.

**Marca Impactar (Guia):** 1080 × 1920, 15–20 s (até 30 s só narrativo); gancho escrito nos 2 primeiros segundos;
um texto por vez; Cormorant Garamond + Montserrat (`src/fontes.ts`), cores de `src/marca.ts`;
sem caixas com borda, faixas, ícones, pílulas, sombras pesadas; **sem tela final de logo**; P&B para emoção.

**Logos (os dois tipos):** só arquivos de `public/marca/` (oficiais). Reprova se a logo for escrita em texto,
redesenhada, recolorida ou gerada. Nenhuma imagem gerada/alterada por IA.

## 3. Técnico

```bash
cd projeto
npm run lint                      # ESLint + TypeScript sem erro
npx remotion compositions         # a composição aparece, 1080x1920, 30 fps
# se houver render:
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate:format=duration -of compact exports/<arquivo>.mp4
```

Reprova se: lint com erro; dimensão ≠ 1080 × 1920; fps ≠ 30; sem faixa de áudio; duração fora do briefing;
render sobrescrevendo versão já entregue (`-v1`, `-v2`… nunca reaproveitados).

## 4. Qualidade (filtro do Guia)

Gerar 3 frames representativos (início, meio, fim) em `.tmp/` e olhar:
`ffmpeg -ss <s> -i exports/<arquivo>.mp4 -frames:v 1 .tmp/conf-<n>.jpg`
- Imagem nítida em tela cheia, sem granulação ou ampliação visível de arquivo pequeno.
- Texto revisado (ortografia, nomes próprios conferidos na transcrição) e dentro da área segura do Instagram
  (nada importante nos ~250 px de cima e ~400 px de baixo).

## 5. Resultado (formato fixo, curto)

```
CONFERÊNCIA — <Slug> (<tipo>) — APROVADO | REPROVADO
✅ itens que passaram (uma linha)
❌ <item>: <o que está errado> — <arquivo:linha ou segundo do vídeo> — <correção sugerida>
⚠ pendências que dependem da Paty / não verificadas (ex.: Guia do Notion não acessado)
```

Registrar o resultado no "Log de versões" do briefing. Só com APROVADO a prévia vai para a Paty.
