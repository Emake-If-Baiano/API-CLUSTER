import ws from "ws";
import Client from "../../client/Client";

export default class CloseEvent {
    client: Client;
    name: string;

    socket: ws;
    constructor(client: Client, socket: ws) {
        this.client = client

        this.name = 'close'

        this.socket = socket;
    }

    async run(args: any): Promise<any> {
        console.log(args)
        this.client.log(`Desconectado do Núcleo Central. Tentando conexão novamente em 30s...`, { tags: ['SOCKET'], color: 'red' });

        setTimeout(() => {
            this.client.log(`Reestrabelecendo conexão com o núcleo central.`, { tags: ['SOCKET'], color: 'magenta' });

            this.client.API.start()
        }, 30000)
    }
}