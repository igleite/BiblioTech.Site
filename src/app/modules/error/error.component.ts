import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class ErrorComponent implements OnInit {
    constructor() {
    }

    ngOnInit(): void {
    }

}
