import { Request, Response } from 'express';
import bcrypt = require('bcryptjs');
import MySQL from '../mysql/mysql';
import RouterValida from '../router/router.validators';
const { v4: uuidv4 } = require('uuid');


export default class Notificaciones {

  constructor(){}

  //Método para insertar notificaciones
  public static insertNotifications = (payload:any) =>{
    try {
      const query = `
            INSERT INTO notificaciones 
            ( id_noti, id_admin, titulo_noti, descrip_noti, tipo_noti, nombre_us, fecha_noti )
            VALUES ( '${payload.id}', ${payload.idAdmin}, '${payload.titulo}', '${payload.desp}', '${payload.tipo}', '${payload.nombre}', '${payload.fecha}' ) `;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        console.log(result);
        return
      });
    } catch (error) {
      console.log(error);
      return 
    }
  }


  //Método para obtener todas las notificaciones
  public static getAllNotifications = (req: Request, res: Response) =>{
    try {
      const query = `SELECT * FROM notificaciones WHERE id_admin = ${req.params.idAdmin}`;
      MySQL.ejecutarQuery(query, (err: any, notificaciones: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            notificaciones
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en la petición... Revisar logs",
        error,
      });
    }
  }


  //Método para eliminar las notificaciones por id
  public static deleteNotifications = (req: Request, res: Response) =>{
    try {
      let query = '';
      const escapeId = MySQL.instance.cnn.escape(req.params.id);
      if (req.params.opt == 'one') {
        query = `DELETE FROM notificaciones WHERE id_noti = ${escapeId}`;
      } else {
        query = `DELETE FROM notificaciones WHERE id_admin = ${escapeId}`;
      }

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: `No es posible eliminar la notificación. Inténtelo más tarde.`,
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            msg: `La notificación fue eliminada con éxito.`,
            result,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en eliminación... Revisar logs",
        error,
      });
    }
  }

}