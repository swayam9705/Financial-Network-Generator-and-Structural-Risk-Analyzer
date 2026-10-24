import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Header/Header';
import { MetricsBar } from '../../components/MetricsBar/MetricsBar';
import { ControlsPanel } from '../../components/ControlsPanel/ControlsPanel';
import { NetworkGraph } from '../../components/NetworkGraph/NetworkGraph';
import { BankLedgerTable } from '../../components/BankLedgerTable/BankLedgerTable';
import { fetchGeneratedNetwork, fetchSimulatedShock } from '../../services/api';
import './DashboardPage.css';

export function DashboardPage() {
    const [mode, setMode] = useState('api');
    const [isBackendConnected, setIsBackendConnected] = useState(true);
    const [loading, setLoading] = useState(false);

    // Network State
    const [numCore, setNumCore] = useState(5);
    const [numPeriphery, setNumPeriphery] = useState(45);
    const [seed, setSeed] = useState(42);
    const [shockedBankId, setShockedBankId] = useState(0);
    const [shockMultiplier, setShockMultiplier] = useState(0.05);

    // Response Data State
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [globalMetrics, setGlobalMetrics] = useState(null);
    const [bankReport, setBankReport] = useState([]);
    const [defaultedIds, setDefaultedIds] = useState([]);

    // Generate Graph Callback
    const handleGenerate = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchGeneratedNetwork(numCore, numPeriphery, seed);
            setNodes(data.nodes);
            setEdges(data.edges);
            setGlobalMetrics(data.global_metrics);
            setIsBackendConnected(true);

            // Initialize mock baseline ledger
            const initialReport = data.nodes.map((n) => ({
                bank_id: n.id,
                type: n.type,
                ext_assets: n.external_assets,
                owed: 100.0,
                paid: 100.0,
                recovery_pct: 100.0,
                status: 'Healthy'
            }));
            setBankReport(initialReport);
            setDefaultedIds([]);
        } catch (err) {
            console.warn('API unavailable. Falling back to offline client simulation mode:', err);
            setIsBackendConnected(false);
            setMode('local');
        } finally {
            setLoading(false);
        }
    }, [numCore, numPeriphery, seed]);

    // Simulate Shock Callback
    const handleSimulate = async () => {
        setLoading(true);
        try {
            const data = await fetchSimulatedShock(numCore, numPeriphery, seed, shockedBankId, shockMultiplier);
            setBankReport(data.bank_report);
            setDefaultedIds(data.defaulted_bank_ids);
        } catch (err) {
            console.error('Failed to execute simulation:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGenerate();
    }, [handleGenerate]);

    return (
        <div className="dashboard-page">
            <Header
                mode={mode}
                setMode={setMode}
                isBackendConnected={isBackendConnected}
            />

            <MetricsBar
                globalMetrics={globalMetrics}
                totalDefaults={defaultedIds.length}
                shockedBankId={shockedBankId}
            />

            <div className="dashboard-page__body">
                <ControlsPanel
                    numCore={numCore}
                    setNumCore={setNumCore}
                    numPeriphery={numPeriphery}
                    setNumPeriphery={setNumPeriphery}
                    seed={seed}
                    setSeed={setSeed}
                    shockedBankId={shockedBankId}
                    setShockedBankId={setShockedBankId}
                    shockMultiplier={shockMultiplier}
                    setShockMultiplier={setShockMultiplier}
                    onGenerate={handleGenerate}
                    onSimulate={handleSimulate}
                    totalNodes={nodes.length}
                    loading={loading}
                />

                <div className="dashboard-page__main-content">
                    <NetworkGraph
                        nodes={nodes}
                        edges={edges}
                        defaultedIds={defaultedIds}
                        shockedBankId={shockedBankId}
                        onSelectBank={(id) => setShockedBankId(id)}
                    />

                    <BankLedgerTable bankReport={bankReport} />
                </div>
            </div>
        </div>
    );
}