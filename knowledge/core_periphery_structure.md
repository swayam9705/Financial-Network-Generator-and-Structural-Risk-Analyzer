# Core-Periphery Structure

A **core-periphery structure** is a structural configuration commonly observed in networks, socio-economic systems, and complex physical or spatial models. It describes a system divided into two main components with distinct structural roles and density of connections:

1. **The Core:** A tightly integrated, densely connected center.
2. **The Periphery:** A loosely connected, dispersed outer boundary.

---

## Network Theory Perspective

In network science, a core-periphery network consists of:
* **Core Nodes:** Highly connected to both other core nodes and peripheral nodes. They form a dense, cohesive subgraph.
* **Peripheral Nodes:** Sparsely connected. They rarely connect to other peripheral nodes and primarily interact with the network through core nodes.

```
       [Peripheral Node]
               |
    (Core)----(Core)---[Peripheral Node]
      |   \  /   |
    (Core)----(Core)
               |
       [Peripheral Node]
```

### Key Mathematical & Structural Metrics
* **Coreness Score:** Measures how central and interconnected a node is within the primary core relative to the network as a whole.
* **Blockmodels:** Adjacency matrix representations where the core-core matrix block has high density, core-periphery blocks have moderate density, and periphery-periphery blocks have near-zero density.

#### External Resources
* Wikipedia Article on Core-Periphery Structures: [LINK](https://en.wikipedia.org/wiki/Core%E2%80%93periphery_structure)
* Youtube video by Dr. Yayati: [LINK](https://www.youtube.com/watch?v=wzreq11YkKk)
* Medium Article on the "Core-Periphery-Model": [LINK](https://medium.com/@oleksandr.shemetov/the-core-periphery-model-b193662ae360)