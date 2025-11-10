# Plano de Aprimoramento da Roleta: Dopamina e Felicidade

O objetivo é transformar a experiência de girar a roleta, aumentando a **antecipação**, a **recompensa** e a **gratificação** através de aprimoramentos visuais e sonoros.

## 1. Aprimoramentos Visuais (CSS/JS)

| Elemento | Aprimoramento Proposto | Justificativa (Dopamina) |
| :--- | :--- | :--- |
| **Célula Girando** (`.grid-cell.spinning`) | Adicionar um **brilho pulsante** (glow) e uma **cor vibrante** (ex: verde neon) ao redor da célula. | Aumenta a **antecipação** e o foco visual no movimento, tornando o giro mais "energético". |
| **Paragem da Coluna** (`.grid-cell.stopped`) | Aumentar o efeito de **"impacto"** na paragem (o `reelStop` atual é bom, mas pode ser mais dramático). Adicionar um **flash rápido** na célula que parou. | O impacto visual reforça o **momento da decisão** e a sensação de que algo importante aconteceu. |
| **Vitória** (`.grid-cell.winner`) | Manter o `pulseWinner`, mas adicionar um efeito de **partículas/confetes** (simulado com CSS ou emojis) que "explodem" da célula vencedora. Aumentar a intensidade do `box-shadow` dourado. | Reforça a **recompensa** com um estímulo visual de "celebração". O brilho intenso é um gatilho de dopamina. |
| **Grande Vitória** (`.win-message` com "SUPER BIG WIN") | Adicionar uma **animação de tela cheia temporária** (ex: um overlay dourado piscante) e fazer com que o Patinhas Avatar (`.mood-happy`) tenha uma animação mais exagerada (ex: pulo triplo). | O estímulo visual **máximo** para a recompensa máxima, criando um pico de felicidade e memorabilidade. |
| **Fundo da Área de Jogo** | Adicionar um **gradiente sutil** que pulsa ou se move lentamente, dando uma sensação de "energia" ao jogo. | Mantém o ambiente visualmente estimulante mesmo quando a roleta está parada. |

## 2. Aprimoramentos Sonoros (Integração de Áudio)

A implementação de áudio será feita com a biblioteca `howler.js` (ou similar) para garantir a reprodução eficiente e a gestão de múltiplos sons.

| Evento | Efeito Sonoro Proposto | Justificativa (Dopamina) |
| :--- | :--- | :--- |
| **Clique em GIRAR** | Som de **alavanca** ou **botão** de máquina caça-níquel. | Reforça a **ação** e a **decisão** do usuário. |
| **Giro da Roleta** | Som de **rolos girando** (looping rápido e crescente). | Aumenta a **tensão** e a **antecipação** durante o giro. |
| **Paragem de Coluna** | Som de **"clique"** ou **"ding"** metálico, escalonado (coluna 1, 2, 3). | O som sequencial cria um **ritmo** que aumenta a expectativa a cada paragem. |
| **Quase Ganhou** (`nearMiss`) | Um som de **"buzzer"** ou **"wah-wah"** rápido, seguido de um som de **"tensão"** que é abruptamente cortado. | O "quase" é um poderoso gatilho de dopamina. O som reforça a sensação de "escapou por pouco". |
| **Vitória (Pequena/Média)** | Som de **moedas caindo** (curto e alegre) e um **jingle musical** rápido. | Recompensa auditiva imediata, associando o som ao ganho. |
| **Grande Vitória** (`SUPER BIG WIN`) | **Música triunfal** (curta e alta), som de **chuva de moedas** (longo e intenso) e um **efeito de sino/sirene**. | O pico auditivo da recompensa, maximizando a sensação de euforia. |
| **Perda** | Um som de **"flop"** ou **"derrota"** suave e rápido, para não ser punitivo, mas indicar o fim do ciclo. | Mantém o foco na próxima tentativa e não desmotiva excessivamente. |

---
**Próxima Fase:** Instalar a biblioteca de áudio e preparar a infraestrutura para a implementação.

## 3. Infraestrutura de Áudio

1.  Instalar `howler.js` (ou similar) via `npm`.
2.  Baixar e adicionar os arquivos de áudio à pasta `src/assets`.
3.  Criar um componente ou hook para gerenciar a reprodução dos sons.
