import ws from "ws";
import Client from "../../client/Client";

export default class MesageEvent {
    client: Client;
    name: string
    socket: ws;
    constructor(client: Client, socket: ws) {
        this.client = client

        this.name = 'message'

        this.socket = socket;
    }

    async run(message: ws.Data): Promise<any> {
        const msg = JSON.parse(message.toString());

        if (msg.type === 'data') {
            this.client.log(`Recebeu dados do socket`, { tags: ['SOCKET'], color: 'magenta' });

            for (const data of msg.data) {
                const action = data.action;

                switch (action) {
                    case 'CREATE':
                        this.client.log(`Usuário ${data.data.user} adicionado ao cluster.`, { tags: ['SOCKET'], color: 'cyan' });

                        this.client.users.set(data.data.user, data.data);
                        break;

                    case 'REMOVE':
                        this.client.log(`Usuário ${data.data.user} removido do cluster.`, { tags: ['SOCKET'], color: 'red' });

                        this.client.users.delete(data.data.user);
                        break;
                }
            }
        } else if (msg.type === 'auth') {
            setTimeout(() => {
                this.socket.send(JSON.stringify({
                    type: 'ping',
                }))
            }, 60000)
        } else if (msg.type === 'ping') {

        } else {
            console.log(msg);
        }
    }
}