import { Howl } from 'howler';

// Define a duração máxima (em milissegundos)
const MAX_DURATION = 1000; // 1 segundo

// Configuração padrão para o sprite de corte
const shortSprite = {
    short: [0, MAX_DURATION]
};

// Helper para pegar o caminho correto no GitHub Pages
// Se houver PUBLIC_URL, usa ela, senão usa string vazia
const getPath = (path) => `${process.env.PUBLIC_URL}${path}`;

// Nomes dos arquivos de áudio
const SOUNDS = {
    spinStart: new Howl({ 
        src: [getPath('/sounds/spin_start.mp3')], 
        volume: 0.5, 
        sprite: shortSprite 
    }),
    reelStop: new Howl({ 
        src: [getPath('/sounds/reel_stop.mp3')], 
        volume: 0.3, 
        sprite: shortSprite 
    }),
    nearMiss: new Howl({ 
        src: [getPath('/sounds/near_miss.mp3')], 
        volume: 0.6, 
        sprite: shortSprite 
    }),
    smallWin: new Howl({ 
        src: [getPath('/sounds/small_win.mp3')], 
        volume: 0.7, 
        sprite: shortSprite 
    }),
    bigWin: new Howl({ 
        src: [getPath('/sounds/big_win.mp3')], 
        volume: 1.0, 
        sprite: shortSprite 
    }),
    loss: new Howl({ 
        src: [getPath('/sounds/loss.mp3')], 
        volume: 0.4, 
        sprite: shortSprite 
    }),
};

// Função para tocar um som
export const playSound = (soundName) => {
    const sound = SOUNDS[soundName];
    if (sound) {
        sound.play('short');
    } else {
        console.warn(`Sound ${soundName} not found.`);
    }
};

// Função para parar todos os sons
export const stopAllSounds = () => {
    Object.values(SOUNDS).forEach(sound => sound.stop());
};

// Função para pré-carregar os sons
export const preloadSounds = () => {
    Object.values(SOUNDS).forEach(sound => sound.load());
};