import { IMessage, Message } from "../../models";

export class MessageSocket {
    : any;
    name: string;
    data: any;
    socket: any;

    constructor(request: any, private room: string) {
        this.nsp = io.of("/messages/" + encodeURIComponent(this.room));

        this.nsp.on("connection", (socket: any) => {
            console.log("Client connected to room:", this.room);
            this.socket = socket;
            this.listen();
        });
    }

    private listen(): void {
        this.socket.on("disconnect", () => this.disconnect());
        this.socket.on("create", (message: IMessage) => this.create(message));
        this.socket.on("list", () => this.list());
    }

    private disconnect(): void {
        console.log("Client disconnected from room:", this.room);
    }

    private create(message: IMessage): void {
        Message.create(message, (error: any, message: IMessage) => {
            if (!error && message) {
                this.nsp.emit("create", message);
            }
        });
    }

    private list(): void {
        if (this.socket && this.socket.connected) {
            Message
                .find({ room: this.room }) // Find messages only on this room
                .sort({ created: -1 }) // Sort newest messages first
                .limit(25) // Limit to 25 first results
                .exec( 
                    (error: any, messages: IMessage[]) => {
                        for (let message of messages.reverse()) {
                            this.socket.emit("create", message);
                        }
                    }
                );
        }
    }
}