import React from 'react';
import RouletteWheel from './RouletteWheel';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header-theme">
        <h1 className="header-text">💰 Caixa-Forte do Tio Patinhas 💰</h1>
        <p className="subtitle">Onde a moeda número 1 nunca sai de casa.</p>
      </header>
      <RouletteWheel />
      <footer className="footer-theme">
        <p>Projeto Educativo: Demonstração da Teoria da Ruína do Jogador</p>
      </footer>
    </div>
  );
}

export default App;