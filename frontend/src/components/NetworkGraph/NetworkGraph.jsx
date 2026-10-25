import React, { useState, useRef } from 'react';
import './NetworkGraph.css';

export function NetworkGraph({ nodes, edges, defaultedIds, shockedBankId, onSelectBank }) {
    const [positions, setPositions] = useState({});
    const [draggingNodeId, setDraggingNodeId] = useState(null);

    // Canvas Panning State
    const [isPanning, setIsPanning] = useState(false);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const svgRef = useRef(null);

    // Initialize node layout dynamically
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
                const radius = 230 + (node.id % 3) * 25;
                const angle = (node.id / nodes.length) * 2 * Math.PI;
                initialPos[node.id] = {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle)
                };
            }
        });
        setPositions(initialPos);
    }, [nodes]);

    // Handle Mouse Down on Background (Start Panning)
    const handleMouseDownBackground = (e) => {
        if (e.target.tagName === 'svg' || e.target.classList.contains('network-graph__svg')) {
            setIsPanning(true);
            setStartPoint({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        }
    };

    // Handle Mouse Down on Individual Node
    const handleMouseDownNode = (id) => (e) => {
        e.stopPropagation(); // Prevent background panning when grabbing a node
        setDraggingNodeId(id);
        onSelectBank(id);
    };

    // Handle Global Mouse Move (Drags Node OR Pans Background)
    const handleMouseMove = (e) => {
        if (draggingNodeId !== null && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            // Adjust coordinates accounting for current pan offset
            const x = e.clientX - rect.left - panOffset.x;
            const y = e.clientY - rect.top - panOffset.y;

            setPositions((prev) => ({
                ...prev,
                [draggingNodeId]: { x, y }
            }));
        } else if (isPanning) {
            setPanOffset({
                x: e.clientX - startPoint.x,
                y: e.clientY - startPoint.y
            });
        }
    };

    const handleMouseUp = () => {
        setDraggingNodeId(null);
        setIsPanning(false);
    };

    return (
        <div
            className="network-graph"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
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
                <div className="network-graph__hint">💡 Tip: Drag background to pan map</div>
            </div>

            <svg
                ref={svgRef}
                className="network-graph__svg"
                viewBox="0 0 800 550"
                onMouseDown={handleMouseDownBackground}
            >
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-color)" />
                    </marker>
                </defs>

                {/* Pervasive Group Container applying Pan Offset */}
                <g transform={`translate(${panOffset.x}, ${panOffset.y})`}>
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
                                onMouseDown={handleMouseDownNode(node.id)}
                                className="network-graph__node-group"
                            >
                                <rect
                                    x={isCore ? -18 : -12}
                                    y={isCore ? -18 : -12}
                                    width={isCore ? 36 : 24}
                                    height={isCore ? 36 : 24}
                                    rx="4"
                                    className={nodeClass}
                                />
                                <text y={isCore ? 30 : 24} className="network-graph__label">
                                    #{node.id}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}