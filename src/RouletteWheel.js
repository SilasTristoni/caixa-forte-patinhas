import React, { useState, useEffect } from 'react';
import './RouletteWheel.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Tente importar as imagens. Se falhar, usa placeholders.
// Coloque as imagens reais em src/assets/
let patinhasFeliz, patinhasBravo;
try {
    patinhasFeliz = require('./assets/patinhas-feliz.png');
    patinhasBravo = require('./assets/patinhas-bravo.png');
} catch (e) {
    patinhasFeliz = "https://via.placeholder.com/150/008000/FFFFFF?text=Patinhas+Feliz($$$)";
    patinhasBravo = "https://via.placeholder.com/150/FF0000/FFFFFF?text=Patinhas+Bravo(!)";
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RouletteWheel = () => {
  const STARTING_BALANCE = 1000;
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [betAmount, setBetAmount] = useState(10); // Valor padrão para facilitar
  const [betOption, setBetOption] = useState('redBlack');
  const [betDetails, setBetDetails] = useState('red');
  const [balanceHistory, setBalanceHistory] = useState([STARTING_BALANCE]);
  const [betCount, setBetCount] = useState(0);
  const [scroogeMood, setScroogeMood] = useState('neutral'); // 'neutral', 'happy', 'angry'
  const [gameOverMessage, setGameOverMessage] = useState('');

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = numbers.filter(n => !redNumbers.includes(n) && n !== 0);

  // Array visual da roleta (mantido do seu original)
  const rouletteSegments = [
    { number: 0, color: "green" }, { number: 32, color: "red" }, { number: 15, color: "black" },
    { number: 19, color: "red" }, { number: 4, color: "black" }, { number: 21, color: "red" },
    { number: 2, color: "black" }, { number: 25, color: "red" }, { number: 17, color: "black" },
    { number: 34, color: "red" }, { number: 6, color: "black" }, { number: 27, color: "red" },
    { number: 13, color: "black" }, { number: 36, color: "red" }, { number: 11, color: "black" },
    { number: 30, color: "red" }, { number: 8, color: "black" }, { number: 23, color: "red" },
    { number: 10, color: "black" }, { number: 5, color: "red" }, { number: 24, color: "black" },
    { number: 16, color: "red" }, { number: 33, color: "black" }, { number: 1, color: "red" },
    { number: 20, color: "black" }, { number: 14, color: "red" }, { number: 31, color: "black" },
    { number: 9, color: "red" }, { number: 22, color: "black" }, { number: 18, color: "red" },
    { number: 29, color: "black" }, { number: 7, color: "red" }, { number: 28, color: "black" },
    { number: 12, color: "red" }, { number: 35, color: "black" }, { number: 3, color: "red" },
    { number: 26, color: "black" },
  ];

  // Monitora a falência para exibir a mensagem educativa 
  useEffect(() => {
      if (balance <= 0 && betCount > 0) {
          setGameOverMessage("FIM DE JOGO! O Tio Patinhas ficou com tudo. Essa é a 'Ruína do Jogador': com recursos limitados, se você continuar jogando, a matemática garante que você perderá tudo a longo prazo.");
          setScroogeMood('happy');
      }
  }, [balance, betCount]);

  const checkWin = (winningNumber, option, details, amount) => {
      let winnings = 0;
      if (option === 'number' && parseInt(details) === winningNumber) {
          winnings = amount * 35;
      } else if (option === 'redBlack') {
          if (details === 'red' && redNumbers.includes(winningNumber)) winnings = amount;
          else if (details === 'black' && blackNumbers.includes(winningNumber)) winnings = amount;
      } else if (option === 'evenOdd') {
          if (details === 'even' && winningNumber % 2 === 0 && winningNumber !== 0) winnings = amount;
          else if (details === 'odd' && winningNumber % 2 !== 0 && winningNumber !== 0) winnings = amount;
      }
      // Adicione outras lógicas de aposta aqui se necessário (lowHigh, dozen)
      return winnings;
  };

  const spinWheel = () => {
    if (balance <= 0) return;
    setScroogeMood('neutral');
    setIsSpinning(true);
    setGameOverMessage('');

    // Deduz a aposta imediatamente
    const currentBetAmount = parseInt(betAmount);
    if (currentBetAmount > balance || currentBetAmount <= 0) {
        alert("Aposta inválida!");
        setIsSpinning(false);
        return;
    }

    setBalance(prev => prev - currentBetAmount);

    const randomIndex = Math.floor(Math.random() * numbers.length);

    // Tempo da animação
    setTimeout(() => {
      const winningNumber = numbers[randomIndex];
      setSelectedNumber(winningNumber);
      setIsSpinning(false);

      const winnings = checkWin(winningNumber, betOption, betDetails, currentBetAmount);

      if (winnings > 0) {
          // Jogador ganhou: devolve a aposta original + lucro
          const totalPrizr = currentBetAmount + winnings;
          setBalance(prev => {
              const newBal = prev + totalPrizr;
              setBalanceHistory(hist => [...hist, newBal]);
              return newBal;
          });
          setScroogeMood('angry'); // Tio Patinhas não gosta de perder dinheiro
          alert(`Você ganhou $${winnings}! O Tio Patinhas está furioso!`);
      } else {
          // Jogador perdeu (o saldo já foi descontado no início do giro)
           setBalance(prev => {
              setBalanceHistory(hist => [...hist, prev]);
              return prev;
           });
          setScroogeMood('happy'); // Tio Patinhas lucrou
      }
      setBetCount(prev => prev + 1);
    }, 2000);
  };

  // --- NOVO: SIMULAÇÃO AUTOMÁTICA (Requisito do PDF) ---
  // Simula até 1000 rodadas rapidamente para provar a teoria [cite: 103, 124]
  const runSimulation = () => {
      if (isSpinning) return;
      let simBalance = balance;
      let simHistory = [...balanceHistory];
      let rounds = 0;
      const bet = 10; // Aposta fixa para simulação

      // Loop de simulação: para se quebrar OU chegar a 1000 rodadas
      while (simBalance >= bet && rounds < 1000) {
          simBalance -= bet;
          const winningNumber = Math.floor(Math.random() * 37);
          // Simulação simples apostando sempre no VERMELHO para demonstrar
          if (redNumbers.includes(winningNumber)) {
              simBalance += (bet * 2);
          }
          simHistory.push(simBalance);
          rounds++;
      }

      setBalance(simBalance);
      setBalanceHistory(simHistory);
      setBetCount(prev => prev + rounds);
      setScroogeMood(simBalance <= 0 ? 'happy' : 'neutral');
      if(simBalance <= 0) {
         alert(`Simulação finalizada: Você faliu em ${rounds} rodadas. A matemática venceu.`);
      } else {
         alert(`Simulação finalizada após ${rounds} rodadas. Saldo: $${simBalance}`);
      }
  };

  const resetGame = () => {
      setBalance(STARTING_BALANCE);
      setBalanceHistory([STARTING_BALANCE]);
      setBetCount(0);
      setGameOverMessage('');
      setScroogeMood('neutral');
      setSelectedNumber(null);
  };

  // Componente do Gráfico
  const data = {
      labels: balanceHistory.map((_, i) => i),
      datasets: [{
          label: 'Saldo do Jogador ($)',
          data: balanceHistory,
          borderColor: balanceHistory[balanceHistory.length -1] <= 0 ? 'red' : '#ffd700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderWidth: 2,
          pointRadius: 1,
      }],
    };
    const options = {
      responsive: true,
      animation: { duration: 0 }, // Desativa animação do gráfico para a simulação rápida não travar
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Trajetória da Ruína (Histórico de Saldo)' },
      },
      scales: { y: { beginAtZero: true } }
    };

  return (
    <div className="roulette-container">
      <div className="left-panel">
        {/* Painel do Tio Patinhas (Feedback Visual) */}
        <div className={`scrooge-panel mood-${scroogeMood}`}>
            <h3>A Banca (Tio Patinhas)</h3>
            <div className="scrooge-avatar">
                {scroogeMood === 'happy' && <img src={patinhasFeliz} alt="Tio Patinhas Feliz" />}
                {scroogeMood === 'angry' && <img src={patinhasBravo} alt="Tio Patinhas Bravo" />}
                {scroogeMood === 'neutral' && <div className="neutral-face">💰</div>}
            </div>
            <p>
                {scroogeMood === 'happy' ? "Hahaha! Mais dinheiro para minha caixa-forte!" :
                 scroogeMood === 'angry' ? "Grrr! Devolva minha moedinha número 1!" :
                 "Estou de olho nas suas fichas..."}
            </p>
        </div>

        <div className="betting-panel">
          <h2>Faça sua Aposta</h2>
          <div className="control-group">
              <label>Tipo:</label>
              <select onChange={(e) => setBetOption(e.target.value)} disabled={isSpinning}>
                <option value="redBlack">Vermelho/Preto (1:1)</option>
                <option value="evenOdd">Par/Ímpar (1:1)</option>
                <option value="number">Número Único (35:1)</option>
              </select>
          </div>

          {/* Renderização condicional dos inputs de aposta */}
          <div className="control-group">
             <label>Escolha:</label>
             {betOption === 'number' ? (
                <input type="number" min="0" max="36" value={betDetails} onChange={(e) => setBetDetails(e.target.value)} />
             ) : (
                <select onChange={(e) => setBetDetails(e.target.value)} disabled={isSpinning}>
                    {betOption === 'redBlack' && <><option value="red">Vermelho</option><option value="black">Preto</option></>}
                    {betOption === 'evenOdd' && <><option value="even">Par</option><option value="odd">Ímpar</option></>}
                </select>
             )}
          </div>

          <div className="control-group">
            <label>Valor ($):</label>
            <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} disabled={isSpinning}/>
          </div>

          <button className="spin-button" onClick={spinWheel} disabled={isSpinning || balance <= 0}>
            {isSpinning ? 'Girando...' : 'Apostar e Girar'}
          </button>

          {/* Botão de Simulação exigido no PDF */}
          <button className="sim-button" onClick={runSimulation} disabled={isSpinning || balance <= 0}>
             ⚡ Simulação Rápida (1000x Vermelho)
          </button>
        </div>
      </div>

      <div className="center-panel">
        {gameOverMessage && <div className="game-over-alert">{gameOverMessage} <button onClick={resetGame}>Tentar de Novo</button></div>}

        <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
          {rouletteSegments.map((item, index) => (
            <div key={index} className="wheel-segment" style={{
                transform: `rotate(${(360 / rouletteSegments.length) * index}deg)`,
                backgroundColor: item.color
              }}>
              <span className="wheel-number" style={{ transform: `rotate(-${(360 / rouletteSegments.length) * index}deg)` }}>
                {item.number}
              </span>
            </div>
          ))}
        </div>
        <div className="indicator">▼</div>
        {selectedNumber !== null && !isSpinning && (
          <div className="result-display">
            Resultado: <strong>{selectedNumber}</strong> ({rouletteSegments.find(s => s.number === selectedNumber)?.color === 'red' ? 'Vermelho' : rouletteSegments.find(s => s.number === selectedNumber)?.color === 'black' ? 'Preto' : 'Verde'})
          </div>
        )}
      </div>

      <div className="right-panel">
        <div className="balance-display">
            <h3>Seu Saldo: <span className={balance <= 0 ? 'broke' : ''}>${balance}</span></h3>
        </div>
        <div className="chart-container">
            <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default RouletteWheel;