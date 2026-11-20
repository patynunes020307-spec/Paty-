# Etapa 9: legendas

A última etapa, sobre o corte, as animações, a câmera e o som já aprovados. Olha o vídeo inteiro. Não renderiza vídeo: entrega as legendas como texto no programa de edição (ou queimadas no render final, no caminho sem programa).

Tudo aqui é tendência, não regra. Fonte, cor, sombra, caixa (minúsculas ou não) e posição são do perfil.

## 1. Primeiro, a pergunta
Nem todo vídeo usa legenda. A etapa começa perguntando se este vai ter. Se não, marca `nao_precisa` e diz o próximo passo. Não presuma pelo vídeo anterior.

## 2. Palavras no tempo da sequência
- As legendas seguem a fala **do vídeo cortado**, não do bruto. Um script leva cada palavra do tempo do arquivo original para o tempo da sequência, passando pelos segmentos do corte. Palavra que caiu no corte não entra.
- A transcrição do bruto às vezes engole palavras perto dos cortes. Se faltar palavra, transcreva de novo só a voz já cortada: os tempos já saem no tempo da sequência.
- **Grafia do vídeo** num arquivo à parte: correções do que a transcrição errou, palavras que mantêm maiúscula (marcas, nomes) e pares que não se separam entre duas legendas ("renda extra").
- O roteiro serve só para conferir a grafia. A legenda mostra o que foi falado.

## 3. Quebrar em legendas (o que mais pesa na leitura)
- **Uma linha só, curta.** Ponto de partida que funcionou no vertical: **até 3 palavras**, e menos se a linha passar da área segura (em 1080 px de largura, cerca de 22 caracteres no tamanho de legenda comum). Legenda longa obriga a ler em vez de assistir.
- Quebra na pausa e na pontuação. Nunca atravessar um corte: a legenda de um take não continua no seguinte.
- Não terminar a legenda em palavra fraca ("de", "que", "para", "o"): ela desce para a próxima.
- **Sem relâmpago:** legenda de menos de ~0,3 s some antes de ser lida. Junte com a vizinha, se couber no limite.
- O script faz a primeira divisão; o Claude lê a lista por texto (início, duração, número de caracteres, texto) e reescreve à mão as quebras que cortam o sentido. Um arquivo com uma legenda por linha é o mais fácil de revisar e de passar para o script, que confere se as palavras batem na ordem.

## 4. Posição
- Nos layouts com o rosto embaixo: **bem perto, logo abaixo do queixo**. Longe do queixo, o olho tem de pular entre o rosto e o texto.
- Quando a câmera tem zoom num clipe, o queixo desce: a legenda desce junto naquele clipe, mudando só no corte.
- Nunca cobrir o rosto nem o que a tela está mostrando (o botão citado, a opção marcada). Confira cada layout com um quadro de cada trecho.
- **Vertical (Reels, TikTok, Shorts):** dentro da área segura, longe dos botões da lateral direita, da legenda do post e da barra de baixo.
- Pessoa pequena num canto: a legenda vai para onde não cobre o rosto (ex.: acima da cabeça).

## 5. Animação
- **Entrada quase imediata** (até ~0,05–0,1 s, por opacidade) e **sem saída gradual**: a legenda fica inteira até a próxima entrar. Com legendas curtas, um fade de 0,2 s na entrada e outro na saída deixa o texto meio transparente durante boa parte do tempo e atrapalha a leitura.
- Efeito de palavra (destaque na palavra dita, pulo, cor) só se o perfil pedir, e sem tirar a legibilidade.

## 6. Entrega
- Uma trilha de texto acima de tudo, uma legenda por clipe, com o tempo convertido pela função única de frames.
- Programa sem modelo de legenda confiável pelo arquivo: use texto simples com o estilo escrito no próprio clipe (o modelo pronto copiado de outro projeto pode mostrar o texto padrão dele no lugar da fala).
- Sem programa: as legendas entram no render final (ex.: ASS com FFmpeg), com o mesmo estilo.
- Teste curto na primeira vez, como em toda entrega (`entrega-no-editor.md`). Ao conferir o fade, avance alguns quadros depois do início: no primeiro quadro a opacidade ainda é zero.

## 7. Revisão
- Por tempo da sequência: "em 0:12 quebra depois de grana", "sobe a legenda 20 px", "a legenda está difícil de ler".
- Mudança de limite de palavras, posição ou animação que vale para outros vídeos é aprendizado: vai para o perfil.
