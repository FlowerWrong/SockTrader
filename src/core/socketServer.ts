import http, {Server} from "http";
import {IMessage, IServerConfig, server as WebSocketServer} from "websocket";

export default class SocketServer extends WebSocketServer {

    server: Server;

    constructor() {

        // Node fork child process
        // https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node

        const server = http.createServer((request, response) => {
            console.log((new Date()) + " Received request for " + request.url);
            response.writeHead(404);
            response.end();
        });

        const config: IServerConfig = {httpServer: server};
        super(config);

        this.server = server;
    }

    start() {
        console.log("start called!");
        // setImmediate();
        this.server.listen(8080, () => {
            console.log((new Date()) + " SERVER IS LISTENING ON PORT 8080");
        });

        this.on("request", request => {
            // if (!originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                // request.reject();
                // console.log((new Date()) + " Connection from origin " + request.origin + " rejected.");
                // return;
            // }

            const connection = request.accept("echo-protocol", request.origin);
            console.log((new Date()) + " Connection accepted.");
            connection.on("message", (message: IMessage) => {
                if (message.type === "utf8" && message.utf8Data !== undefined) {
                    console.log("Received Message: " + message.utf8Data);
                    connection.sendUTF(message.utf8Data);
                } else if (message.type === "binary" && message.binaryData !== undefined) {
                    console.log("Received Binary Message of " + message.binaryData.length + " bytes");
                    connection.sendBytes(message.binaryData);
                }
            });
            connection.on("close", (reasonCode, description) => {
                console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
            });
        });
    }
}
