import admin from "firebase-admin";

import ws from "ws";

import { readdirSync } from "fs";

import { EventEmitter } from "events";

import { Collection } from "@discordjs/collection";

import Client from "../client/Client";

import { NotificationData, User, Event } from "../Types";

import { WithId } from "mongodb";

import Route from "../Structures/Route";

admin.initializeApp({
    credential: admin.credential.cert(require("../../service.json")),
});

export default class Socket extends EventEmitter {
    routes: Collection<string, Route>

    socket: ws;

    name: string;

    client: Client;

    events: Collection<string, Event>
    constructor(client: Client) {
        super();

        this.client = client;

        this.name = 'api';

        this.routes = new Collection();

        this.events = new Collection();

        this.socket = new ws(`wss://vps.paulo-valadares.com`)
    }

    async start(): Promise<void> {

        this.client.API = this;

        if (this.socket.readyState === ws.CLOSED) this.socket = new ws(`wss://vps.paulo-valadares.com`);

        this.laodEvents();

        this.events.forEach(event => {
            this.socket.on(event.name, (...args) => event.run(...args))
        })
    }

    async laodEvents() {
        const modules = readdirSync('dist/Socket/Events');

        this.events = new Collection();

        for (const file of modules) {
            const module = require(`./Events/${file}`);

            this.client.log(`[SOCKET EVENTS] - Evento de socket ${file} carregado`, { color: 'yellow' });

            const m = new module.default(this.client, this.socket) as Event;

            this.events.set(m.name, m);
        }
    };

    async postNotification({ user, title, body, data }: {
        user: WithId<User> | User,
        title: string,
        body: string,
        data?: NotificationData
    }): Promise<any> {
        if (process.env.DEV) return;

        user.user = user.user.toLowerCase();

        const dbUSER = await this.client.mongo.db("EMAKE").collection("users").findOne({ user: user.user })

        if (!dbUSER) return console.log("AUHSDUHASUDH", user);

        if (!dbUSER.postToken) return console.log("YEAYSYEDSYADY", user)

        const message = {
            notification: {
                title,
                body,
            },
            token: dbUSER.postToken,
            data: data
        } as admin.messaging.Message;

        return admin.messaging().send(message)
            .then(() => {
                this.client.log(`Mensagem enviada com sucesso para ${dbUSER.user}`, { tags: ['NOTIFICAÇÕES'], color: 'yellow' });
            })
            .catch(() => {
                this.client.log(`Não foi possível enviar mensagem para ${dbUSER.user}: ${message.notification?.body}`, { tags: ['NOTIFICAÇÕES'], color: 'red' });

            });
    }
}