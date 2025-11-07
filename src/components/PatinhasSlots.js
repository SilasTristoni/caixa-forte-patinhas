import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import './PatinhasSlots.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- CONFIGURAÇÃO DO JOGO ---

// Símbolos com pesos ajustados para criar muitas "quase vitórias" e pequenos ganhos.
const SYMBOLS = [
    { id: 1, icon: '🪙', value: 0.5, weight: 45 }, // Moeda: Paga METADE da aposta (perda disfarçada de vitória)
    { id: 2, icon: '💵', value: 1, weight: 30 },   // Dinheiro: Paga a aposta de volta (neutro)
    { id: 3, icon: '💰', value: 3, weight: 15 },   // Saco: Pequeno lucro
    { id: 4, icon: '💎', value: 10, weight: 8 },   // Diamante: Bom lucro
    { id: 5, icon: '🦆', value: 50, weight: 2 }    // Patinhas: Jackpot (muito raro)
];

// 5 Linhas de pagamento padrão para grid 3x3
// [0, 1, 2] (Linha de cima)
// [3, 4, 5] (Linha do meio)
// [6, 7, 8] (Linha de baixo)
// [0, 4, 8] (Diagonal \ )
// [2, 4, 6] (Diagonal / )
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
    const [isSpinning, setIsSpinning] = useState(false);
    const [winMessage, setWinMessage] = useState('Multiplique sua fortuna!');
    const [patinhasMood, setPatinhasMood] = useState('neutral'); // neutral, happy, angry, shocked
    const [balanceHistory, setBalanceHistory] = useState([STARTING_BALANCE]);
    const [winningCells, setWinningCells] = useState([]); // Para destacar as células que ganharam

    // Efeito sonoro visual (troca de humor na falência)
    useEffect(() => {
        if (balance <= 0) setPatinhasMood('shocked');
    }, [balance]);

    const spin = useCallback(() => {
        if (balance < betAmount || isSpinning) return;

        setIsSpinning(true);
        setWinMessage('Girando...');
        setPatinhasMood('neutral');
        setWinningCells([]);
        setBalance(prev => prev - betAmount); // A casa cobra adiantado!

        // Animação do giro (suspense artificial)
        let spins = 0;
        const speed = 80; // ms entre trocas
        const interval = setInterval(() => {
            setGrid(Array.from({ length: 9 }, () => getRandomSymbol()));
            spins++;
            if (spins > 12) { // Duração da animação
                clearInterval(interval);
                finalizeSpin();
            }
        }, speed);
    }, [balance, betAmount, isSpinning]);

    const finalizeSpin = () => {
        const finalGrid = Array.from({ length: 9 }, () => getRandomSymbol());
        setGrid(finalGrid);

        let roundWin = 0;
        let newWinningCells = [];
        let nearMiss = false;

        // Verifica todas as linhas de pagamento
        PAYLINES.forEach(line => {
            const s1 = finalGrid[line[0]];
            const s2 = finalGrid[line[1]];
            const s3 = finalGrid[line[2]];

            // Vitória: 3 símbolos iguais na linha
            if (s1.id === s2.id && s2.id === s3.id) {
                roundWin += betAmount * s1.value;
                newWinningCells.push(...line);
            } 
            // Quase vitória (2 iguais): Gatilho psicológico importante
            else if (s1.id === s2.id || s2.id === s3.id || s1.id === s3.id) {
                nearMiss = true;
            }
        });

        // Atualiza estado
        if (roundWin > 0) {
            setBalance(prev => {
                const newBal = prev + roundWin;
                setBalanceHistory(h => [...h, newBal]);
                return newBal;
            });
            setWinningCells([...new Set(newWinningCells)]);

            // Lógica de Feedback Viciante
            if (roundWin < betAmount) {
                // PERDA DISFARÇADA DE VITÓRIA (A mais perigosa!)
                setWinMessage(`Bateu na trave! Recuperou R$ ${roundWin.toFixed(2)}`);
                setPatinhasMood('neutral'); 
            } else if (roundWin > betAmount * 10) {
                 setWinMessage(`💰 SUPER BIG WIN! R$ ${roundWin.toFixed(2)} 💰`);
                 setPatinhasMood('happy');
            } else {
                 setWinMessage(`VITÓRIA! Ganhou R$ ${roundWin.toFixed(2)}!`);
                 setPatinhasMood('happy');
            }
        } else {
            setBalanceHistory(h => [...h, balance - betAmount]);
            if (nearMiss) {
                setWinMessage('UUH! Foi quase! Tente de novo!');
                setPatinhasMood('shocked'); // "Shocked" para incentivar tentar de novo
            } else {
                setWinMessage('A casa venceu essa. Tente recuperar!');
                setPatinhasMood('angry');
            }
        }
        setIsSpinning(false);
    };

    // Simulação Rápida (mostra a tendência de queda a longo prazo)
    const runSimulation = () => {
        if (isSpinning) return;
        let simBal = balance;
        let simHist = [...balanceHistory];
        for(let i=0; i<100; i++) { // 100 rodadas instantâneas
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
        setWinMessage('Simulação de 100 jogadas finalizada.');
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
                {/* Avatar Reativo */}
                <div className={`patinhas-avatar mood-${patinhasMood}`}>
                    {patinhasMood === 'neutral' && '🦆'}
                    {patinhasMood === 'happy' && '🤑'}
                    {patinhasMood === 'angry' && '😤'}
                    {patinhasMood === 'shocked' && '😱'}
                </div>

                {/* Grid 3x3 */}
                <div className="slots-grid">
                    {grid.map((symbol, i) => (
                        <div key={i} className={`grid-cell ${winningCells.includes(i) ? 'winner' : ''} ${isSpinning ? 'spinning' : ''}`}>
                            {symbol.icon}
                        </div>
                    ))}
                </div>

                {/* HUD */}
                <div className="hud">
                    <div className="win-message">{winMessage}</div>
                    <div className="balance-box">
                        SALDO: <span style={{color: balance < 100 ? 'red' : '#00ff00'}}>R$ {balance.toFixed(2)}</span>
                    </div>
                    
                    <div className="controls">
                        <div className="bet-control">
                            <span>Aposta:</span>
                            <select value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} disabled={isSpinning}>
                                <option value={10}>R$ 10</option>
                                <option value={50}>R$ 50</option>
                                <option value={100}>R$ 100</option>
                            </select>
                        </div>
                        <button className="spin-btn" onClick={spin} disabled={isSpinning || balance < betAmount}>
                            GIRAR!
                        </button>
                    </div>
                    <button className="sim-btn" onClick={runSimulation} disabled={isSpinning}>
                        ⏩ Avançar 100 Rodadas (Ver o Futuro)
                    </button>
                </div>
            </div>

            {/* Estatísticas */}
            <div className="stats-area">
                <h3>Sua Jornada Financeira</h3>
                <div className="chart-box">
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: {display: false} }, scales: { x: {display:false}, y: {grid: {color: '#333'}} } }} />
                </div>
                <div className="paytable">
                    <h4>Pagamentos (Simulação)</h4>
                    <small>Note como os prêmios comuns pagam MENOS que a aposta.</small>
                    <ul>
                        {SYMBOLS.map(s => (
                            <li key={s.id}>{s.icon} x3 = {s.value}x aposta ({s.weight}% chance base)</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatinhasSlots;