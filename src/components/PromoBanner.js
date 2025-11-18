import React, { useState, useEffect } from 'react';
import './PromoBanner.css';

const PromoBanner = () => {
    const promotions = [
        {
            id: 1,
            title: 'APRENDA SOBRE PROBABILIDADE',
            description: 'Entenda como funcionam as chances em jogos de azar',
            icon: '📊',
            color: '#00ff00'
        },
        {
            id: 2,
            title: 'JOGUE COM RESPONSABILIDADE',
            description: 'Este é um simulador educativo. Nunca aposte dinheiro real!',
            icon: '⚠️',
            color: '#ffeb3b'
        },
        {
            id: 3,
            title: 'MAXIMIZE SEUS GANHOS',
            description: 'Teste diferentes estratégias e veja o impacto no seu saldo',
            icon: '💡',
            color: '#ff6b6b'
        },
        {
            id: 4,
            title: 'ANÁLISE EM TEMPO REAL',
            description: 'Acompanhe suas estatísticas e evolução ao longo do tempo',
            icon: '📈',
            color: '#00d4ff'
        },
        {
            id: 5,
            title: 'DESAFIO DO DIA',
            description: 'Tente ganhar R$ 500 em uma única rodada!',
            icon: '🎯',
            color: '#ff00ff'
        }
    ];

    const [currentPromo, setCurrentPromo] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentPromo(prev => (prev + 1) % promotions.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay, promotions.length]);

    const handlePrev = () => {
        setCurrentPromo(prev => (prev - 1 + promotions.length) % promotions.length);
        setIsAutoPlay(false);
    };

    const handleNext = () => {
        setCurrentPromo(prev => (prev + 1) % promotions.length);
        setIsAutoPlay(false);
    };

    const handleDotClick = (index) => {
        setCurrentPromo(index);
        setIsAutoPlay(false);
    };

    const promo = promotions[currentPromo];

    return (
        <div className="promo-banner-container">
            <div className="promo-banner" style={{ borderColor: promo.color }}>
                <button className="promo-nav-btn promo-prev" onClick={handlePrev}>
                    ❮
                </button>

                <div className="promo-content">
                    <div className="promo-icon">{promo.icon}</div>
                    <div className="promo-text">
                        <h2 className="promo-title">{promo.title}</h2>
                        <p className="promo-description">{promo.description}</p>
                    </div>
                </div>

                <button className="promo-nav-btn promo-next" onClick={handleNext}>
                    ❯
                </button>
            </div>

            <div className="promo-indicators">
                {promotions.map((_, index) => (
                    <button
                        key={index}
                        className={`promo-dot ${index === currentPromo ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                        style={{
                            backgroundColor: index === currentPromo ? promo.color : 'rgba(0, 255, 0, 0.3)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PromoBanner;
