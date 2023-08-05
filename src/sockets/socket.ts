import { Request, Response } from "express";
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import * as reminder from '../models/reminder-notification.model';


import Notificaciones from "../Router-notificaciones/notificaciones";


export const disconnect = (client: Socket) =>{
  client.on('disconnect', () =>{
    console.log('Cliente desconectado');
  })
}


export const notifications = (client: Socket, io:socketIO.Server ) =>{
  client.on('notification', (payload:any)=>{
    //Guarda la notificación en la BD
    Notificaciones.insertNotifications(payload);
    
    //emite al cliente la notificación
    io.emit('new-notification', payload);
  })
}


export const reminderNotification = (hoy:any, io:socketIO.Server) =>{

  if(reminder.typeNotificationReminder(hoy) == null) return
  
  //Guarda la notificación en la BD
  Notificaciones.insertNotifications(reminder.typeNotificationReminder(hoy));
  //emite al cliente la notificación
  io.emit('new-reminder', reminder.typeNotificationReminder(hoy));
    
}