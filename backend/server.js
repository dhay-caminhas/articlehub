const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

function broadcast(data) {
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("Novo usuário conectado");

  let currentUser = null;

  ws.on("message", (data) => {
    const message = JSON.parse(data);

    if (message.type === "login") {
      currentUser = message.user;
      clients.push({ ws, user: currentUser });

      broadcast({ type: "system", text: `${currentUser} entrou no chat` });

      broadcast({
        type: "users",
        users: clients.map((c) => c.user),
      });

      return;
    }

    if (message.type === "message") {
      broadcast({
        type: "message",
        user: currentUser,
        text: message.text,
        time: new Date().toLocaleTimeString(),
      });
    }
  });

  ws.on("close", () => {
    if (currentUser) {
      clients = clients.filter((c) => c.user !== currentUser);
      broadcast({ type: "system", text: `${currentUser} saiu do chat` });
      broadcast({ type: "users", users: clients.map((c) => c.user) });
    }
  });
});

server.listen(3001, () => {
  console.log("WebSocket rodando em http://localhost:3001");
});
