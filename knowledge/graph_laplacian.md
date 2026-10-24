# The Graph Laplacian Matrix

The Graph Laplacian is a matrix representation of a graph that bridges **Graph Theory** and **Linear Algebra**. It combines information about both the connections (edges) and the number of connections each node has (degrees).

It is calculated as:
$$L_{lap} = D - A$$
Where:
* $D$ is the **Degree Matrix** (a diagonal matrix where each entry contains the total number of connections/liabilities of that bank).
* $A$ is the **Adjacency Matrix** (representing the weighted links between banks).

## Why Does It Matter in Financial Networks?
The Laplacian matrix acts as the mathematical backbone for advanced network analysis. By performing an **eigenvalue decomposition** on $L_{lap}$, you unlock:
1. **Algebraic Connectivity:** The second smallest eigenvalue (Fiedler value) tells you how easily the financial network can break apart.
2. **Spectral Clustering:** Eigenvectors of the Laplacian allow algorithms to automatically group banks into distinct risk clusters or core-periphery communities.


## Simple Example: A 2-Bank Network

Suppose Bank 0 and Bank 1 lend 100 units to each other.
* **Adjacency Matrix ($A$):**
  $$A = \begin{pmatrix} 0 & 100 \\ 100 & 0 \end{pmatrix}$$

* **Degree Matrix ($D$):** (Sum of rows of $A$)
  $$D = \begin{pmatrix} 100 & 0 \\ 0 & 100 \end{pmatrix}$$

* **Graph Laplacian ($L_{lap} = D - A$):**
  $$L_{lap} = \begin{pmatrix} 100 & -100 \\ -100 & 100 \end{pmatrix}$$

This matrix format allows Python libraries (like SciPy and NumPy) to instantly compute network-wide structural stability metrics using linear algebra operations.