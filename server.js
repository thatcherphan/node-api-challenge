const express = require("express");
const helmet = require("helmet");

const actionRouter = require("./Routes/actionRouter");
const projectRouter = require("./Routes/projectRouter");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);

server.use("/action", actionRouter);
server.use("/project", projectRouter);

server.get('/', (req, res) => {
    const messageOfTheDay = process.env.MOTD;
    res.send({motd: messageOfTheDay, message: "this server is alive!"});
})

//Middleware
function logger(req, res, next) {
    console.log(`${req.method}, ${req.url}, [${new Date().toISOString()}]}`);
  //isostring
    next();
  }

module.exports = server;