import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
    providedIn: 'root'
})
export class DuplexChannelService {
    private dataReceivedSource = new BehaviorSubject<any>({});
    dataReceived = this.dataReceivedSource.asObservable();
    private webSocketSubject?: WebSocketSubject<any>;
    private socketServerPath = '/wsTransport';

    connect() {
      this.disconnect();
      const wsProtocol = window.location.protocol.startsWith('https') ? 'wss' : 'ws';
      this.webSocketSubject = webSocket(`${wsProtocol}://${window.location.host}${this.socketServerPath}`);
      this.webSocketSubject.subscribe({
        next: (data) => this.consumeWebSocketInfo(data),
        error: err => console.log(`Some error is reported: [${JSON.stringify(err)}] or [${err}]]`),
        complete: () => console.log('WebSocket is closed')
      });
    }

    ensureConnect() {
        if (!this.webSocketSubject) {
            this.connect();
        }
    }
  
    disconnect() {
      this.webSocketSubject?.complete();
      this.webSocketSubject = undefined;
    }
    
    private consumeWebSocketInfo(info: any)
    {
      this.dataReceivedSource.next(info);
    }
  };