/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import { spawn } from 'child_process';
import { Server } from 'http';
import * as url from 'url';
import * as WebSocket from 'ws';
import { IServerOptions, Server as WsServer } from 'ws';
import { CommandInstruction } from '../data/CommandInstruction';
import { CompressInstruction } from '../data/CompressInstruction';
import { logger } from './LogService';
import { UploadFileHelper } from './UploadFileHelper';

export class WebSocketCommandService {

  private wss: WsServer;

  private compressCommandInstruction(compressInstruction: CompressInstruction): CommandInstruction {
    const instruction = new CommandInstruction();
    if (!UploadFileHelper.isValidTemporaryFileName(compressInstruction.temporaryFileName)) {
      throw Error('Invalid temporaryFileName');
    }
    const fullTemporaryFileNamePath = UploadFileHelper.getFullTemporaryFilePath(compressInstruction.temporaryFileName);
    if (compressInstruction.temporaryFileName.endsWith('.png') &&
        compressInstruction.compressType === CompressInstruction.COMPRESS_TYPE_LOSSLESS) {
      instruction.command = 'optipng';
      instruction.commandArguments.push('-o5');
      instruction.commandArguments.push(fullTemporaryFileNamePath);
      return instruction;
    } else if (compressInstruction.temporaryFileName.endsWith('.jpg') &&
               compressInstruction.compressType === CompressInstruction.COMPRESS_TYPE_LOSSLESS) {
      instruction.command = 'jpegoptim';
      instruction.commandArguments.push('-m80');
      instruction.commandArguments.push(fullTemporaryFileNamePath);
      return instruction;
    } else {
      throw Error('Invalid compressType');
    }
  }

  constructor(httpServer: Server) {
    const options: IServerOptions = {
      server: httpServer,
    };
    this.wss = new WsServer(options);
    logger.log('info', 'init logging');
    this.init();
  }

  private init() {
    const self = this;
    self.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: any) => {
        logger.log('debug', 'received command instruction', message);
        // Interpret which command to execute => Prevent XSS Injects!
        const compressInstruction = JSON.parse(message) as CompressInstruction;
        const commandInstruction = this.compressCommandInstruction(compressInstruction);
        self.dispatchCommandWithWebsocketResponse(ws, commandInstruction, compressInstruction);
      });
    });
  }

  private dispatchCommandWithWebsocketResponse(
    ws: WebSocket,
    commandInstruction: CommandInstruction,
    compressInstruction: CompressInstruction) {
    const cmd = spawn(commandInstruction.command, commandInstruction.commandArguments);
    ws.send(JSON.stringify({
      payload: {
        text: commandInstruction.command + ' ' + commandInstruction.commandArguments.join(' '),
      },
      compressInstruction: compressInstruction,
      type: 'cmd',
    }));
    cmd.on('error', (error: any) => {
      try {
        ws.send(JSON.stringify({
          payload: {
            text: error.toString(),
          },
          compressInstruction: compressInstruction,
          type: 'stderr',
        }));
      } catch (error) {
        logger.log('error', 'failed to send ws', error);
      }
    });
    cmd.stdout.on('data', (data: any) => {
      try {
        ws.send(JSON.stringify({
          payload: {
            text: data.toString(),
          },
          compressInstruction: compressInstruction,
          type: 'stdout',
        }));
      } catch (error) {
        logger.log('error', 'failed to send ws', error);
      }
    });
    cmd.stderr.on('data', (data: any) => {
      try {
        ws.send(JSON.stringify({
          payload: {
            text: data.toString(),
          },
          compressInstruction: compressInstruction,
          type: 'stderr',
        }));
      } catch (error) {
        logger.log('error', 'failed to send ws', error);
      }
    });
    cmd.on('exit', (code: Number) => {
      try {
        const sizeInBytes = UploadFileHelper.getTemporaryFileSizeInBytes(compressInstruction.temporaryFileName);
        ws.send(JSON.stringify({
          payload: {
            compressedSize: sizeInBytes,
          },
          compressInstruction: compressInstruction,
          type: 'compressResult',
        }));
        // We unsubscribe on DONE in Frontend
        ws.send(JSON.stringify({
          payload: { },
          compressInstruction: compressInstruction,
          type: 'DONE',
        }));
      } catch (error) {
        logger.log('error', 'failed to send ws', error);
      }
    });
  }
}
