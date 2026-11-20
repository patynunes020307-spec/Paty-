# Entrega no programa de edição (ou o vídeo pronto)

Como o resultado de cada etapa chega à pessoa. Escolha o caminho na entrevista e escreva as regras dele nas skills que entregam algo (cortes, motion-render, câmera, sfx, legendas).

## Regras para qualquer caminho
- **Por arquivo, sem mexer no computador.** O Claude gera a entrega por arquivo e não abre, não fecha e não controla o programa de edição (nem mouse, nem teclado), salvo se a pessoa pedir. Quando o formato exige o programa fechado, o Claude confere pelo processo e, se estiver aberto, pede para a pessoa fechar e espera.
- **Teste curto primeiro.** Na primeira vez que um formato é usado (ou quando muda), gere um arquivo de teste com 3–4 clipes e peça para a pessoa abrir e conferir: abre, os clipes certos, o áudio certo, os marcadores visíveis, o tempo batendo. Anote o que foi confirmado num arquivo de validação na pasta de ferramentas. Só depois a etapa usa o formato de verdade.
- **Copie, não chute.** Quando não souber como o programa representa algo (uma transição, um keyframe, uma trilha estéreo), peça para a pessoa montar aquilo no programa, exportar e mandar. Copie o formato exportado.
- **Um projeto só por vídeo**, `<projeto>`, atualizado no lugar: um projeto novo a cada etapa ou revisão enche o programa de cópias e confunde. Durante as etapas, a revisão é por **prévia MP4** no chat (rascunho com FFmpeg, como no caminho C); o arquivo do programa é gerado na última etapa feita, e só então a pessoa abre. Antes de atualizar, cópia em backups. As versões (`_v01`, `_v02`…) ficam só nos arquivos de trabalho de `_CLAUDE/`.
- **Nada de clipe curtinho na câmera:** um clipe por corte; mudança de zoom ou de posição dentro do corte é keyframe no mesmo clipe, nunca um clipe novo. Confira por script que nenhum clipe tem menos de ~0,5 s: pedacinhos de poucos quadros aparecem como cortes estranhos e estouram o áudio quando o clipe tem normalização.
- **Normalização de volume por clipe:** meça a loudness numa janela de pelo menos ~3 s em volta do clipe. Em poucos quadros o medidor (ebur128) devolve -70 LUFS, e o programa sobe o ganho até estourar.
- **Apontar para os originais**, nunca para os proxies, com caminho absoluto. A pessoa conecta os proxies no programa.
- **Tempo em frames inteiros.** Converta segundos para frames com a taxa real e arredonde para o frame mais próximo, num lugar só (uma função usada por todos os scripts). Com 29,97: `frame = round(segundos × 30000 / 1001)`, timebase 30 com NTSC ligado, timecode não-drop. Erro de taxa aparece como descompasso crescente no fim do vídeo.
- **Marcadores na linha do tempo** em vez de listas no chat: dúvida de take, sugestão, asset faltando, efeito para aplicar na pós. Use uma cor fixa para os do Claude; os da pessoa são de qualquer outra cor e, na volta, viram instrução.
- **Trilhas fixas**, sempre as mesmas, para a pessoa se acostumar. Exemplo:
  - V1 câmera;
  - V2 gravação de tela;
  - V3 animações em tela cheia;
  - V4 sobreposições;
  - A1 voz;
  - abaixo da voz, os efeitos sonoros.
- **Fades de áudio** curtos em todo clipe de áudio, para tirar os estalos: 1 frame de cada lado nas junções entre takes (um crossfade de 2 frames) e 1 frame no começo e no fim da voz e de cada efeito sonoro.

## Caminho A: XML para Premiere (e outros que leem FCP7 XML)
O formato que funcionou no fluxo de referência é o **FCP 7 XML (xmeml)**, importado em Arquivo → Importar. O DaVinci Resolve também importa XML; confira com um teste antes.
- **Áudio estéreo:** o xmeml não tem trilha estéreo; cada canal vira um `<track>`. Para o Premiere juntar os dois numa trilha só, o par precisa das marcas que o próprio Premiere grava quando exporta: `explodedTracks`, `totalExplodedTrackCount="2"`, `premiereTrackType="Stereo"` e clipes com `premiereChannelType="stereo"`. Sem elas, chegam duas trilhas mono iguais.
- **Caminho do arquivo:** `file://localhost/C:/...` no Windows.
- **Marcadores:** marcadores da sequência, com o texto no comentário e a cor por um atributo de cor do Premiere (descubra o valor exportando um marcador da cor desejada).
- **Câmera em keyframes:** o efeito de Movimento (Basic Motion) com escala e posição por keyframe. Para a curva sair como foi desenhada, use keyframes densos (vários por movimento), com a curva calculada pelo script. A posição é relativa ao centro e normalizada.
- **Fades de áudio:** `transitionitem` com o efeito Cross Fade, alinhamento `center` entre dois clipes e `start-black`/`end-black` nas pontas. O Premiere importa a duração escrita, mas **exporta** os fades com o tamanho padrão dele (ex.: 30 frames). Na volta, ignore o tamanho que vier e considere o seu.
- **Links entre clipes** (vídeo e áudio do mesmo take): o índice do clipe conta os clipes **e** as transições da trilha.
- **A volta (feedback pelo programa):** a pessoa exporta a sequência (Arquivo → Exportar → Final Cut Pro XML) para a pasta de trabalho. Um script lê os clipes de V1 (arquivo, entrada, saída) e reconstrói a lista de cortes. **Os ajustes dela valem mais que os do Claude.**
  - Os marcadores dela viram instrução naquele ponto.
  - Avise, sem tentar resolver sozinho, o que estiver fora do modelo: L-cut/J-cut, mudança de velocidade, transições de vídeo, efeitos, clipes desconhecidos.
  - O Premiere exporta com o nome da sequência: salve a cópia como `<nome>_editado.xml`, para não sobrescrever o seu.
