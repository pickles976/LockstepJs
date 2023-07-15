import { TurnManager } from "./timer.js";
import seedrandom from "seedrandom";

// Seed PRNG
seedrandom(1234, { global: true })

const exampleSocket = new WebSocket("ws://127.0.0.1:8080");
const tm = new TurnManager(turnCallback);

// const LATENCY = 20
const LATENCY = Math.random() * 50
document.getElementById("latency").innerText = LATENCY

let commandsToSend = []
let commandBuffers = {}

exampleSocket.onmessage = (event) => {
  readPacket(JSON.parse(event.data))
};

// TODO: each case needs to be its own function
function readPacket(packet) {
  switch(packet.type) {
    case "MSSG": 
      console.log(packet.data);
      document.getElementById("clients").innerText = JSON.stringify(packet.data);
      break;
    case "TREQ":
      // simulate latency
      // TODO: TRES packet
      sleep(LATENCY).then(() => {
        let timestamp = Date.now()
        sleep(LATENCY).then(() => {
          exampleSocket.send(JSON.stringify({type: "TRES", data: {time: timestamp}}), { binary: false})
        })
      })
      break;
    case "STRT":
      console.log("Syncing turn loop to server time");
      console.log(packet.data)
      let latency = parseFloat(packet.data.latency);
      let offset = parseFloat(packet.data.offset);
      let epoch = parseFloat(packet.data.epoch);
      tm.startLoop(epoch, latency, offset).then(() => {
        exampleSocket.send(JSON.stringify({ type : "SUCC" }), {binary: false})
      })
      break;
    case "CMND":
      if (packet.turn in commandBuffers) {
        commandBuffers[packet.turn] = commandBuffers[packet.turn].concat(packet.commands)
      } else {
        commandBuffers[packet.turn] = packet.commands
      }
      break;
    default:
      console.log("Unrecognized packet type");
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function storeCommand(command) {
  commandsToSend.push({ data: command })
}

function sendCommandBuffer() {
  if (commandsToSend.length > 0) {
    exampleSocket.send(JSON.stringify({ type : "CMND", commands: commandsToSend, turn: tm.turn_num + 2 }), {binary: false})
    commandsToSend = [] 
  }
}

function processCommandsForTurn(turn) {

  // let commands = commandBuffer.filter((command) => command.turn == turn);
  let commands = commandBuffers[turn] ?? []
  console.log(commands)
  commands.forEach((command) => {
    let node = document.createElement('li');
    node.appendChild(document.createTextNode(`${JSON.stringify(command)} ${turn}`));
    document.getElementById('messages').appendChild(node);
  })
}

function turnCallback(turn_num) {
  processCommandsForTurn(turn_num)
  sendCommandBuffer()
  document.getElementById("step").innerText = `${turn_num}`;
}

document.getElementById("command1").addEventListener("click", () => { storeCommand("command 1")});
document.getElementById("command2").addEventListener("click", () => { storeCommand("command 2")});
