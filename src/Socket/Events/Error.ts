import ws from "ws";
import Client from "../../client/Client";

export default class ErrorEvent {
    client: Client;
    name: string
    socket: ws;
    constructor(client: Client, socket: ws) {
        this.client = client

        this.name = 'error'

        this.socket = socket;
    }

    async run(message: ws.Data): Promise<any> {
        this.client.log(`Erro no socket: ${message}`, { tags: ['SOCKET'], color: 'red' });
    }
}