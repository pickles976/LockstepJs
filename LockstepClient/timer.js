const MS = 250

export class TurnManager {

    constructor(callback) {
        this.turn_num = 0
        this.target_time = MS
        this.server_epoch = 0;
        this.prev_time = 0;
        this.turnCallback = callback
    }

    async startLoop(server_time, latency, offset) {
    
        // Convert server epoch into local timeframe
        this.server_epoch = server_time - latency - offset
    
        // ms since epoch start
        let elapsed = Date.now() - this.server_epoch
    
        // num turns and how long to sleep for
        this.turn_num = Math.floor(elapsed / MS)
        this.target_time = MS - (elapsed % MS)
        
        // begin turn loop
        this.prev_time = performance.now()
        setTimeout(() => {this.turn()}, this.target_time)
    
    }

    turn() {

        // do stuff, bring in the commands and execute them
        // calculate how long it took to do the stuff
        this.turnCallback(this.turn_num)
    
        let elapsed = performance.now() - this.prev_time
        let error = this.target_time - elapsed
        this.prev_time = performance.now()
        this.turn_num++
        this.target_time = MS - error
    
        setTimeout(() => {this.turn()}, this.target_time)
    }
}