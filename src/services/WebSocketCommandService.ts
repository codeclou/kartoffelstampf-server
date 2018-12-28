/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import { spawn } from 'child_process';
import { Server } from 'http';
import * as url from 'url';
import * as winston from 'winston';
import * as WebSocket from 'ws';
import { IServerOptions, Server as WsServer } from 'ws';
import { CommandInstruction } from '../data/CommandInstruction';

class WebSocketCommandService {

  private wss: WsServer;

  constructor(httpServer: Server) {
    const options: IServerOptions = {
      server: httpServer,
    };
    this.wss = new WsServer(options);
    this.init();
  }

  private init() {
    const self = this;
    self.wss.on('connection', (ws: WebSocket) => {
      const location = url.parse(ws.upgradeReq.url, true);
      ws.on('message', (message) => {
        winston.log('debug', 'received command instruction', message);
        const commandInstruction = JSON.parse(message);
        self.dispatchCommandWithWebsocketResponse(ws, commandInstruction);
      });
    });
  }

  private dispatchCommandWithWebsocketResponse(ws: WebSocket, commandInstruction: CommandInstruction) {
    const cmd = spawn(commandInstruction.command, commandInstruction.commandArguments);
    cmd.on('error', (error: any) => {
      try {
        ws.send(JSON.stringify({
          payload: {
            text: error.toString(),
          },
          type: 'stderr',
        }));
      } catch (error) {
        winston.log('debug', 'failed to send ws', error);
      }
    });
    cmd.stdout.on('data', (data: any) => {
      try {
        ws.send(JSON.stringify({
          payload: {
            text: data.toString(),
          },
          type: 'stdout',
        }));
      } catch (error) {
        winston.log('debug', 'failed to send ws', error);
      }
    });
    cmd.stderr.on('data', (data: any) => {
      try {
        ws.send(JSON.stringify({
          payload: {
            text: data.toString(),
          },
          type: 'stderr',
        }));
      } catch (error) {
        winston.log('debug', 'failed to send ws', error);
      }
    });
    cmd.on('exit', (code: Number) => {
      try {
        ws.send(JSON.stringify({
          payload: {
            exitCode: code.toString(),
            text: 'child process exited with code ' + code.toString(),
          },
          type: 'processStatus',
        }));
      } catch (error) {
        winston.log('debug', 'failed to send ws', error);
      }
    });
  }
}
export default WebSocketCommandService;
