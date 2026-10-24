import React from 'react';
import './MetricsBar.css';

export function MetricsBar({ globalMetrics, totalDefaults, shockedBankId }) {
    return (
        <div className="metrics-bar">
            <div className="metrics-bar__item">
                <span className="metrics-bar__label">ALGEBRAIC CONNECTIVITY (FIEDLER)</span>
                <span className="metrics-bar__value">
                    {globalMetrics?.Algebraic_Connectivity_Fiedler?.toFixed(4) ?? '0.0000'}
                </span>
            </div>

            <div className="metrics-bar__item">
                <span className="metrics-bar__label">NETWORK DENSITY</span>
                <span className="metrics-bar__value">
                    {globalMetrics?.Network_Density?.toFixed(4) ?? '0.0000'}
                </span>
            </div>

            <div className="metrics-bar__item">
                <span className="metrics-bar__label">AVG CLUSTERING</span>
                <span className="metrics-bar__value">
                    {globalMetrics?.Avg_Clustering_Coefficient?.toFixed(4) ?? '0.0000'}
                </span>
            </div>

            <div className="metrics-bar__item metrics-bar__item--highlight">
                <span className="metrics-bar__label">ACTIVE SHOCK BANK TARGET</span>
                <span className="metrics-bar__value">BANK #{shockedBankId}</span>
            </div>

            <div className="metrics-bar__item metrics-bar__item--alert">
                <span className="metrics-bar__label">TOTAL CONTAGION DEFAULTS</span>
                <span className="metrics-bar__value">{totalDefaults} INSTITUTIONS</span>
            </div>
        </div>
    );
}