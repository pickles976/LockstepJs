My attempt at implementing a lockstep RTS multiplayer networking solution in js. Using the famous paper [here](https://zoo.cs.yale.edu/classes/cs538/readings/papers/terrano_1500arch.pdf) as reference, as well as [this](https://www.amazon.com/Multiplayer-Game-Programming-Architecting-Networked/dp/0134034309) great book on the subject.

Notes: This is not supposed to be useful or even a good implementation. I just think it's a fun idea and also low-level projects like this help me get a better intuition for browser constraints and stuff.

Timers will go out of sync when tabs are running in the background. There is no way to fix this other than webworkers, which aren't supported. I think I will try to give the server the ability to adjust player's timers

TODO:

- [x] Keep track of connected clients
- [x] Get latency and offset information from clients
- [x] Test synchronization logic
- [x] Create dynamic client-side step counting system
- [x] Synchronize client timers
- [x] Create a step system
- [ ] Add seeded prng
- [ ] Clean up code and control flow
- [ ] Create standardized commands
- [ ] Synchronize commands
- [ ] Basic visualization in Canvas or WebGL
- [ ] Do something if the game goes out of sync, kick the offending player etc
- [ ] Figure out how to deal with drift
