#!/usr/bin/env node

/*!
 * Licensed under MIT License
 * Copyright (c) 2017 Bernhard Grünewaldt
 * https://github.com/codeclou/kartoffelstampf-server
 */
import * as http from 'http';
import { IExpressError } from './error/IExpressError';
import { Server } from './express.app';
import { logger } from './services/LogService';
import { WebSocketCommandService } from './services/WebSocketCommandService';

const onError = (error: IExpressError) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      logger.log('error', bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.log('error', ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const port = 9999;
const server = new Server(port);
const httpServer = http.createServer(server.getApp());
new WebSocketCommandService(httpServer);
httpServer.listen(port);
httpServer.on('error', onError);
