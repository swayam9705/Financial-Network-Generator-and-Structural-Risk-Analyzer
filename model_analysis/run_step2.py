from src.network_generator import FinancialNetworkSimulator
from src.clearing_mechanism import EisenbergNoeClearing
import numpy as np

if __name__ == "__main__":
    print("Running Step 2: Systemic Risk & Clearing Solver")
    
    # Generate the network using Step 1 simulator
    sim = FinancialNetworkSimulator(num_core=5, num_periphery=45, seed=42)
    G = sim.generate_core_periphery_graph()
    L = sim.get_liability_matrix(G)
    
    # Extract initial external assets for each bank
    external_assets = np.array([G.nodes[i]['external_assets'] for i in sorted(G.nodes())])
    
    # Initialize the Clearing Solver
    solver = EisenbergNoeClearing(L, external_assets)
    print(f"Total Banks in System: {solver.N}")
    print(f"Total Nominal Interbank Obligations: {np.sum(solver.p_bar):.2f}")
    
    # Baseline Simulation (Normal market conditions)
    p_baseline = solver.solve_clearing_vector()
    defaults_baseline = solver.get_defaulted_banks(p_baseline)
    print(f"Baseline Defaults: {len(defaults_baseline)} banks defaulted under normal conditions.")
    
    # Stress Test: Inject a Shock (Force Bank 0, a Core Bank, to lose 95% of its external assets)
    print("Injecting Financial Stress Test")
    print("Action: Wiping out 95% of external assets for Bank 0 (Core Bank)...")
    
    shocked_assets = external_assets.copy()
    shocked_assets[0] *= 0.05  # Retain only 5% of external assets
    
    shocked_solver = EisenbergNoeClearing(L, shocked_assets)
    p_shocked = shocked_solver.solve_clearing_vector()
    defaults_shocked = shocked_solver.get_defaulted_banks(p_shocked)
    
    print(f"Stress-Test Results: {len(defaults_shocked)} banks defaulted.")
    print(f"Defaulted Bank IDs: {list(defaults_shocked)}")
    
    # Show payment ratio for Bank 0 and a few connected periphery banks
    print("\nPayment Recovery Ratios (Actual Paid / Owed):")
    for bank_id in [0, 1, 5, 10]:
        ratio = p_shocked[bank_id] / solver.p_bar[bank_id] if solver.p_bar[bank_id] > 0 else 1.0
        b_type = G.nodes[bank_id]['type']
        print(f"Bank {bank_id} ({b_type}): {ratio * 100:.2f}% of debt paid")

    import pandas as pd

    # Compile data for every bank into a list of dictionaries
    bank_records = []
    for i in range(solver.N):
        b_type = G.nodes[i]['type']
        owed = solver.p_bar[i]
        paid = p_shocked[i]
        
        # Calculate recovery ratio (avoiding division by zero)
        ratio = (paid / owed) if owed > 0 else 1.0
        
        # Determine status based on defaults list
        status = "DEFAULTED" if i in defaults_shocked else "Healthy"
        
        bank_records.append({
            "Bank_ID": i,
            "Type": b_type,
            "Ext_Assets": round(shocked_assets[i], 2),
            "Owed": round(owed, 2),
            "Paid": round(paid, 2),
            "Recovery_%": round(ratio * 100, 2),
            "Status": status
        })

    # Convert to a Pandas DataFrame for clean tabular display
    df_report = pd.DataFrame(bank_records)
    
    # Configure pandas to display all rows without truncation
    pd.set_option('display.max_rows', None)
    pd.set_option('display.width', 1000)
    
    print("\n--- Complete Systemic Risk Report for All Banks ---")
    print(df_report)