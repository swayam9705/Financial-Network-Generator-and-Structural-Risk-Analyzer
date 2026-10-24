from src.network_generator import FinancialNetworkSimulator
from src.clearing_mechanism import EisenbergNoeClearing
from src.feature_extractor import FeatureExtractor
import numpy as np
import pandas as pd

if __name__ == "__main__":
    print("--- Running Step 3: Feature Engineering & Structural Risk Analysis ---\n")
    
    # Generate Network and Balance Sheets
    sim = FinancialNetworkSimulator(num_core=5, num_periphery=45, seed=42)
    G = sim.generate_core_periphery_graph()
    L = sim.get_liability_matrix(G)
    external_assets = np.array([G.nodes[i]['external_assets'] for i in sorted(G.nodes())])
    
    # Run Clearing Mechanism under a Shock Scenario
    # Let's decrease the assets of Bank 0 to trigger a cascade
    shocked_assets = external_assets.copy()
    shocked_assets[0] *= 0.05 
    
    solver = EisenbergNoeClearing(L, shocked_assets)
    p_shocked = solver.solve_clearing_vector()
    defaults = solver.get_defaulted_banks(p_shocked)
    
    # Extract Features
    extractor = FeatureExtractor(G, L, shocked_assets)
    
    # Node-level feature matrix
    df_node_features = extractor.extract_node_features()
    
    # Label the dataset with target variable (1 if defaulted, 0 if healthy)
    df_node_features['Target_Defaulted'] = df_node_features['Bank_ID'].apply(lambda x: 1 if x in defaults else 0)
    
    # Global graph features
    global_features = extractor.extract_global_graph_features()
    
    print("=== Global Macro Network Features (Linear Algebra & Topology) ===")
    for key, val in global_features.items():
        print(f"{key}: {val:.4f}")
        
    print("\n=== Node-Level Feature Matrix Sample (First 5 Banks) ===")
    pd.set_option('display.max_columns', 10)
    pd.set_option('display.width', 1000)
    print(df_node_features.head())
    
    # Save feature dataset for future machine learning modeling
    output_path = "./data/processed_financial_features.csv"
    df_node_features.to_csv(output_path, index=False)
    print(f"\nSuccessfully saved processed feature dataset to: {output_path}")