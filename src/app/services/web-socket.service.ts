import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
    private socket: Socket
  ) { }

  medicoConnect(userId: any,roleName:string) {
    this.socket.emit('medicoConnect', { userId,roleName });
  }

  sendStatusChange(status: string) {
    this.socket.emit('statusChange', { status });
  }

  onStatusUpdate() {
    return this.socket.fromEvent('statusUpdate');
  }

  notifyLogout(userId: any) {
    this.socket.emit('tabLogout', { userId });
  }

}
