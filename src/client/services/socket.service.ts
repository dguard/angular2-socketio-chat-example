import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";

import { IMessage, ISocketItem } from "../../models";

@Injectable()
export class SocketService {
    private name: string;
    private host: string = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
    socket: SocketIOClient.Socket;

    constructor() {}

    get(name: string): Observable<any> {
        this.name = name;
        let socketUrl = this.host + "/" + this.name;
        this.socket = io.connect(socketUrl);
        this.socket.on("connect", () => this.connect());
        this.socket.on("disconnect", () => this.disconnect());
        this.socket.on("error", (error: string) => {
            console.log(`ERROR: "${error}" (${socketUrl})`);
        });

        // Return observable which follows "create" and "remove" signals from socket stream
        return Observable.create((observer: any) => {
            this.socket.on("create", (item: any) => observer.next({ action: "create", item: item }) );
            this.socket.on("remove", (item: any) => observer.next({ action: "remove", item: item }) );
            return () => this.socket.close();
        });
    }

    create(name: string) {
        this.socket.emit("create", name);
    }

    remove(name: string) {
        this.socket.emit("remove", name);
    }

    private connect() {
        console.log(`Connected to "${this.name}"`);

        // Request initial list when connected
        this.socket.emit("list");
    }

    private disconnect() {
        console.log(`Disconnected from "${this.name}"`);
    }
}
