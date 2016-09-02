import { BrowserModule  } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// App component
import { AppComponent } from "./app.component";

// Shared components
import { ComponentsModule } from "../components/components.module";

// Shared pipes
import { PipesModule } from "../pipes/pipes.module";

// Shared services
import { ServicesModule } from "../services/services.module";

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ComponentsModule,
        PipesModule,
        ServicesModule
    ],
    providers: [
        ServicesModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
