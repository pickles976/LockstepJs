const exampleSocket = new WebSocket("ws://127.0.0.1:8080");

exampleSocket.onmessage = (event) => {
  console.log(event.data);
  document.getElementById("clients").innerText = event.data;
};

function addToList(listid, text) {
  let node = document.createElement('li');
  node.appendChild(document.createTextNode(text));
  document.getElementById(listid).appendChild(node);
}