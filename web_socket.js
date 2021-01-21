// ==============================
// Import libraries
const http = require("http");
const url = require("url");
const socket_io = require("socket.io");

// ==============================
// Define start values
const clients = [];
var values = [];
const interval = 2000;
const prices_offset_percent = 20;

// ==============================
// HTTP part
const server_listener = (req, resp) => {
  var pathname = url.parse(req.url).pathname;
  if (pathname === "/init" && req.method === "POST") {
    req.on("data", function(data) {
      try {
        values = JSON.parse(data.toString());
        console.log("Recieved items: " + values.length);
      } catch (e) {}
    });
  }

  resp.end("success");
};

const server = http.createServer(server_listener);

// ==============================
// SOCKET part
const changeRandomValue = () => {
  if (values.length > 0) {
    const index = Math.floor(Math.random() * values.length);
    const offset_percent = Math.floor(
      Math.random() * prices_offset_percent - prices_offset_percent / 2
    );
    const fields = ["ask", "bid", "last", "low", "high"];

    for (var i = 0, len = fields.length; i < len; i++) {
      const field = fields[i];

      values[index][field] =
        values[index][field] * 1 +
        values[index][field] * (offset_percent / 100);
    }

    sendToClients(values[index]);
  }
};
const sendToClients = new_value => {
  for (var i = 0, len = clients.length; i < len; i++) {
    clients[i].emit("ticker", new_value);
  }
};
const io = socket_io(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", client => {
  clients.push(client);
});

setInterval(changeRandomValue, interval);

server.listen(9001);
