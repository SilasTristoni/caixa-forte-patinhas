import { Howl } from 'howler';

// Define a duração máxima (em milissegundos)
const MAX_DURATION = 1000; // 1 segundo

// Configuração padrão para o sprite de corte
// Define um trecho chamado 'short' que vai de 0ms até 1000ms
const shortSprite = {
    short: [0, MAX_DURATION]
};

// Nomes dos arquivos de áudio (assumindo que estão na pasta public/sounds)
const SOUNDS = {
    spinStart: new Howl({ 
        src: ['/sounds/spin_start.mp3'], 
        volume: 0.5, 
        sprite: shortSprite 
    }),
    reelStop: new Howl({ 
        src: ['/sounds/reel_stop.mp3'], 
        volume: 0.3, 
        // Sons curtos como 'click' não precisam necessariamente de sprite, 
        // mas mal não faz se forem menores que 1s.
        sprite: shortSprite 
    }),
    nearMiss: new Howl({ 
        src: ['/sounds/near_miss.mp3'], 
        volume: 0.6, 
        sprite: shortSprite 
    }),
    smallWin: new Howl({ 
        src: ['/sounds/small_win.mp3'], 
        volume: 0.7, 
        sprite: shortSprite 
    }),
    bigWin: new Howl({ 
        src: ['/sounds/big_win.mp3'], 
        volume: 1.0, 
        sprite: shortSprite 
    }),
    loss: new Howl({ 
        src: ['/sounds/loss.mp3'], 
        volume: 0.4, 
        sprite: shortSprite 
    }),
};

// Função para tocar um som
export const playSound = (soundName) => {
    const sound = SOUNDS[soundName];
    if (sound) {
        // Toca o sprite 'short' (limitado a 1s) em vez do arquivo inteiro
        sound.play('short');
    } else {
        console.warn(`Sound ${soundName} not found.`);
    }
};

// Função para parar todos os sons (útil para o giro)
export const stopAllSounds = () => {
    Object.values(SOUNDS).forEach(sound => sound.stop());
};

// Função para pré-carregar os sons
export const preloadSounds = () => {
    Object.values(SOUNDS).forEach(sound => sound.load());
};