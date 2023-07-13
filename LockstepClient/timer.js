const MS = 250
let target_time = MS
export let turn_num = 0

let server_epoch = 0
let prev_time = 0

export async function startLoop(server_time, latency, offset) {
    
    // Convert server epoch into local timeframe
    server_epoch = server_time - latency - offset

    // ms since epoch start
    let elapsed = Date.now() - server_epoch

    // num turns and how long to sleep for
    turn_num = Math.floor(elapsed / MS)
    target_time = MS - (elapsed % MS)
    
    // begin turn loop
    prev_time = performance.now()
    setTimeout(turn, target_time)

}

async function turn() {

    // do stuff, bring in the commands and execute them
    // calculate how long it took to do the stuff
    document.getElementById("step").innerText = `${turn_num}`;

    let elapsed = performance.now() - prev_time
    let error = target_time - elapsed
    prev_time = performance.now()
    turn_num++
    target_time = MS - error
    // console.log(target_time)
    setTimeout(turn, target_time)
}