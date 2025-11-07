import React from 'react';
import TigerSlots from './components/TigerSlots';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header-theme">
        <h1>🐯 Fortune Tiger Simulator 🐯</h1>
        <p className="subtitle">Simulador educativo de volatilidade e ruína.</p>
      </header>
      <main>
        <TigerSlots />
      </main>
      <footer className="footer-theme">
        <p>⚠️ Este é um projeto de demonstração matemática. Não envolve dinheiro real.</p>
      </footer>
    </div>
  );
}

export default App;