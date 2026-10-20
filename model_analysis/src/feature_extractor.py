"""
This step involves the extraction of powerful quantitative features from both the
graph topology and financial balance sheets. These features combine Graph Theory
and Linear Algebra and serve as the exact inputs if you or someone else later
wants to train a Machine Learning model to predict systemic bank failures instantly.
"""

import numpy as np
import networkx as nx
import pandas as pd
from scipy.linalg import eigvalsh

class FeatureExtractor:

    def __init__(self, G, L, external_assets):
        self.G = G
        self.L = L
        self.e = external_assets
        self.N = G.number_of_nodes()

    def extract_node_features(self):
        """
        Computes node-level features capturing structural importance and
        financial exposure.
        """

        in_deg = nx.in_degree_centrality(self.G)
        out_deg = nx.out_degree_centrality(self.G)
        pagerank = nx.pagerank(self.G, weight="weight")
        betweenness = nx.betweenness_centrality(self.G, weight="weight")
        clustering = nx.clustering(self.G.to_undirected())

        node_data = []

        for i in range(self.N):
            node_data.append({
                "Bank_ID": i,
                "Type": self.G.nodes[i]['type'],
                "External_Assets": self.e[i],
                "Nominal_Liabilities": np.sum(self.L[i, :]),
                "In_Degree_Cent": in_deg[i],
                "Out_Degree_Cent": out_deg[i],
                "PageRank": pagerank[i],
                "Betweenness_Cent": betweenness[i],
                "Clustering_Coeff": clustering[i]
            })

        return pd.DataFrame(node_data)


    def extract_global_graph_features(self):
        """
        Computes macro-level network features using Linear Algebra 
        """

        density = nx.density(self.G)
        avg_clustering = nx.average_clustering(self.G.to_undirected())

        # Convert graph to undirected for laplacian spectrum analysis
        G_undirected = self.G.to_undirected()

        laplacian_matrix = nx.laplacian_matrix(G_undirected).toarray()

        eigenvalues = eigvalsh(laplacian_matrix)
        eigenvalues = np.sort(eigenvalues)

        # The algebraic connectivity is the second smallest eigenvalue (Fiedler value)
        # If N > 1, eigenvalues[1] gives algebraic connectivity. Measure overall network robustness.
        algebraic_connectivity = eigenvalues[1] if len(eigenvalues) > 1 else 0.0

        global_features = {
            "Total_Nodes": self.N,
            "Total_Edges": self.G.number_of_edges(),
            "Network_Density": density,
            "Avg_Clustering_Coefficient": avg_clustering,
            "Algebraic_Connectivity_Fiedler": algebraic_connectivity,
            "Max_Laplacian_Eigenvalue": eigenvalues[-1] if len(eigenvalues) > 0 else 0.0
        }

        return global_features



