class Packet {

    constructor (type, data) {
        this.type = type
        this.data = data
        // log time
    }

}

// "TREQ" request current time
// "TRES" response containing current time
// "STRT" start turn loop
// "SUCC" successfully did what the server expected 

// "CMND" in-game command buffer
// "MSSG" print a message

// "CKSM" checksum of current game state
// "STOP" stop turn loop and just chill
// "SYNC" synchronize entire game state
// "FAIL" failed to do whatever the server expected
// "EROR" 
