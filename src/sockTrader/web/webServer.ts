import cors from "cors";
import express, {Express, NextFunction, Request, Response} from "express";
import {Server} from "http";

import path from "path";
import backtestController from "./controllers/backtest";
import dataController from "./controllers/data";
import strategyController from "./controllers/strategy";
// import socketIO from "socket.io";

const app: Express = express();
const http = new Server(app);
// const io = socketIO(http);

http.listen(80);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    const file = path.resolve(__dirname, "../../../src/sockTrader/web/index.html");
    res.sendFile(file);
});

app.use("/data", dataController);
app.use("/backtest", backtestController);
app.use("/strategy", strategyController);

app.use((err: any, req: Request, res: Response, next: NextFunction) => next(res.status(err.output.statusCode).json(err.output.payload)));

// io.on("connection", socket => {
//     console.log("new connection");
//
//     socket.emit("news", {hello: "world"});
//     socket.on("my other event", data => {
//         console.log(data);
//     });
// });
// io.on("disconnect", (reason: any) => {
//     console.log(reason);
// });
