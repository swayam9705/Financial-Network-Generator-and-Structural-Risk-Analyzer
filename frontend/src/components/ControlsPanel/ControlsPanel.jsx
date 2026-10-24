import React from 'react';
import './ControlsPanel.css';

export function ControlsPanel({
    numCore,
    setNumCore,
    numPeriphery,
    setNumPeriphery,
    seed,
    setSeed,
    shockedBankId,
    setShockedBankId,
    shockMultiplier,
    setShockMultiplier,
    onGenerate,
    onSimulate,
    totalNodes,
    loading
}) {
    return (
        <div className="controls-panel">
            <div className="controls-panel__section">
                <h3 className="controls-panel__title">1. TOPOLOGY PARAMETERS</h3>

                <div className="controls-panel__group">
                    <label className="controls-panel__label">CORE BANKS ({numCore})</label>
                    <input
                        type="range"
                        min="1"
                        max="15"
                        value={numCore}
                        onChange={(e) => setNumCore(Number(e.target.value))}
                        className="controls-panel__range"
                    />
                </div>

                <div className="controls-panel__group">
                    <label className="controls-panel__label">PERIPHERY BANKS ({numPeriphery})</label>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={numPeriphery}
                        onChange={(e) => setNumPeriphery(Number(e.target.value))}
                        className="controls-panel__range"
                    />
                </div>

                <div className="controls-panel__group">
                    <label className="controls-panel__label">SEED VALUE</label>
                    <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(Number(e.target.value))}
                        className="controls-panel__input"
                    />
                </div>

                <button
                    className="controls-panel__button"
                    onClick={onGenerate}
                    disabled={loading}
                >
                    {loading ? 'GENERATING...' : 'GENERATE GRAPH'}
                </button>
            </div>

            <div className="controls-panel__section">
                <h3 className="controls-panel__title">2. STRESS TEST INJECTION</h3>

                <div className="controls-panel__group">
                    <label className="controls-panel__label">TARGET BANK ID (0 TO {totalNodes - 1})</label>
                    <input
                        type="number"
                        min="0"
                        max={totalNodes - 1}
                        value={shockedBankId}
                        onChange={(e) => setShockedBankId(Number(e.target.value))}
                        className="controls-panel__input"
                    />
                </div>

                <div className="controls-panel__group">
                    <label className="controls-panel__label">ASSET RETENTION ({(shockMultiplier * 100).toFixed(0)}%)</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={shockMultiplier}
                        onChange={(e) => setShockMultiplier(Number(e.target.value))}
                        className="controls-panel__range"
                    />
                </div>

                <button
                    className="controls-panel__button controls-panel__button--alert"
                    onClick={onSimulate}
                    disabled={loading}
                >
                    {loading ? 'CALCULATING...' : 'RUN EISENBERG-NOE SHOCK'}
                </button>
            </div>
        </div>
    );
}