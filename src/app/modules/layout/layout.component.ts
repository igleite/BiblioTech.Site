import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import packageJson from '../../../../package.json';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  public appJson: any = packageJson;

}
