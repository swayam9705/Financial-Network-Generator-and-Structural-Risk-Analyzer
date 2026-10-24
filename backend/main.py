from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from model_analysis.src.network_generator import FinancialNetworkSimulator
from model_analysis.src.clearing_mechanism import EisenbergNoeClearing
from model_analysis.src.feature_extractor import FeatureExtractor
from backend.schemas import NetworkRequest, ShockRequest

app = FastAPI(title="Financial Systemic Risk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome",
        "interactive_docs": "/docs"
    }

@app.post("/api/generate-network")
def generate_network(config: NetworkRequest):
    """
    Generates a financial network topology 
    """

    try:
        sim = FinancialNetworkSimulator(
            num_core=config.num_core,
            num_periphery=config.num_periphery,
            seed=config.seed
        )

        G = sim.generate_core_periphery_graph()
        L = sim.get_liability_matrix(G)
        external_assets = np.array([G.nodes[i]["external_assets"] for i in sorted(G.nodes())])

        extractor = FeatureExtractor(G, L, external_assets)
        global_metrics = extractor.extract_global_graph_features()

        nodes = [
            {
                "id": node,
                "type": G.nodes[node]["type"],
                "capital": round(G.nodes[node]["capital"], 2),
                "external_assets": round(G.nodes[node]["external_assets"], 2)
            }
            for node in G.nodes()
        ]

        edges = [
            {
                "source": u,
                "target": v,
                "weight": round(G[u][v]["weight"], 2)
            }
            for u, v in G.edges()
        ]

        return {
            "status": "sucees",
            "total_nodes": G.number_of_nodes(),
            "total_edges": G.number_of_edges(),
            "global_metrics": global_metrics,
            "nodes": nodes,
            "edges": edges
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/simulate-shock")
def simulate_shock(config: ShockRequest):
    """
    Applies a liquidity shock to a specified bank and runs the Eisenberg-Noe clearing solver.
    Returns the final status and recovery ratios for all banks in the system.
    """
    try:
        sim = FinancialNetworkSimulator(
            num_core=config.num_core,
            num_periphery=config.num_periphery,
            seed=config.seed
        )
        G = sim.generate_core_periphery_graph()
        L = sim.get_liability_matrix(G)
        external_assets = np.array([G.nodes[i]['external_assets'] for i in sorted(G.nodes())])
        
        # validate shocked bank ID
        if not (0 <= config.shocked_bank_id < len(external_assets)):
            raise HTTPException(status_code=400, detail=f"Invalid shocked_bank_id. Must be between 0 and {len(external_assets)-1}.")
        
        # apply the shock
        shocked_assets = external_assets.copy()
        shocked_assets[config.shocked_bank_id] *= config.shock_multiplier
        
        # run solver
        solver = EisenbergNoeClearing(L, shocked_assets)
        p_shocked = solver.solve_clearing_vector()
        defaults = solver.get_defaulted_banks(p_shocked)
        
        # bank-by-bank report for frontend
        bank_report = []
        for i in range(solver.N):
            owed = solver.p_bar[i]
            paid = p_shocked[i]
            ratio = (paid / owed) if owed > 0 else 1.0
            status = "DEFAULTED" if i in defaults else "Healthy"
            
            bank_report.append({
                "bank_id": i,
                "type": G.nodes[i]['type'],
                "ext_assets": round(float(shocked_assets[i]), 2),
                "owed": round(float(owed), 2),
                "paid": round(float(paid), 2),
                "recovery_pct": round(float(ratio * 100), 2),
                "status": status
            })
            
        return {
            "status": "success",
            "shocked_bank_id": config.shocked_bank_id,
            "total_defaults": len(defaults),
            "defaulted_bank_ids": [int(b) for b in defaults],
            "bank_report": bank_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))