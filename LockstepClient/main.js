const exampleSocket = new WebSocket("ws://127.0.0.1:8080");

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
      console.log(Date.now());
      exampleSocket.send(Date.now(), { binary: false})
      break;
    default:
      console.log("Unrecognized packet type");
  }
}