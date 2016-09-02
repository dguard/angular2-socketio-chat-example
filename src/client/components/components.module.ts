import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

// Shared pipes
import { PipesModule } from "../pipes/pipes.module";

// Sharec components
import { ControlComponent } from "./control";
import { NicknameComponent } from "./nickname";
import { RoomComponent } from "./room";
import { RoomsComponent } from "./rooms";

const COMPONENTS: any[] = [
    ControlComponent,
    NicknameComponent,
    RoomComponent,
    RoomsComponent
];

import { RoomService } from "../services/room.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PipesModule
    ],
    declarations: [
        ...COMPONENTS
    ],
    providers: [
        RoomService
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class ComponentsModule {}