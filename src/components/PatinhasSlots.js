import React, { useState, useEffect, useCallback } from 'react';
import { playSound } from '../utils/useSound';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import './PatinhasSlots.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- CONFIGURAÇÃO DO JOGO ---

const SYMBOLS = [
    { id: 1, icon: '🪙', value: 0.5, weight: 45 },
    { id: 2, icon: '💵', value: 1, weight: 30 },
    { id: 3, icon: '💰', value: 3, weight: 15 },
    { id: 4, icon: '💎', value: 10, weight: 8 },
    { id: 5, icon: '🦆', value: 50, weight: 2 }
];

const PAYLINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 4, 8], [2, 4, 6]
];

const getRandomSymbol = () => {
    const totalWeight = SYMBOLS.reduce((acc, symbol) => acc + symbol.weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (let i = 0; i < SYMBOLS.length; i++) {
        if (randomNum < SYMBOLS[i].weight) return SYMBOLS[i];
        randomNum -= SYMBOLS[i].weight;
    }
    return SYMBOLS[0];
};

const PatinhasSlots = () => {
    const STARTING_BALANCE = 1000;
    const [balance, setBalance] = useState(STARTING_BALANCE);
    const [betAmount, setBetAmount] = useState(10);
    const [grid, setGrid] = useState(Array(9).fill(SYMBOLS[0]));
    // Estado para controlar quais colunas estão a girar individualmente [col0, col1, col2]
    const [spinningCols, setSpinningCols] = useState([false, false, false]);
    const [winMessage, setWinMessage] = useState('Multiplique sua fortuna!');
    const [patinhasMood, setPatinhasMood] = useState('neutral');
    const [balanceHistory, setBalanceHistory] = useState([STARTING_BALANCE]);
    const [winningCells, setWinningCells] = useState([]);

    useEffect(() => {
        // Pré-carrega os sons para uma melhor experiência
        // A função preloadSounds não foi exportada, mas a lógica está no useSound.js
        // A simples chamada a playSound já fará o Howler carregar o som na primeira vez.
    }, []);

    // Verifica se alguma coluna ainda está a girar
    const isAnySpinning = spinningCols.some(Boolean);

    // Efeito sonoro visual (troca de humor na falência)
    useEffect(() => {
        if (balance <= 0) setPatinhasMood('shocked');
    }, [balance]);

    // Efeito visual de giro contínuo para as colunas ativas
    useEffect(() => {
        if (!isAnySpinning) return;

        // Aumentei a velocidade de atualização visual para 30ms para parecer mais rápido
        const interval = setInterval(() => {
            setGrid(currentGrid => currentGrid.map((symbol, i) => {
                if (spinningCols[i % 3]) return getRandomSymbol();
                return symbol;
            }));
        }, 30);

        return () => clearInterval(interval);
    }, [isAnySpinning, spinningCols]);

    const spin = useCallback(() => {
        if (balance < betAmount || isAnySpinning) return;

        // 1. Iniciar o giro
        setBalance(prev => prev - betAmount);
        setWinMessage('GIRANDO...');
        setPatinhasMood('neutral');
        setWinningCells([]);
        setSpinningCols([true, true, true]);
        playSound('spinStart');

        // 2. Pré-determinar o resultado
        const finalGrid = Array.from({ length: 9 }, () => getRandomSymbol());

        // 3. Agendar paragens escalonadas (Vezes mais rápidas agora)
        const STOP_DELAY = 500; // 0.5s até a primeira parar (era 1000)
        const STAGGER = 300;    // 0.3s entre cada coluna (era 600)

        // Parar Coluna 1
        setTimeout(() => {
            setSpinningCols([false, true, true]);
            setGrid(current => {
                const newGrid = [...current];
                [0, 3, 6].forEach(i => newGrid[i] = finalGrid[i]);
                return newGrid;
            });
            playSound('reelStop');
        }, STOP_DELAY);

        // Parar Coluna 2
        setTimeout(() => {
            setSpinningCols([false, false, true]);
            setGrid(current => {
                const newGrid = [...current];
                [1, 4, 7].forEach(i => newGrid[i] = finalGrid[i]);
                return newGrid;
            });
            playSound('reelStop');
        }, STOP_DELAY + STAGGER);

        // Parar Coluna 3 e finalizar
        setTimeout(() => {
            setSpinningCols([false, false, false]);
            setGrid(finalGrid);
            playSound('reelStop');
            finalizeRound(finalGrid);
        }, STOP_DELAY + STAGGER * 2);

    }, [balance, betAmount, isAnySpinning]);

    const finalizeRound = (finalGrid) => {
        let roundWin = 0;
        let newWinningCells = [];
        let nearMiss = false;

        PAYLINES.forEach(line => {
            const s1 = finalGrid[line[0]];
            const s2 = finalGrid[line[1]];
            const s3 = finalGrid[line[2]];

            if (s1.id === s2.id && s2.id === s3.id) {
                roundWin += betAmount * s1.value;
                newWinningCells.push(...line);
            } 
            else if (s1.id === s2.id || s2.id === s3.id || s1.id === s3.id) {
                nearMiss = true;
            }
        });

        if (roundWin > 0) {
            setBalance(prev => {
                const newBal = prev + roundWin;
                setBalanceHistory(h => [...h, newBal]);
                return newBal;
            });
            setWinningCells([...new Set(newWinningCells)]);

            if (roundWin < betAmount) {
                setWinMessage(`Bateu na trave! Recuperou R$ ${roundWin.toFixed(2)}`);
                setPatinhasMood('neutral'); 
            } else if (roundWin > betAmount * 10) {
                 setWinMessage(`💰 SUPER BIG WIN! R$ ${roundWin.toFixed(2)} 💰`);
                 setPatinhasMood('happy');
                 playSound('bigWin');
            } else {
                 setWinMessage(`VITÓRIA! Ganhou R$ ${roundWin.toFixed(2)}!`);
                 setPatinhasMood('happy');
                 playSound('smallWin');
            }
        } else {
            setBalanceHistory(h => [...h, balance]);
            if (nearMiss) {
                setWinMessage('UUH! Foi quase!');
                setPatinhasMood('shocked');
                playSound('nearMiss');
            } else {
                setWinMessage('A casa venceu essa.');
                setPatinhasMood('angry');
                playSound('loss');
            }
        }
    };

    const runSimulation = () => {
        if (isAnySpinning) return;
        let simBal = balance;
        let simHist = [...balanceHistory];
        for(let i=0; i<100; i++) {
            if(simBal < betAmount) break;
            simBal -= betAmount;
            const g = Array.from({ length: 9 }, () => getRandomSymbol());
            PAYLINES.forEach(line => {
                 if (g[line[0]].id === g[line[1]].id && g[line[1]].id === g[line[2]].id) {
                     simBal += betAmount * g[line[0]].value;
                 }
            });
            simHist.push(simBal);
        }
        setBalance(simBal);
        setBalanceHistory(simHist);
        setWinMessage('Simulação rápida finalizada.');
    };

    const chartData = {
        labels: balanceHistory.map((_, i) => i),
        datasets: [{
            label: 'Saldo (R$)',
            data: balanceHistory,
            borderColor: '#00ff00',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 2
        }]
    };

    return (
        <div className="patinhas-container">
            <div className="game-area">
                <div className={`patinhas-avatar mood-${patinhasMood}`}>
                    {patinhasMood === 'neutral' && '🦆'}
                    {patinhasMood === 'happy' && '🤑'}
                    {patinhasMood === 'angry' && '😤'}
                    {patinhasMood === 'shocked' && '😱'}
                </div>

                <div className="slots-grid">
                    {grid.map((symbol, i) => {
                        const isColSpinning = spinningCols[i % 3];
                        return (
                            <div key={i} className={`grid-cell ${winningCells.includes(i) ? 'winner' : ''} ${isColSpinning ? 'spinning' : 'stopped'}`}>
                                {symbol.icon}
                            </div>
                        );
                    })}
                </div>

                <div className="hud">
                    <div className="win-message">{winMessage}</div>
                    <div className="balance-box">
                        SALDO: <span style={{color: balance < 100 ? 'red' : '#00ff00'}}>R$ {balance.toFixed(2)}</span>
                    </div>
                    
                    <div className="controls">
                        <div className="bet-control">
                            <span>Aposta:</span>
                            <select value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} disabled={isAnySpinning}>
                                <option value={10}>R$ 10</option>
                                <option value={50}>R$ 50</option>
                                <option value={100}>R$ 100</option>
                            </select>
                        </div>
                        <button className="spin-btn" onClick={spin} disabled={isAnySpinning || balance < betAmount}>
                            {isAnySpinning ? '...' : 'GIRAR!'}
                        </button>
                    </div>
                    <button className="sim-btn" onClick={runSimulation} disabled={isAnySpinning}>
                        ⏩ Avançar 100 Rodadas
                    </button>
                </div>
            </div>

            <div className="stats-area">
                <h3>Sua Jornada Financeira</h3>
                <div className="chart-box">
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: {display: false} }, scales: { x: {display:false}, y: {grid: {color: '#333'}} } }} />
                </div>
                <div className="paytable">
                    <h4>Pagamentos</h4>
                    <ul>
                        {SYMBOLS.map(s => (
                            <li key={s.id}>{s.icon} x3 = {s.value}x aposta</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatinhasSlots;