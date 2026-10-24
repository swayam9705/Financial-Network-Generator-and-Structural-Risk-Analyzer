# Betweenness Centrality

Betweenness centrality measures the extent to which a specific node (bank) stands between other nodes in the network. Specifically, it calculates the **fraction of all shortest paths** in the network that pass through a given node.

Mathematically, for a node $v$:
$$C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$$
Where $\sigma_{st}$ is the total number of shortest paths from node $s$ to node $t$, and $\sigma_{st}(v)$ is the number of those paths that pass through $v$.

## Why Does It Matter in Financial Networks?
* A bank with **high betweenness centrality** acts as a crucial financial bridge between different clusters of banks (e.g., connecting regional banks to international core institutions).
* Even if that bank does not hold the most capital, its collapse cuts off the shortest communication and lending paths between other major market players, forcing transactions to take longer, riskier, or more expensive alternate routes.


## Simple Example: The Bridge Bank

Consider a 4-bank network:
* **Cluster A:** Bank 0 and Bank 1 trade heavily with each other.
* **Cluster B:** Bank 2 and Bank 3 trade heavily with each other.
* **The Bridge:** Bank 1 and Bank 2 are connected by a single interbank loan. 

If money needs to flow from Cluster A to Cluster B, **every single path must pass through Bank 1 or Bank 2**. Consequently, Bank 1 and Bank 2 will have a very **high betweenness centrality score**, making them systemic choke points in the network.