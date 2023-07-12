import { startLoop } from "./timer";

const exampleSocket = new WebSocket("ws://127.0.0.1:8080");
// const LATENCY = 20
const LATENCY = Math.random() * 50
document.getElementById("latency").innerText = LATENCY

exampleSocket.onmessage = (event) => {
  readPacket(JSON.parse(event.data))
};

function readPacket(packet) {
  switch(packet.type) {
    case "MSSG": 
      console.log(packet.data);
      document.getElementById("clients").innerText = JSON.stringify(packet.data);
      break;
    case "TREQ":
      let time = Date.now()
      // simulate latency
      sleep(LATENCY).then(() => {
        time = Date.now()
        sleep(LATENCY).then(() => {
          exampleSocket.send(time, { binary: false})
        })
      })
      break;
    case "STRT":
      console.log("Syncing turn loop to server time");
      console.log(packet.data)
      let latency = parseFloat(packet.data.latency);
      let offset = parseFloat(packet.data.offset);
      let epoch = parseFloat(packet.data.epoch);
      startLoop(epoch, latency, offset)
      break;
    default:
      console.log("Unrecognized packet type");
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}