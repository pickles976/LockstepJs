const MS = 250
let target_time = MS
let turn_num = 0

let server_epoch = 0
let prev_time = 0

export function startLoop(server_time, latency, offset) {
    
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

    // do stuff
    // calculate how long it took to do the stuff
    document.getElementById("step").innerText = `${turn_num}`;

    let elapsed = performance.now() - prev_time
    let error = target_time - elapsed
    prev_time = performance.now()
    turn_num++
    target_time = MS - error
    console.log(target_time)
    setTimeout(turn, target_time)
}

// 0
// sleep for 250

// actually slept for 240

// do thing

// error 10

// 1
// sleep for 260

// actually slept for 250

// do thing

// error 10

// 2
// sleep for 260

// actually slept for 270

// do thing

// error -10

// 3
// sleep for 240

// const stepStart = performance.now();
// // DO GAME LOGIC
// let elapsed = performance.now() - frameStart;
// setTimeout(() => {}, (MS - elapsed))