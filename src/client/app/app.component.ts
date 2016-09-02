import { Component } from "@angular/core";

import { ControlComponent, NicknameComponent, RoomsComponent } from "../components";

import { UserService } from "../services";

declare var require;
const styles: string = require("./app.component.scss");
const template: string = require("./app.component.html");

@Component({
    selector: "app",
    styles: [styles],
    template
})

export class AppComponent {
    constructor(public userService: UserService) {}
}
