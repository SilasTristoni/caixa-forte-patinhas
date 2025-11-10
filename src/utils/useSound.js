import { Howl } from 'howler';

// Nomes dos arquivos de áudio (assumindo que estão na pasta public/sounds)
// Como não posso baixar os arquivos, vou usar nomes genéricos e o Howler.js
// tentará carregá-los a partir do caminho relativo.
const SOUNDS = {
    spinStart: new Howl({ src: ['/sounds/spin_start.mp3'], volume: 0.5 }),
    reelStop: new Howl({ src: ['/sounds/reel_stop.mp3'], volume: 0.3 }),
    nearMiss: new Howl({ src: ['/sounds/near_miss.mp3'], volume: 0.6 }),
    smallWin: new Howl({ src: ['/sounds/small_win.mp3'], volume: 0.7 }),
    bigWin: new Howl({ src: ['/sounds/big_win.mp3'], volume: 1.0 }),
    loss: new Howl({ src: ['/sounds/loss.mp3'], volume: 0.4 }),
};

// Função para tocar um som
export const playSound = (soundName) => {
    const sound = SOUNDS[soundName];
    if (sound) {
        sound.play();
    } else {
        console.warn(`Sound ${soundName} not found.`);
    }
};

// Função para parar todos os sons (útil para o giro)
export const stopAllSounds = () => {
    Object.values(SOUNDS).forEach(sound => sound.stop());
};

// Função para pré-carregar os sons (opcional, mas boa prática)
export const preloadSounds = () => {
    Object.values(SOUNDS).forEach(sound => sound.load());
};

// Para simplificar a integração, vamos exportar apenas a função de tocar som
// e faremos a gestão de estado no componente principal.
// O usuário precisará criar a pasta public/sounds e adicionar os arquivos:
// spin_start.mp3, reel_stop.mp3, near_miss.mp3, small_win.mp3, big_win.mp3, loss.mp3
// para que o áudio funcione.
