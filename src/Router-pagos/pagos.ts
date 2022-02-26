import { Request, Response } from 'express';
import bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

import MySQL from '../mysql/mysql';
import RouterValida from '../router/router.validators';
import JsonWebToken from '../helpers/jwt';
const routValida = new RouterValida();


export default class  Pagos {

  constructor(){}


  //Método para crear pagos
  public static crearPagos = (req: Request, res: Response) =>{

    try {
      let idPago = uuidv4();
      idPago = idPago.split('-');

      const query = `
                    INSERT INTO pagos 
                    ( id_pag, id_cred, id_us, valor_pag, fecha_pag, estado_pag, comentario_pag )
                    VALUES ( '${idPago[0]}', '${req.body.idCredito}', ${req.body.idUs}, ${req.body.valor}, '${req.body.fecha}', 1, '${req.body.comentario}' ) `;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: 'Problema al crear el pago.',
            err: query
          });

        }
        return res.status(200).send({
          ok: true,
          msg: 'Pago creado con éxito.',
          idCredito: idPago[0],
          result
        });

      });

      
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en inserción... Revisar logs',
        error
      }); 
    }

  }




  //Método para consultar los pagos por id crédito
  public static getAllPagos = (req: Request, res: Response) =>{

    try {

      const query = `
                    SELECT T0.nombre_us, T0.telefono_us, T0.email_us, T2.monto_cred, T2.plazo_cred, T2.estado_cred, T3.* 
                    FROM usuarios AS T0 INNER JOIN pagos AS T3 ON T0.id_us = T3.id_us
                    INNER JOIN creditos AS T2 ON T3.id_us = T2.id_us `;

      MySQL.ejecutarQuery( query, (err:any, pagos: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener los pagos. Inténtelo más tarde.',
            error: err
          });

        } else {
          return res.status(200).send({
            ok: true,
            pagos
          })
        }
      })
      
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en consulta... Revisar logs',
        error
      }); 
    }

  }




  //Método para consultar los pagos por id crédito
  public static getPagosById = (req: Request, res: Response) =>{

    try {

      const escapeIdCredito = MySQL.instance.cnn.escape(req.params.idCredito);

      const query = `
                    SELECT T0.nombre_us, T0.telefono_us, T0.email_us, T2.monto_cred, T2.plazo_cred, T2.estado_cred, T3.* 
                    FROM usuarios AS T0 INNER JOIN pagos AS T3 ON T0.id_us = T3.id_us
                    INNER JOIN creditos AS T2 ON T3.id_us = T2.id_us
                    WHERE T3.id_cred = ${escapeIdCredito} `;

      MySQL.ejecutarQuery( query, (err:any, pagos: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener los pagos. Inténtelo más tarde.',
            error: err
          });

        } else {
          return res.status(200).send({
            ok: true,
            pagos
          })
        }
      })
      
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en consulta... Revisar logs',
        error
      }); 
    }

  }


  //Método para actualizar el pago por ID
  public static updatePagosById = (req: Request, res: Response) =>{

    try {

      const query = `
                UPDATE pagos
                SET valor_pag = ${req.body.valor}, estado_pag = ${req.body.estado}, comentario_pag = '${req.body.comentario}'   
                WHERE id_pag = '${req.body.idPago}' `;

      MySQL.ejecutarQuery( query, (err:any, result:any) =>{

        if ( err ) {
          return res.status(400).send({
            ok: false,
            error: err
          });

        } 

        if ( result.affectedRows == 0 ) {

          return res.status(400).send({
            ok: false,
            msg: 'No es posible actualizar el pago. Inténtelo más tarde.',
            error: err
          });
          
        } else {
          return res.status(200).send({
            ok: true,
            msg: 'Pago actualizado con éxito.',
            result
          });
        }

      });
      
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en actualizar... Revisar logs',
        error
      }); 
    }

  }


}