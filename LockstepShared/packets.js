class Packet {

    constructor (type, data) {
        this.type = type
        this.data = data
        // log time
    }

}

// "MSSG" print a message
// "TREQ" request current time
// "TRES" response containing current time
// "STRT" start turn loop
// "STOP" stop turn loop and just chill
// "CMND" commands in-game
// "SYNC" synchronize entire game state
// "SUCC" successfully did what the server expected 
// "FAIL" failed to do whatever the server expected
// "EROR" 
