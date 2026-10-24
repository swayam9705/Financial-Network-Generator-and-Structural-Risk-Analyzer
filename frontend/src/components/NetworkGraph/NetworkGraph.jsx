import React, { useState, useRef } from 'react';
import './NetworkGraph.css';

export function NetworkGraph({ nodes, edges, defaultedIds, shockedBankId, onSelectBank }) {
    const [positions, setPositions] = useState({});
    const [draggingId, setDraggingId] = useState(null);
    const svgRef = useRef(null);

    // Initialize node layout dynamically if positions aren't stored yet
    React.useEffect(() => {
        const initialPos = {};
        const width = 800;
        const height = 550;
        const center = { x: width / 2, y: height / 2 };

        nodes.forEach((node) => {
            if (node.type === 'Core') {
                const radius = 120;
                const angle = (node.id / 5) * 2 * Math.PI;
                initialPos[node.id] = {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle)
                };
            } else {
                const radius = 230 + (node.id % 3) * 20;
                const angle = (node.id / nodes.length) * 2 * Math.PI;
                initialPos[node.id] = {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle)
                };
            }
        });
        setPositions(initialPos);
    }, [nodes]);

    const handleMouseDown = (id) => (e) => {
        e.stopPropagation();
        setDraggingId(id);
        onSelectBank(id);
    };

    const handleMouseMove = (e) => {
        if (draggingId === null || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPositions((prev) => ({
            ...prev,
            [draggingId]: { x, y }
        }));
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    return (
        <div className="network-graph" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="network-graph__legend">
                <div className="network-graph__legend-item">
                    <span className="network-graph__badge network-graph__badge--core" /> CORE BANK
                </div>
                <div className="network-graph__legend-item">
                    <span className="network-graph__badge network-graph__badge--periphery" /> PERIPHERY BANK
                </div>
                <div className="network-graph__legend-item">
                    <span className="network-graph__badge network-graph__badge--defaulted" /> DEFAULTED
                </div>
            </div>

            <svg ref={svgRef} className="network-graph__svg" viewBox="0 0 800 550">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#444444" />
                    </marker>
                </defs>

                {/* Render Links */}
                {edges.map((edge, idx) => {
                    const sourcePos = positions[edge.source];
                    const targetPos = positions[edge.target];
                    if (!sourcePos || !targetPos) return null;

                    return (
                        <line
                            key={idx}
                            x1={sourcePos.x}
                            y1={sourcePos.y}
                            x2={targetPos.x}
                            y2={targetPos.y}
                            className="network-graph__edge"
                            markerEnd="url(#arrow)"
                        />
                    );
                })}

                {/* Render Draggable Nodes */}
                {nodes.map((node) => {
                    const pos = positions[node.id] || { x: 400, y: 275 };
                    const isCore = node.type === 'Core';
                    const isDefaulted = defaultedIds.includes(node.id);
                    const isShockedTarget = node.id === shockedBankId;

                    let nodeClass = 'network-graph__node';
                    if (isCore) nodeClass += ' network-graph__node--core';
                    if (isDefaulted) nodeClass += ' network-graph__node--defaulted';
                    if (isShockedTarget) nodeClass += ' network-graph__node--target';

                    return (
                        <g
                            key={node.id}
                            transform={`translate(${pos.x}, ${pos.y})`}
                            onMouseDown={handleMouseDown(node.id)}
                            className="network-graph__node-group"
                        >
                            <rect
                                x={isCore ? -16 : -10}
                                y={isCore ? -16 : -10}
                                width={isCore ? 32 : 20}
                                height={isCore ? 32 : 20}
                                className={nodeClass}
                            />
                            <text y={isCore ? 28 : 22} className="network-graph__label">
                                #{node.id}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}