My attempt at implementing a lockstep RTS multiplayer networking solution in js. Using the famous paper [here](https://zoo.cs.yale.edu/classes/cs538/readings/papers/terrano_1500arch.pdf) as reference, as well as [this](https://www.amazon.com/Multiplayer-Game-Programming-Architecting-Networked/dp/0134034309) great book on the subject.

TODO:

- [x] Keep track of connected clients
- [ ] Get latency and offset information from clients
- [ ] Test synchronization logic
- [ ] Synchronize client timers
- [ ] Create a step system
- [ ] Figure out how to deal with drift
- [ ] Create standardized commands
- [ ] Synchronize commands
- [ ] Basic visualization in Canvas or WebGL
