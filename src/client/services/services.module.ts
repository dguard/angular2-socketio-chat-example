import { NgModule, ModuleWithProviders } from "@angular/core";

import { SocketService } from "./socket.service";
import { UserService } from "./user.service";

@NgModule({
    providers: [
        SocketService,
        UserService
    ]
})
export class ServicesModule {}
