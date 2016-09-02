import * as express from "express";
import * as http from "http";
import * as serveStatic from "serve-static";
import * as path from "path";
import * as mongoose from "mongoose";
import * as websocket from "websocket";

import { RoomSocket } from "./socket/room";

declare var process, __dirname;

class Server {
    public app: any;
    private server: any;
    private ws: any;
    private mongo: any;
    private root: string;
    private port: number;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        // Create expressjs application
        this.app = express();

        // Configure application
        this.config();

        // Setup routes
        this.routes();

        // Create server
        this.server = http.createServer(this.app);

        // Create database connections
        this.databases();

        // Handle websockets
        this.sockets();

        // Start listening
        this.listen();
    }

    private config(): void {
        // By default the port should be 5000
        this.port = process.env.PORT || 5000;

        // root path is under ../../target
        this.root = path.join(path.resolve(__dirname, '../../target'));

    }

    private routes(): void {
        let router: express.Router;
        router = express.Router();

        // Static assets
        this.app.use('/assets', serveStatic(path.resolve(this.root, 'assets')));

        // Set router to serve index.html (e.g. single page app)
        router.get('/', (request: express.Request, result: express.Response) => {
            result.sendFile(path.join(this.root, '/index.html'));
        });

        // Set app to use router as the default route
        this.app.use('*', router);
    }

    private databases(): void {
        // MongoDB URL
        let mongoDBUrl = process.env.MONGODB_URI || 'mongodb://localhost/chat';

        // Get MongoDB handle
        this.mongo = mongoose.connect(mongoDBUrl);
    }

    private sockets(): void {
        // Get socket.io handle
        this.ws = new websocket.server({
            httpServer: this.server,
            autoAcceptConnections: false
        });
        let roomSocket = new RoomSocket(this.ws);
    }
    
    private listen(): void {
        //listen on provided ports
        this.server.listen(this.port);

        //add error handler
        this.server.on("error", error => {
            console.log("ERROR", error);
        });

        //start listening on port
        this.server.on("listening", () => {
            console.log('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', this.port, this.port);            
        });

    }
}

// Bootstrap the server
let server = Server.bootstrap();
export = server.app;