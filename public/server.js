const net = require("net");
const { send } = require("process");

const server = net.createServer();
const serverPort = 5151;

const connections = new Map();

const sendMessage = (message, origin) => {
    for (const socket of connections.keys()) {
        if (socket !== origin) {
            socket.write(message);
        }
    }
};

server.listen(serverPort, () => {
    console.log("Server listen at port: ", server.address().port);

    server.on("connection", (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
        socket.setEncoding('utf-8')


        socket.on("data", (data) => {
            if ( !connections.has(socket)) {
                let isRegistered =false;
                connections.forEach((nickname) => {
                    if (nickname == data && nickname===data) {
                        socket.write('The name that you are trying to use is occupied, try to use other name. \nChoose your username: ');
                        isRegistered=true;
                    }
                });

                if(!isRegistered) {
                    connections.set(socket, data);
                    // console.log(remoteSocket)
                    console.log( "Welcome to the chat ", data);
                    socket.write('Connection');
                }

            }else {
                 console.log(`[${connections.get(socket)}]: ${data}`);

                const fullMessage = `[${connections.get(socket)}]: ${data}`;
                // console.log(`${remoteSocket} -> ${fullMessage}`);

                // console.log(`${fullMessage}`)
                sendMessage(fullMessage, socket);

            }

        });

        socket.on("error", (err) => {
            console.error(err.message);
            process.exit(1);
        });

        socket.on("close", () => {
            console.log(connections.get(socket)," exits the chat ");
            connections.delete(socket);
        });
    });

});