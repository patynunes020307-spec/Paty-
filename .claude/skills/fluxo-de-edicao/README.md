# Fluxo de edição com o Claude Code

Uma skill gratuita que te guia, passo a passo, a montar o **seu** fluxo de edição de vídeo com o Claude Code: cortes, animações, movimentos de câmera, efeitos sonoros e legendas, no seu estilo.

Ela não é um prompt mágico e não entrega o meu fluxo pronto. Ela conversa com você, pergunta o que você quer, analisa as referências de que você gosta e escreve as skills de cada etapa para o seu jeito de trabalhar: YouTube, reels, vídeo narrado, com ou sem programa de edição.

O ponto de partida é um fluxo de 9 etapas usado em vídeos reais, com os bons costumes de animação e de fluxo que aprendi testando: curvas, ritmo, câmera, sincronia de som, as armadilhas do HyperFrames, do XML do Premiere e do projeto do CapCut. Sem identidade visual pronta: o estilo é o seu.

## O que você precisa
- Assinatura do Claude (Pro ou superior).
- [Claude Code](https://claude.com/claude-code) instalado no computador.
- O resto (Python, FFmpeg, transcrição, HyperFrames…) a própria skill confere e instala com você, explicando cada passo.

## Como instalar
Abra o Claude Code e cole:

```
Instala esta skill para mim: https://github.com/luizflb/fluxo-de-edicao
```

Ou, pelo terminal:

```bash
git clone https://github.com/luizflb/fluxo-de-edicao ~/.claude/skills/fluxo-de-edicao
```

## Como usar
No Claude Code, digite:

```
/fluxo-de-edicao
```

Ela começa a te guiar:

1. **Ambiente:** confere o que já está instalado e o seu hardware, e decide, tarefa por tarefa, se é mais vantajoso usar a CPU, a GPU ou a nuvem.
2. **Entrevista:** tipo de vídeo, formato, programa de edição (ou nenhum), transcrição, animação, câmera e som.
3. **Referências:** você junta trechos de vídeos de que gosta, e ela analisa e cria o seu perfil de estilo.
4. **Plano do fluxo:** as etapas, adaptadas para você.
5. **As skills:** ela escreve uma por etapa, mais uma skill mestra que te guia pelo fluxo e um caderno de aprendizados.
6. **Teste:** um vídeo curto, do começo ao fim.

Dá para parar e continuar depois: ela anota onde parou.

## Depois de montar: como editar um vídeo
O `/fluxo-de-edicao` não edita vídeo: ele monta o seu fluxo. Durante a montagem, você escolhe o nome da sua **skill mestra** (por exemplo, `/editar`). É ela que você usa no dia a dia:

1. Abra o Claude Code na pasta do vídeo.
2. Digite a sua skill mestra (ex.: `/editar`).
3. Ela vê em que etapa o vídeo está e te guia, uma etapa por vez.

Esqueceu o nome? Digite `/` para ver a lista de skills, ou pergunte ao Claude qual é a sua skill mestra. Para continuar a montagem ou mudar o fluxo depois, use `/fluxo-de-edicao` de novo.

## O que tem aqui
| Pasta | O que tem |
|---|---|
| `SKILL.md` | O roteiro da conversa |
| `guias/` | O conhecimento: princípios do fluxo, decisões, análise de referências, ofício de animação, HyperFrames, entrega no programa de edição e o ofício de cada etapa |
| `modelos/` | Os esqueletos das skills, do perfil e do estado do vídeo |

Tudo em texto. Leia, mude, adapte.

## O que mudou em relação ao original
Esta versão parte da [fluxo-de-edicao](https://github.com/LeiteZ/fluxo-de-edicao), de Lucas Leite, e acrescenta o que funcionou editando vídeos reais com ela:
- **Etapa 9, legendas:** pergunta se o vídeo usa legenda; legendas curtas (até 3 palavras), de uma linha, logo abaixo do queixo, com entrada rápida e sem fade de saída.
- **Sem subpastas como padrão:** todos os arquivos na raiz da pasta do vídeo; você diz o que é cada um, e o Claude só cria `_CLAUDE/`.
- **CapCut:** projeto gerado por arquivo, com o programa fechado, um projeto só por vídeo (atualizado no lugar, com prévias MP4 durante as etapas), e as armadilhas já encontradas.
- **Área segura do vertical** (Reels, TikTok, Shorts) valendo para animação, zoom, marcação e legenda.
- **Tutoriais de tela:** zoom e marcação no toque real, sem cortar o texto do item.
- **Animação no tempo da fala:** a saída ligada a uma palavra só acontece durante ela, medida pelo áudio real.
- **CPU ou GPU:** na montagem, a skill olha a sua máquina e escolhe, para cada tarefa (transcrição, prévias, exportação, recorte por IA, animações), o que roda melhor nela, medindo quando há dúvida.
- **Entrega sem mexer no computador:** o Claude não abre nem controla o programa de edição, salvo se você pedir.

## Licença
MIT. Use, mude e compartilhe à vontade.

Original feito por Lucas Leite. Modificações por LuizFLB.
