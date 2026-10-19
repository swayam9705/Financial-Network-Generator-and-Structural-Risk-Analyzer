"""
In financial networks, when a bank fails or experience a liquidity shortage, it
cannot fulfill its debth obligations to other banks. This creates a domino effect:
Bank A fails -> Bank B doesn't get paid -> Bank B fails. Calculating who survives
and who collapses requires solving a system of non-linear equations known as
Eisenberg-Noe Clearing Mechanism, which is solved using fixed-point iteration and
linear algebra.
"""

import numpy as np

class EisenbergNoeClearing:
    """
    Implements Eisenberg-Noe clearning vector fixed-point algorithm using linear
    algebra and iterative contraction mapping in numpy 
    """

    def __init__(self, L, external_assets):
        """
        - L: array of shape (N, N) representing the liability matrix (L[i][j] is
            then amount bank i owes to bank j)

        - external_assets: array of shape (N,) representing external cash reserves
            of each bank
        """

        self.L = L
        self.e = external_assets
        self.N = L.shape[0]

        # Total nominal liabilities of each bank.
        # This is the total amount of money bank i promised to pay out to all
        # it's creditors.
        self.p_bar = np.sum(L, axis=1)

        # Constructs the relative liabilities matrix Pi (diagonal matrix)
        # If a bank cannot pay it's total debts, it must distribute whatever
        # cash it has proportionally to all it's creditors based on how much it
        # owes them.
        self.Pi = np.zeros((self.N, self.N))
        for i in range(self.N):
            if self.p_bar[i] > 0:
                self.Pi[i, i] = 1.0 / self.p_bar[i]


    def solve_clearing_vector(self, max_iter=1000, tol=1e-6):

        p = np.copy(self.p_bar)

        for iteration in range(max_iter):
            # `@` is the matrix multiplication operator
            # L.T @ (Pi @ p) calculates the interbank payments received by each bank
            # - Pi @ p gives the fraction of obligation actually paid out by each bank.
            # - L.T multiplies this fractions by the debt exposure weights
            interbank_receipts = self.L.T @ (self.Pi @ p)

            cash_available = self.e + interbank_receipts

            p_new = np.minimum(cash_available, self.p_bar)

            if np.linalg.norm(p_new - p, ord=np.inf) < tol:
                return p_new

            p = p_new

        print("fixed-point iteration reached max_iter without convergence")
        return p

    def get_defaulted_banks(self, p):
        """Identifies banks that defauled (paid less than their normal obligation)"""

        defaults = np.where(p < self.p_bar - 1e-5)[0]
        return defaults

    

