import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DuplexChannelService } from './common/duplex-channel.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClientApp';

  constructor(private serverChannel: DuplexChannelService) {}

  ngOnInit() {
    this.serverChannel.ensureConnect();
  }
}
