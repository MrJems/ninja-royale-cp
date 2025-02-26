import io from "socket.io-client";
import {
  initNetwork,
  emitPlayerCreated,
  emitPlayerMove,
  emitPlayerAttacked,
  emitPlayerFiredStar,
} from "./services/networkServices";

export class Network {
  constructor(serverUrl) {
    this.socket = io(serverUrl);
  }

  init(onConnect, onCurrentPlayers) {
    initNetwork(this.socket, onConnect, onCurrentPlayers);
  }

  playerCreated(data) {
    emitPlayerCreated(this.socket, data);
  }

  playerMove(data) {
    emitPlayerMove(this.socket, data);
  }

  playerAttacked(data) {
    emitPlayerAttacked(this.socket, data);
  }

  playerFiredStar(data) {
    emitPlayerFiredStar(this.socket, data);
  }
}
