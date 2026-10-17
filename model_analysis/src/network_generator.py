import numpy as np
import networkx as nx
import pandas as pd

class FinancialNetworkSimulator:

    def __init__(self, num_core=5, num_periphery=45, seed=42):
        """
        Generates a synthetic interbank networks mimicking core-periphery 
        structures and constructs interbank liability matrices for systemic
        risk analysis
        """
        self.num_core = num_core
        self.num_periphery = num_periphery
        self.total_nodes = num_core + num_periphery
        self.seed = seed
        np.random.seed(seed)

    
    def generate_core_periphery_graph(self):
        """Generates a directed, weighted graph using a Stochastic Block Model
        to simulate core-periphery banking relationships"""

        # Block sizes: [Core banks, Periphery banks]
        sizes = [self.num_core, self.num_periphery]


        # Probability matrix for edges between/within blocks
        # core-to-core connectivity is high
        # periphery-to-core & core-to-periphery connectivity is moderate
        # periphery-to-periphery connectivity is very low
        probs = [
            [0.7, 0.4],
            [0.4, 0.03]
        ]

        # Generate a directd stochastic block model graph.

        G = nx.stochastic_block_model(sizes, probs, seed=self.seed, directed=True)

        # Assign attributes to nodes (banks)
        for node in G.nodes():
            is_core = node < self.num_core
            G.nodes[node]["type"] = 'Core' if is_core else "Periphery"

            # Core banks have higher initial capital and assets
            G.nodes[node]["capital"] = np.random.uniform(500, 1000) if is_core else np.random.uniform(50, 150)
            G.nodes[node]["external_assets"] = np.random.uniform(2000, 5000) if is_core else np.random.uniform(200, 600)

        for u, v in G.edges():
            # Core banks lend larger amounts
            is_core_edge = (u < self.num_core) and (v < self.num_core)
            weight = np.random.uniform(100, 500) if is_core_edge else np.random.uniform(5, 50) 
            G[u][v]["weight"] = weight

        return G

    def get_liability_matrix(self, G):
        """Extracts the weighted adjacency matrix (Liability Matrix L) from the
        Network"""

        # nx.to_numpy_array extracts weights matching node order 0 to N - 1
        # in simple term, L[i][j] is the liabilities that Bank i owes to Bank j
        # here Bank i is the borrower and Bank j is the lender
        L = nx.to_numpy_array(G, weight="weight", nodelist=sorted(G.nodes()))
        return L

    def compute_graph_metrics(self, G):
        """Computes essential sturturcal graph theory metrics for systematic
        risk analysis"""

        # 1. high in_degree_centrality banks are the core banks acting as major
        # lenders.
        # 2. high out_degree_centrality banks are the entities (often periphery
        #    banks) that borrow from multiple multiple lenders (possibly corel
        #    banks)

        metrics = {
            "in_degree_centrality": nx.in_degree_centrality(G),
            "out_degree_centrality": nx.out_degree_centrality(G),
            "pagerank": nx.pagerank(G, weight="weight"),
            "clustering_coefficient": nx.clustering(G.to_undirected())
        }

        return metrics




