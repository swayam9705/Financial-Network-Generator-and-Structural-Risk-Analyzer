Imagine a small town where four friends—**Alice, Bob, Charlie, and David**—are all running local shops and have borrowed money from one another.

* Alice owes Bob $₹100$.
* Bob owes Charlie $₹100$.
* Charlie owes David $₹100$.
* David owes Alice $₹100$.

It forms a perfect financial circle. On a normal day, everyone collects their money, pays their debts, and everything is fine.

### The Problem: The Shock

Suddenly, a crisis hits: **Alice loses $₹50$ of her cash reserves** (an external shock).

Now, when Bob comes knocking for his $₹100$, Alice can only give him $₹50$. Because Bob expected $₹100$, he suddenly comes up short when he tries to pay Charlie. Charlie, in turn, comes up short when paying David, and David comes up short when paying Alice.

**The big question is:** In a complex web where everyone owes everyone else, who actually ends up paying whom, and who goes bankrupt? That is what the **Eisenberg-Noe model** solves.

---

### The Three Simple Rules of the Model

The Eisenberg-Noe model figures this out using three common-sense rules:

#### 1. You Can't Give What You Don't Have (and You Don't Pay Extra)

* A bank's payment is strictly limited by its total cash (its safe cash + what it actually manages to collect from its debtors).
* At the same time, a bank will never pay *more* than its original promise (if it owes $₹100$, it doesn't randomly pay $₹120$).

#### 2. The Rule of Fair Sharing (Proportional Sharing)

What happens if a bank is half-bankrupt? Let's say Bob only received $₹50$ from Alice, but he owes a total of $₹200$ split equally between Charlie ($₹100$) and David ($₹100$).

* Bob can't pay everyone in full.
* Under the Eisenberg-Noe **proportional sharing rule**, Bob must share his limited cash **fairly and proportionally** based on how much he owes each person. Since he owes them equal amounts, he gives $₹25$ to Charlie and $₹25$ to David.

#### 3. The Guessing Game (The Fixed-Point Loop)

Because Bob's payment depends on Alice's payment, and Charlie's payment depends on Bob's, how do we find the final numbers?

The model uses a **loop (an iterative guessing game)**:

1. **First guess:** Everyone pretends everything is fine and acts like they will pay 100% of their debts.
2. **First check:** We calculate how much cash people actually receive based on that guess. Oh wait—some people came up short!
3. **Update:** We adjust the payments downward based on who came up short and the fair-sharing rule.
4. **Repeat:** We plug these new lower payments back into the equations and run it again.

We keep running this loop over and over. Eventually, the numbers **stop changing**—they lock into place.

### Why It's Always Gauranteed to Work

Martin Eisenberg and Larry Noe proved mathematically that this loop **will never get stuck**. It is mathematically guaranteed to find a single, stable resting point (called the **clearing vector**). Once the loop stops, you instantly know:

* Which banks survived.
* Which banks defaulted.
* Exactly how much money flowed through the entire network during the crisis.

---

#### External Resources
* Youtube Video by The Margin Call: [Link](https://www.youtube.com/watch?v=fawRyIks3T8)