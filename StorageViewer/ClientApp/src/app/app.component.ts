import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';

import { DuplexChannelService } from './common/duplex-channel.service';
import { routeSlideAnimation } from './animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeSlideAnimation]
})
export class AppComponent {
  title = 'ClientApp';

  constructor(private serverChannel: DuplexChannelService, private routerContexts: ChildrenOutletContexts) {}

  ngOnInit() {
    this.serverChannel.ensureConnect();
  }

  getRouteAnimationData() {
    return this.routerContexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
