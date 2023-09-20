export abstract class Event {
    client: any;

    name: string;

    constructor(client: any, name: string) {
        this.client = client;

        this.name = name;
    }

    abstract run(...args: any[]): Promise<any>;
}