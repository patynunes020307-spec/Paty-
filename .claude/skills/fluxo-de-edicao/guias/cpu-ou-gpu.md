# CPU ou GPU: o que é melhor para cada tarefa

Na fase 1, descubra o que a máquina da pessoa tem e decida, **tarefa por tarefa**, se ela roda na CPU, na GPU ou na nuvem. Não existe resposta única: a mesma máquina pode transcrever melhor na GPU e exportar o final melhor na CPU. Registre a escolha de cada tarefa no `montagem.md`, para as skills das etapas seguirem.

## 1. Descobrir o hardware (sem instalar nada)
- **CPU:** modelo, núcleos e threads (Windows: `Get-CimInstance Win32_Processor`; macOS: `sysctl -n machdep.cpu.brand_string hw.ncpu`; Linux: `lscpu`).
- **Memória RAM:** total (abaixo de 16 GB, evite rodar duas tarefas pesadas ao mesmo tempo).
- **GPU:**
  - NVIDIA: `nvidia-smi` mostra o modelo, a memória da placa (VRAM) e o driver. Se o comando não existir, não há driver NVIDIA instalado (ou a placa não é NVIDIA).
  - Windows, qualquer marca: `Get-CimInstance Win32_VideoController` (nome; o valor de memória que ele mostra é pouco confiável acima de 4 GB).
  - macOS: `system_profiler SPDisplaysDataType`. Apple Silicon (M1 em diante) tem GPU integrada com memória compartilhada.
  - Notebook com duas placas (integrada + dedicada): anote as duas, a dedicada é a que importa.
- **O que o FFmpeg enxerga:** `ffmpeg -hide_banner -encoders` (procure `nvenc`, `qsv`, `amf`, `videotoolbox`) e `ffmpeg -hide_banner -hwaccels`. Estar na lista não garante que funciona: teste (seção 3).
- **Notebook:** pergunte se ele edita na tomada. Na bateria, CPU e GPU caem de desempenho e as medições enganam.

## 2. Critério por tarefa
| Tarefa | GPU vale a pena quando | CPU (ou nuvem) é melhor quando |
|---|---|---|
| **Transcrição local** (Whisper/WhisperX) | NVIDIA com CUDA e VRAM suficiente para o modelo grande (algo como 6 GB ou mais; confira o valor atual). Ganho grande, de várias vezes. | Sem NVIDIA, ou com pouca VRAM: modelo menor em CPU com `int8` (mais lento e um pouco menos preciso) ou transcrição na nuvem. Em Apple Silicon, procure uma versão feita para a GPU do Mac (ex.: whisper.cpp, MLX) em vez de forçar o caminho NVIDIA. |
| **Prévias, rascunhos e arquivos intermediários** (renders de tela, cortes para revisar) | Quase sempre: os codificadores de hardware (NVENC, Quick Sync, AMF, VideoToolbox) são muito mais rápidos e deixam a CPU livre. | Quando o codificador de hardware falha no teste ou não suporta o formato (10 bits, HEVC, resolução alta em placa antiga). |
| **Exportação final** (o arquivo que vai ao ar) | Prazo apertado, vídeo longo, ou a pessoa não nota diferença no teste lado a lado. | Qualidade por tamanho de arquivo importa: `libx264`/`libx265` em preset lento entregam mais qualidade no mesmo tamanho. Se o programa de edição exporta o final (Premiere, CapCut, DaVinci), essa escolha é do programa, não do fluxo. |
| **Decodificar câmera pesada** (HEVC 4K/10 bits de celular, HDR) | Leitura de muitos quadros (sincronia, análise de quadros): `-hwaccel` acelera e alivia a CPU. | Leituras curtas, ou quando o `-hwaccel` dá erro ou cor errada (confira um quadro). |
| **IA de imagem** (recorte de pessoa, remoção de fundo, upscale) | Sempre que possível: na CPU costuma ser lento demais para vídeo inteiro. | Sem GPU compatível: use o recurso do próprio programa de edição (ex.: recorte do CapCut) ou um trecho curto. |
| **Animações em navegador** (HyperFrames, Remotion) | Raramente é o gargalo: o tempo vai em abrir o navegador e montar cada quadro. | Normalmente CPU. Mais núcleos permitem renderizar mais animações em paralelo; ajuste o número de renders simultâneos aos núcleos e à RAM. |
| **Áudio** (medir volume, mixar, efeitos) | Nunca. | Sempre: é leve. |

## 3. Medir antes de decidir (na máquina dela)
A tabela é ponto de partida. A decisão vem de um teste curto, de 1 a 2 minutos, com um trecho de 30 s do material dela:
1. **Transcrição:** o mesmo trecho na GPU e na CPU (se a GPU existir). Anote o tempo e se o texto saiu igual.
2. **Codificação:** o mesmo trecho com o codificador de software e o de hardware, na mesma resolução. Anote tempo e tamanho e mostre um quadro de cada para ela comparar.
3. Escolha por tarefa. Diga em uma frase o motivo, ex.: "Transcrição na GPU (6× mais rápida); final na CPU (mesmo tamanho, imagem mais limpa)."

## 4. Armadilhas
- **Cair para a CPU sem avisar:** com CUDA errado, o PyTorch roda na CPU sem dar erro e a transcrição fica 10× mais lenta. Os scripts devem conferir se a GPU está disponível e **avisar** quando não estiver, em vez de seguir calados. Placas novas pedem versões recentes de CUDA e PyTorch: pesquise a combinação atual.
- **VRAM disputada:** transcrição, recorte por IA e codificação na mesma placa ao mesmo tempo podem estourar a memória. Em placas com pouca VRAM, rode uma tarefa de GPU por vez.
- **Limite de sessões:** placas NVIDIA de consumo limitam quantas codificações NVENC rodam juntas. Em fila paralela, passe do limite e a codificação falha.
- **Driver:** codificador de hardware listado pelo FFmpeg mas com driver antigo falha na hora. O teste da seção 3 pega isso.
- **Cor e formato:** codificação de hardware pode mudar a faixa de cor ou não aceitar `yuv420p10le`. Confira um quadro e o `ffprobe` da saída.
- **Sempre um plano B:** toda tarefa configurada para a GPU tem a versão na CPU pronta, para quando a placa estiver ocupada, faltar driver ou a pessoa trocar de computador.

## 5. O que registrar no `montagem.md`
Em "Ambiente": CPU (núcleos), RAM, GPU (modelo e VRAM) e os codificadores de hardware que passaram no teste.
Em "Decisões", uma linha **Processamento** com a escolha por tarefa e o tempo medido, ex.:
`Transcrição: GPU (30 s em 4 s; CPU 25 s) · Prévias: NVENC · Final: libx264 lento · Recorte: GPU · Animações: CPU, 3 em paralelo`

As skills das etapas leem essa linha. Os scripts, escritos na primeira vez que cada etapa roda, recebem a escolha como padrão e o plano B como alternativa.
