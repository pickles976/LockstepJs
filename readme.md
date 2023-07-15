# Lockstep.js

My attempt at implementing a lockstep RTS multiplayer networking solution in js. Using the famous paper [here](https://zoo.cs.yale.edu/classes/cs538/readings/papers/terrano_1500arch.pdf) as reference, as well as [this](https://www.amazon.com/Multiplayer-Game-Programming-Architecting-Networked/dp/0134034309) great book on the subject.

This is not supposed to be useful or even a good implementation. I just think it's a fun idea and also low-level projects like this help me get a better intuition for browser constraints and stuff.

Timers will go out of sync when tabs are running in the background. There is no way to fix this other than webworkers, which aren't supported. I think I will try to give the server the ability to adjust player's timers, but it is going to add a lot of complexity.

### TODO:

- [x] Keep track of connected clients
- [x] Get latency and offset information from clients
- [x] Test synchronization logic
- [x] Create dynamic client-side step counting system
- [x] Synchronize client timers
- [x] Create a step system
- [x] Make on "message" into one switch statement
- [x] Create timer syncing object for handshakes and whatnot

- [x] Create standardized commands
- [x] Create command buffer
- [x] Synchronize commands (dont execute buffer until timer reaches n steps)
- [x] Re-organize command buffer to not require filtering. 
- [ ] 
- [ ] Create object for packet sending
- [ ] Panic if command is out of date, hit server and tell clients to stop

- [ ] Add seeded prng
- [ ] Add basic gameobject that you can move around with clicking
- [ ] Basic visualization in Canvas or WebGL

- [ ] Re-sync clients if drift occurs
- [ ] ???

### Bugs
- [ ] Issue with client times
```
file:///F:/Users/Sebastian/Projects/LockstepJs/LockstepServer/synchronizer.js:39
        this.clientTimes[ws.id].time_0 = Date.now()
                                       ^

TypeError: Cannot set properties of undefined (setting 'time_0')
```

### Vulnerabilities
- [ ] Users can spoof other player's packets. A user could spoof someone else's commands and make them walk their army in circles or whatever. Easy to fix but requires lots of logic for clients to check that all incoming commands only affect units not belonging to the client 