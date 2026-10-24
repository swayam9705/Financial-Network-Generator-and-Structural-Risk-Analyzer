import React, { useState } from 'react';
import './BankLedgerTable.css';

export function BankLedgerTable({ bankReport }) {
    const [filter, setFilter] = useState('ALL');

    const filteredBanks = bankReport.filter((b) => {
        if (filter === 'DEFAULTED') return b.status === 'DEFAULTED';
        if (filter === 'HEALTHY') return b.status === 'Healthy';
        return true;
    });

    return (
        <div className="bank-ledger">
            <div className="bank-ledger__header">
                <h3 className="bank-ledger__title">FINANCIAL CLEARING LEDGER</h3>

                <div className="bank-ledger__filters">
                    <button
                        className={`bank-ledger__filter-btn ${filter === 'ALL' ? 'bank-ledger__filter-btn--active' : ''}`}
                        onClick={() => setFilter('ALL')}
                    >
                        ALL
                    </button>
                    <button
                        className={`bank-ledger__filter-btn ${filter === 'DEFAULTED' ? 'bank-ledger__filter-btn--active' : ''}`}
                        onClick={() => setFilter('DEFAULTED')}
                    >
                        DEFAULTED
                    </button>
                    <button
                        className={`bank-ledger__filter-btn ${filter === 'HEALTHY' ? 'bank-ledger__filter-btn--active' : ''}`}
                        onClick={() => setFilter('HEALTHY')}
                    >
                        HEALTHY
                    </button>
                </div>
            </div>

            <div className="bank-ledger__table-wrapper">
                <table className="bank-ledger__table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>TYPE</th>
                            <th>EXT ASSETS</th>
                            <th>OWED</th>
                            <th>PAID</th>
                            <th>RECOVERY</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBanks.map((bank) => (
                            <tr
                                key={bank.bank_id}
                                className={bank.status === 'DEFAULTED' ? 'bank-ledger__row--defaulted' : ''}
                            >
                                <td>#{bank.bank_id}</td>
                                <td>{bank.type}</td>
                                <td>${bank.ext_assets.toFixed(2)}</td>
                                <td>${bank.owed.toFixed(2)}</td>
                                <td>${bank.paid.toFixed(2)}</td>
                                <td>{bank.recovery_pct.toFixed(1)}%</td>
                                <td>
                                    <span className={`bank-ledger__status ${bank.status === 'DEFAULTED' ? 'bank-ledger__status--alert' : ''}`}>
                                        {bank.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}