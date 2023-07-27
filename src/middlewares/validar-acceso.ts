import { Request, Response } from 'express';
import MySQL from '../mysql/mysql';


export default class MiddlewareAcceso {

  public validarAcceso = (req: Request, res: Response, next:any) =>{
    const query = `SELECT * FROM usuarios WHERE email_us = '${req.body.email}' AND permiso_acceso = 'Y'`;

    MySQL.ejecutarQuery(query, (err:any, result:any) =>{
      if(err){
        if ( err == 'No hay registros.' ){
          return res.status(400).send({
            ok: false,
            err,
            msg: 'El usuario aun no tiene acceso a la plataforma.'
          })
        } else {
          return res.status(400).send({
            ok: false,
            err,
            msg: 'Error en la consulta de usuario. Intente más tarde.'
          })
        }
      } else {
        next();
      }
    })
  }
  
}