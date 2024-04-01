import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    imports: [
        RouterLink
    ],
    standalone: true
})
export class NotFoundComponent implements OnInit {
    constructor() {
    }

    ngOnInit(): void {
    }

}
