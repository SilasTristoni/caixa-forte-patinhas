import React from 'react';
import PatinhasSlots from './components/PatinhasSlots';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header-theme">
        <h1>Caixa-Forte do Patinhas 💰</h1>
        <p className="subtitle">Simulador educativo de volatilidade e reforço intermitente.</p>
      </header>
      <main>
        <PatinhasSlots />
      </main>
      <footer className="footer-theme">
        <p>⚠️ Este simulador demonstra matematicamente como jogos de azar são projetados para sempre favorecer a "casa" a longo prazo.</p>
      </footer>
    </div>
  );
}

export default App;