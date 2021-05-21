const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// const db = require("./db/db");

process.title = "Kbd Warrior";
const port = process.env.port || 3000;

app.set("view engine", "html");
app.engine("html", require("hbs").__express);
app.set("views", __dirname + "/dist");

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

app.use(express.static("dist"));
app.use(express.static("src"));

const log = (ip, ...args) => {
  console.log(`[IP: ${ip}]: `, ...args);
};

let batch = {};

const incrementKey = (key) => {
  if (!Object.keys(batch).length) {
    batchKeys();
  }
  batch[key] = (batch[key] || 0) + 1;
};

const batchKeys = () => {
  setTimeout(() => {
    let key = null,
      keyCount = 0;

    for (let k in batch) {
      if (keyCount >= batch[k]) continue;

      key = k;
      keyCount = batch[k];
    }

    batch = {};
    io.emit("keypress", key, new Date().getTime());
  }, 100);
};

io.on("connection", async (socket) => {
  const ip = socket.conn.remoteAddress;
  log(ip, "A user connected.");

  socket.emit("client-connection", io.engine.clientsCount);

  socket.on("keypress", (key) => {
    log(ip, "Key pressed ", key);
    incrementKey(key);
  });

  socket.on("disconnect", function () {
    log(ip, "A user disconnected.");
    socket.broadcast.emit("client-connection", io.engine.clientsCount);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[${process.title}] App listening at http://localhost:${port}`);
});
