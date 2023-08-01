import { Request, Response } from "express";
import { Socket } from 'socket.io';
import socketIO from 'socket.io';

import Notificaciones from "../Router-notificaciones/notificaciones";


export const disconnect = (client: Socket) =>{
  client.on('disconnect', () =>{
    console.log('Cliente desconectado');
  })
}


export const notifications = (client: Socket, io:socketIO.Server ) =>{
  client.on('notification', (payload:any)=>{
    console.log('en el server ',payload);
    Notificaciones.insertNotifications(payload);
    
    //emite al cliente la notificacon
    io.emit('new-notification', payload);
  })
}
