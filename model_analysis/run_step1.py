from src.network_generator import FinancialNetworkSimulator
import pandas as pd


if __name__ == "__main__":
    print("initializing financial network simulator...")

    sim = FinancialNetworkSimulator(num_core=5, num_periphery=45, seed=42)

    # generating graph
    G = sim.generate_core_periphery_graph()
    print(f"successfully generated network with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")

    # getting liability matrix
    L_matrix = sim.get_liability_matrix(G)

    print(f"Liability Matrix shape: {L_matrix.shape}")
    print("Sample Liability Matrix (first 5x5 subgrid):\n", L_matrix[:5][:5])

    # getting metrics
    metrics = sim.compute_graph_metrics(G)

    # pagerank
    sorted_pr = sorted(metrics["pagerank"].items(), key=lambda x: x[1], reverse=True)
    print("Top 5 systemically important banks (by pagerank algorithm)")
    for node, pr_score in sorted_pr[:5]:
        node_type = G.nodes[node]["type"]
        print(f"Bank ID: {node} ({node_type}) | PageRank Score: {pr_score:.2f}")
