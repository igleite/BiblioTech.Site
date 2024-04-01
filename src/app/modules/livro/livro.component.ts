import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-livro',
  standalone: true,
  templateUrl: './livro.component.html',
  styleUrl: './livro.component.scss',
  imports: [
    RouterOutlet
  ],
})
export class LivroComponent {

}
