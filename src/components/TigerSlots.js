import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import './TigerSlots.css';

// Registra componentes do gráfico
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Configuração dos Símbolos (Peso define a raridade)
const SYMBOLS = [
    { icon: '🍊', value: 2, weight: 50 },  // Laranja: Comum (50% chance base)
    { icon: '🧧', value: 5, weight: 30 },  // Envelope: Médio (30%)
    { icon: '💰', value: 10, weight: 15 }, // Saco de Ouro: Raro (15%)
    { icon: '🐯', value: 50, weight: 5 }   // Tigre: Muito Raro/Jackpot (5%)
];

// Função para sortear um símbolo com base no seu peso
const getRandomSymbol = () => {
    const totalWeight = SYMBOLS.reduce((acc, symbol) => acc + symbol.weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (let i = 0; i < SYMBOLS.length; i++) {
        if (randomNum < SYMBOLS[i].weight) {
            return SYMBOLS[i];
        }
        randomNum -= SYMBOLS[i].weight;
    }
    return SYMBOLS[0];
};

const TigerSlots = () => {
    const STARTING_BALANCE = 200;
    const [balance, setBalance] = useState(STARTING_BALANCE);
    const [betAmount, setBetAmount] = useState(5);
    const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
    const [isSpinning, setIsSpinning] = useState(false);
    const [message, setMessage] = useState('Tente a sorte!');
    const [tigerMood, setTigerMood] = useState('neutral'); // neutral, happy (ganhou), angry (perdeu jackpot)
    const [balanceHistory, setBalanceHistory] = useState([STARTING_BALANCE]);

    // Monitora falência
    useEffect(() => {
        if (balance <= 0) {
            setMessage("FIM DE JOGO! A casa sempre vence.");
            setTigerMood('happy'); // Tigre feliz porque ficou com seu dinheiro
        }
    }, [balance]);

    const spin = () => {
        if (balance < betAmount || isSpinning) {
            alert("Saldo insuficiente ou rodada em andamento!");
            return;
        }

        setIsSpinning(true);
        setMessage('Girando...');
        setTigerMood('neutral');

        // Deduz aposta imediatamente
        setBalance(prev => prev - betAmount);

        // Animação de giro
        const interval = setInterval(() => {
            setReels([
                getRandomSymbol().icon,
                getRandomSymbol().icon,
                getRandomSymbol().icon
            ]);
        }, 100);

        // Resultado final após 2 segundos
        setTimeout(() => {
            clearInterval(interval);
            const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
            setReels(finalReels.map(s => s.icon));

            // Lógica de Vitória (3 símbolos iguais)
            let winAmount = 0;
            if (finalReels[0].icon === finalReels[1].icon && finalReels[1].icon === finalReels[2].icon) {
                winAmount = betAmount * finalReels[0].value;
            }
            // Bônus do Tigre (se aparecer 1 Tigre, ganha aposta de volta) - Opcional
            else if (finalReels.includes(SYMBOLS.find(s => s.icon === '🐯'))) {
                 winAmount = betAmount;
                 setMessage("Bônus do Tigre! Aposta devolvida.");
            }

            if (winAmount > 0) {
                setBalance(prev => {
                    const newBal = prev + winAmount;
                    setBalanceHistory(h => [...h, newBal]);
                    return newBal;
                });
                if (winAmount > betAmount) {
                    setMessage(`GRANDE VITÓRIA! Ganhou R$ ${winAmount}!`);
                    setTigerMood('angry'); // Tigre bravo porque perdeu dinheiro
                }
            } else {
                setBalanceHistory(h => [...h, balance - betAmount]);
                setMessage('Tente novamente...');
                setTigerMood('happy'); // Tigre feliz com seu prejuízo
            }

            setIsSpinning(false);
        }, 2000);
    };

    // Simulação Rápida (Demonstração da Ruína)
    const runFastSimulation = () => {
        if (isSpinning) return;
        let simBalance = balance;
        let simHistory = [...balanceHistory];
        let rounds = 0;

        while (simBalance >= betAmount && rounds < 500) { // Limite de 500 rodadas para não travar
            simBalance -= betAmount;
            const r1 = getRandomSymbol();
            const r2 = getRandomSymbol();
            const r3 = getRandomSymbol();

            if (r1.icon === r2.icon && r2.icon === r3.icon) {
                simBalance += (betAmount * r1.value);
            }
            simHistory.push(simBalance);
            rounds++;
        }
        setBalance(simBalance);
        setBalanceHistory(simHistory);
        setMessage(`Simulação de ${rounds} rodadas finalizada.`);
    };

    // Dados do Gráfico
    const chartData = {
        labels: balanceHistory.map((_, i) => i),
        datasets: [{
            label: 'Seu Saldo (R$)',
            data: balanceHistory,
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            tension: 0.2,
            pointRadius: 0
        }]
    };

    return (
        <div className="tiger-slots-container">
            <div className="game-section">
                <div className={`tiger-avatar mood-${tigerMood}`}>
                    {tigerMood === 'neutral' && '🐯'}
                    {tigerMood === 'happy' && '😼'}
                    {tigerMood === 'angry' && '😿'}
                </div>
                
                <div className="reels-container">
                    <div className={`reel ${isSpinning ? 'spinning' : ''}`}>{reels[0]}</div>
                    <div className={`reel ${isSpinning ? 'spinning' : ''}`}>{reels[1]}</div>
                    <div className={`reel ${isSpinning ? 'spinning' : ''}`}>{reels[2]}</div>
                </div>

                <div className="info-panel">
                    <h3>{message}</h3>
                </div>

                <div className="controls">
                    <div className="bet-selector">
                        <label>Aposta: R$ </label>
                        <select value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} disabled={isSpinning}>
                            <option value="1">1.00</option>
                            <option value="5">5.00</option>
                            <option value="10">10.00</option>
                            <option value="50">50.00</option>
                        </select>
                    </div>
                    <button className="spin-button-main" onClick={spin} disabled={isSpinning || balance < betAmount}>
                        GIRAR
                    </button>
                     <button className="sim-button" onClick={runFastSimulation} disabled={isSpinning || balance < betAmount}>
                        ⚡ Simular Ruína (500x)
                    </button>
                </div>
            </div>

            <div className="stats-section">
                <div className="balance-display-tiger">
                    SALDO: <span className={balance <= 0 ? 'zero-balance' : ''}>R$ {balance.toFixed(2)}</span>
                </div>
                <div className="chart-container-tiger">
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Histórico Financeiro', color: '#fff' } }, scales: { y: { ticks: { color: '#fff' }, grid: { color: '#333' } }, x: { display: false } } }} />
                </div>
                 <div className="paytable">
                    <h4>Tabela de Pagamentos (3x)</h4>
                    <ul>
                        {SYMBOLS.map(s => (
                            <li key={s.icon}>{s.icon} = {s.value}x aposta (Raridade: {s.weight}%)</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TigerSlots;