import { Request, Response } from "express";
import express  from 'express';
import socketIO from 'socket.io';
import  http  from "http";
import * as socket from '../sockets/socket';


export default class Server {

  private static _instance: Server;
  
  public app: express.Application;
  public port: Number | undefined;
  public io: socketIO.Server;
  public res?:Response ;
  private httpServer: http.Server;


  private constructor( puerto: Number ){
    this.port = puerto;
    this.app = express();
    this.httpServer = new http.Server(this.app);
    this.io = (socketIO as any)( this.httpServer, {cors:{'Access-Control-Allow-Origin': '*'}} );

    this.listenSockets();
  }


  public static get instance() {
    return this._instance || ( this._instance = new this(Number(process.env.PORT) || 3000) )
  }


  private listenSockets() {
    this.io.on('connection', client =>{
      console.log('**Cliente conectado**');
      
      socket.notifications(client, this.io);

      socket.disconnect(client);
      
    })
    
  }


  static init(puerto:Number){
    return new Server( puerto );
  }


  start( callback: Function ){
    this.httpServer.listen( this.port, () =>{
      console.log(`Server corriendo en el puerto ${this.port}`);
    })
  }


}