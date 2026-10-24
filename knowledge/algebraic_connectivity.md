# Algebraic Connectivity (The Fiedler Value)

Algebraic connectivity—also known as the **Fiedler value**—is a metric that measures how tightly bound, and resilient a network is to fragmentation or node failures. 

Mathematically, it is defined as the **second smallest eigenvalue** of the **Graph Laplacian Matrix** ($L_{lap} = D - A$). 

## Why Does It Matter in Financial Networks?
* **High Algebraic Connectivity:** Means the banking network has multiple redundant pathways. If one bank defaults, liquidity and credit can reroute easily through other channels without causing a systemic freeze.
* **Low Algebraic Connectivity (Close to 0):** Means the network has "bottlenecks" or is close to splitting into isolated sub-graphs. A single failure in a bottleneck node can instantly fracture the entire financial system.

---

## Simple Example: Line Graph vs. Complete Graph

Imagine two banking systems with 3 banks ($N=3$):

1. **The Fragile System (Line Graph):** Bank 0 is connected to Bank 1, and Bank 1 is connected to Bank 2. (Bank 1 is a single point of failure).
   * Laplacian eigenvalues: $\lambda = [0, 1, 3]$
   * **Algebraic Connectivity (Fiedler Value):** $1$ (Low robustness).

2. **The Robust System (Complete Graph):** Every bank lends directly to every other bank (Triangle structure).
   * Laplacian eigenvalues: $\lambda = [0, 3, 3]$
   * **Algebraic Connectivity (Fiedler Value):** $3$ (High robustness; removing any single bank leaves the other two directly connected).