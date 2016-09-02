import { NgModule } from "@angular/core";

import { DatePipe } from "./date.pipe";
import { OrderByPipe } from "./order-by.pipe";

export const PIPES = [
    DatePipe,
    OrderByPipe
]

@NgModule({
    declarations: [
        ...PIPES
    ],
    exports: [
        ...PIPES
    ]
})
export class PipesModule {}
