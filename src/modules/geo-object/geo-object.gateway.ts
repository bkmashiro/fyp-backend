import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class GeoObjectGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('message', payload);
    return 'Hello world!';
  }
}