- **Ajuste manual no programa** depois de uma etapa não volta para as etapas seguintes, salvo os cortes (pela volta acima). Combine com a pessoa: o retoque fino fica para depois da última etapa, ou é pedido por número ("cam07 mais lento").

## Caminho B: outros programas
- **Final Cut Pro:** usa FCPXML, um formato diferente do FCP7.
- **DaVinci Resolve:** importa XML e FCPXML, e tem API de scripts.
- Em qualquer um: pesquise o formato atual, gere o teste curto e copie o que o próprio programa exporta.
- **CapCut:** caminho D.
- **Programas sem importação aberta:** siga o caminho C e entregue o vídeo pronto.

## Caminho C: sem programa (o Claude entrega o vídeo)
- Uma etapa final de **render** monta tudo com FFmpeg: os cortes da câmera com a câmera em escala e posição, as animações por cima (tela cheia e sobreposição com transparência) e o áudio com os efeitos nos níveis certos. Exporta um MP4.
- **Revisão:** a pessoa assiste e pede pelo chat, citando o tempo ("em 01:12 tira essa frase") ou o número do item. O Claude converte o tempo do vídeo para o tempo do arquivo original pela lista de cortes.
- **Rascunho rápido:** para revisar, renderize em resolução menor; o final sai na resolução cheia.
- Cada ajuste é um render novo: agrupe vários pedidos antes de renderizar.

## Caminho D: CapCut (projeto gerado por arquivo)
Não há importação oficial de XML no CapCut de computador. O que funcionou foi gerar um **projeto do próprio CapCut**, copiando a estrutura de um projeto real da pessoa. **Não é oficial:** uma atualização pode mudar o formato. Repita o teste curto quando o programa atualizar e tenha o caminho C como plano B.
- **Programa fechado** ao gerar (confira pelo processo). Com ele aberto, o arquivo pode ser sobrescrito ou ignorado.
- **Copie, não chute:** parta do `draft_content.json` e do `draft_meta_info.json` de um projeto que a pessoa montou, com as mesmas chaves e versões. Quando faltar um exemplo (máscara, efeito, texto), peça para ela montar aquilo uma vez e copie. Não copie arquivos de chave ou de trava (ex.: `crypto_key_store.dat`, `.locked`).
- **Um projeto só, `<projeto>`**, gerado na última etapa feita (antes disso, prévias MP4). Na primeira vez, registre na lista de projetos com uma cópia de segurança do arquivo da lista antes, acrescentando só a entrada nova. Nas revisões, **atualize no lugar**: cópia da pasta em backups e regrave só o `draft_content.json`.
- **Ao atualizar no lugar, mantenha o `id`** do `draft_content.json` igual ao `main_timeline_id` de `Timelines/project.json`. Com id novo, o CapCut não abre o projeto (e ainda grava referências ao id inexistente em `timeline_layout.json` e `draft_biz_config.json`).
- O que o CapCut já calculou (ex.: o recorte da pessoa) fica na pasta `matting/` do projeto: reaproveite copiando essa pasta, sem calcular de novo.
- **Armadilhas encontradas:**
  - o tempo dos keyframes (`time_offset`) é o tempo do arquivo de origem (`source_timerange.start` + o tempo dentro do clipe), não o do clipe: gravado pelo começo do clipe, o movimento cai fora do lugar;
  - keyframes de escala no rosto já deixaram a imagem achatada, com faixa preta. Prefira escala e posição paradas em cada clipe, mudando só no corte; quando o enquadramento precisa mudar dentro de um corte, use keyframe no mesmo clipe (nunca divida o clipe) e confira o trecho no programa;
  - vídeo transparente funciona (ProRes 4444, WebM VP9);
  - o removedor de fundo pode ser ligado pelo arquivo: o CapCut calcula o recorte quando o projeto abre;
  - modelo de legenda copiado de outro projeto mostra o texto padrão dele: use texto simples com estilo;
  - clonar um clipe de áudio de um modelo pode trazer um fade longo escondido: confira e tire;
  - uma trilha de áudio vazia some ao abrir; a música cria a trilha dela quando é arrastada.
- **Registro:** cada item testado vai para o arquivo de validação (o quê, versão do CapCut, data, resultado). Só use de verdade o que a pessoa confirmou no programa.
