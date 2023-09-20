import ws from "ws";
import Client from "../../client/Client";

export default class OpenEvent {
    client: Client;
    name: string
    socket: ws;
    constructor(client: Client, socket: ws) {
        this.client = client

        this.name = 'open'

        this.socket = socket;
    }

    async run(): Promise<any> {
        this.client.log(`Conectado ao socket`, { tags: ['SOCKET'], color: 'yellow' });

        this.socket.send(JSON.stringify({
            type: 'AUTH',
            data: {
                token: process.env.SOCKET_AUTH
            },
            identifier: process.env.identifier
        }))
    }
}