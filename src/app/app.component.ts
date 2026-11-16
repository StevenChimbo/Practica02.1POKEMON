import { Component } from '@angular/core';
import { BatallaComponent } from './batalla/batalla.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BatallaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'simulador-batallas';
}
