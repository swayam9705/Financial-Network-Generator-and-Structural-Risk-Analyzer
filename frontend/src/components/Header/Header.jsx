import React from 'react';
import './Header.css';

export function Header({ mode, setMode, isBackendConnected }) {
    return (
        <header className="header">
            <div className="header__branding">
                <span className="header__symbol">▲</span>
                <h1 className="header__title">DEEP SYSTEMIC</h1>
            </div>

            <div className="header__controls">

                <div className="header__toggle-group">
                </div>
            </div>
        </header>
    );
}