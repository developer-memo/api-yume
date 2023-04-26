import { Request, Response } from 'express';
import MySQL from '../mysql/mysql';


export default class MiddlewareEmail {

  public result: any;

  constructor(){}


  public validarEmail = (req: Request, res: Response, next:any) =>{

    const query = `SELECT * FROM usuarios WHERE email_us = '${req.body.email}'`;

    MySQL.ejecutarQuery(query, (err:any, result:any) =>{
      if(err){
        if ( err == 'No hay registros.' ){
          return res.status(400).send({
            ok: false,
            err,
            msg: 'El E-mail no se encuentra registrado.'
          })
        } else {
          return res.status(400).send({
            ok: false,
            err,
            msg: 'Error en la consulta de usuario. Intente más tarde.'
          })
        }
      } else {
        this.result = result;
        next();
      }
    })

  }


}