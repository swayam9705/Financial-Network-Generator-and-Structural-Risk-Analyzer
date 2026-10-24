# Eisenberg-Noe Clearing Mechanism Example

Let's look at an example to understand how eisenberg-noe clearing mechanism works.

### Step 1: Defininng a Network

Before defining a network, let's understand few concepts.

* **External Assets(e)**: Cash reserves or external income that the bank has independent of the network flow.
* **Interbank Liability(L)**: Liability refers to the amount a particular banks owes to another bank.

Let's assign those values.

* External Assets
    * $e_1=2$
    * $e_2=0$
    * $e_3=0$

* Interbank Liabilites: ($L_{ij}$ indicates the amount bank $i$ owes to bank $j$):
    * Bank 1 owes Bank 2: $L_{12} = 15$ (Total liability of Bank 1: $\bar{p}_1 = 15$)
    * Bank 2 owes Bank 3: $L_{23} = 10$ (Total liability of Bank 2: $\bar{p}_2 = 10$)
    * Bank 3 owes Bank 1: $L_{31} = 5$ (Total liability of Bank 3: $\bar{p}_3 = 5$)

    Therefore, the liabilities can be represented in the form of Matrix

    $$
    L = \begin{bmatrix}
    0 & 15 & 0 \\
    0 & 0 & 10 \\
    5 & 0 & 0
    \end{bmatrix}
    $$

### The Relative Liabilities Matrix $(\Pi)$

The matrix $\Pi$ tracks what fraction of a bank's total debt is owed to each specific other bank
$\Pi_{ij} = \frac{L_{ij}}{\bar{p}_i}$
* $\Pi_{12} = \frac{15}{15} = 1.0$ (Bank 1 owes 100% of its debt to Bank 2)
* $\Pi_{23} = \frac{10}{10} = 1.0$ (Bank 2 owes 100% of its debt to Bank 3)
* $\Pi_{31} = \frac{5}{5} = 1.0$ (Bank 3 owes 100% of its debt to Bank 1)

Relative Liability Matrix
$$
\Pi = \begin{bmatrix}
0 & 1 & 0 \\
0 & 0 & 1 \\
1 & 0 & 0
\end{bmatrix}
$$

### Step 2: The Eisenberg-Noe Clearing Equation

The core of the Eisenberg-Noe framework states that the actual payment made by each bank, denoted as vector $p=(p_1, p_2, p_3)$, must satisfy the fixed-point equation.
$$p_i=\min(\bar{p_i}, e_i + \Sigma_{j=1}^{n}\Pi_{ji}p_j)$$

In simpler terms, it means a bank either pays its full liability $(\bar{p_i})$ or all the cash it actually has available (its external assets plus incoming payments from other banks), whichever is smaller.
For our three banks, this expands into:
* $p_1 = \min(15, 2 + 1 \cdot p_3)$
* $p_2 = \min(10, 0 + 1 \cdot p_1)$
* $p_3 = \min(5, 0 + 1 \cdot p_2)$

### Step 3: Solving for the Clearing Vetcor
We use the iterative process to find clearing payment that everyone pays in full: $p^{(0)}=(15, 10, 5)$

#### Iteration 1:
* Bank 1: $p_1^{(1)} = \min(15, 2 + p_3) = \min(15, 2 + 5) = \mathbf{7}$(Bank 1 only receives 5 from Bank 3. With its own $e_1 = 2$, it has 7 total cash. Since 7 is less than its liability of 15, Bank 1 defaults and pays only 7.)
* Bank 2: $p_2^{(1)} = \min(10, p_1) = \min(10, 7) = \mathbf{7}$(Bank 2 receives 7 from Bank 1. Since 7 is less than its liability of 10, Bank 2 also defaults and pays 7.)
* Bank 3: $p_3^{(1)} = \min(5, p_2) = \min(5, 7) = \mathbf{5}$(Bank 3 receives 7 from Bank 2. Its liability is only 5. Therefore, Bank 3 has enough cash to pay its full liability of 5.)

#### Iteration 2 (Stability Check):
If we plug $p^{(1)} = (7, 7, 5)$ back into the equations:
* $p_1 = \min(15, 2 + 5) = 7$
* $p_2 = \min(10, 7) = 7$
* $p_3 = \min(5, 7) = 5$
The values no longer change. We have reached a fixed point.

### Step 4: Economic Takeaway

The vector $p=(7, 7, 5)$ is the Eisenberg-Noe clearing payment vector for this financial network:
* Bank 1 defaulted, paying $7$ out of its $15$ obligation.
* Bank 2 defaulted, paying $7$ out of its $10$ obligation.
* Bank 3 survived and paid its full $5$ obligation.

Even though only Bank 1 started with low cash ($e_1=2$), the shortfall propagated sequentially through the network $(1 -> 2 -> 3)$, demonstrating how the Eisenberg-Noe framework mathematically demonstrates systemic contagion while preserving proportional priority rules.