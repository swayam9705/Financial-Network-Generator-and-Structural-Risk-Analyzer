import React from 'react';
import './Header.css';

export function Header({ mode, setMode, isBackendConnected }) {
    return (
        <header className="header">
            <div className="header__branding">
                <span className="header__symbol">▲</span>
                <h1 className="header__title">DEEPSYSTEMIC</h1>
                <span className="header__tag">v1.0.0</span>
            </div>

            <div className="header__controls">
                <div className="header__status">
                    <span className={`header__indicator ${isBackendConnected ? 'header__indicator--active' : 'header__indicator--offline'}`} />
                    <span className="header__status-text">
                        {isBackendConnected ? 'FASTAPI LIVE' : 'CLIENT SIMULATION'}
                    </span>
                </div>

                <div className="header__toggle-group">
                    <button
                        className={`header__toggle-btn ${mode === 'api' ? 'header__toggle-btn--selected' : ''}`}
                        onClick={() => setMode('api')}
                    >
                        API ENGINE
                    </button>
                    <button
                        className={`header__toggle-btn ${mode === 'local' ? 'header__toggle-btn--selected' : ''}`}
                        onClick={() => setMode('local')}
                    >
                        LOCAL JS ENGINE
                    </button>
                </div>
            </div>
        </header>
    );
}