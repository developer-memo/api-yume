import { Request, Response } from 'express';
import bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

import MySQL from '../mysql/mysql';
import RouterValida from '../router/router.validators';
import JsonWebToken from '../helpers/jwt';
const routValida = new RouterValida();


export default class Creditos {

  constructor() {}

  
  //Método para insertar creditos
  public static insertCredito = (req: Request, res: Response) =>{

    try {
      let idCredito = uuidv4();
      idCredito = idCredito.split('-');

      const query = `
                      INSERT INTO creditos 
                      ( id_cred, id_us, monto_cred, fecha_cred, plazo_cred, valorcuota_cred, estado_cred, comentario_cred )
                      VALUES ( '${idCredito[0]}', ${req.body.idUs}, '${req.body.monto}', '${req.body.fecha}', ${req.body.plazo}, ${req.body.valorcuota}, 1, '${req.body.comentario}' ) `;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: 'Problema al crear el crédito.',
            err: query
          });

        }
        return res.status(200).send({
          ok: true,
          msg: 'Crédito creado con éxito.',
          idCredito: idCredito[0],
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



  //Método para obtener todos los créditos
  public static getAllCreditos = (req: Request, res: Response) =>{

    try {

      const query = ` SELECT T0.id_us, T0.nombre_us, T0.telefono_us, T1.*
                  FROM usuarios AS T0 INNER JOIN creditos AS T1 ON T0.id_us = T1.id_us `;

      MySQL.ejecutarQuery( query, (err:any, creditos: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener los créditos. Inténtelo más tarde.',
            error: err
          });

        } else {
          return res.status(200).send({
            ok: true,
            creditos
          })
        }
      })
      
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en obtener... Revisar logs',
        error
      });
    }

  }


  //Método para obtener crédito por id de cliente  
  public static getCreditoById = (req: Request, res: Response) =>{

    try {

      const escapeIdUs = MySQL.instance.cnn.escape(req.params.idUs);

      const query = ` SELECT T0.id_us, T0.nombre_us, T0.telefono_us, T1.*
                      FROM usuarios AS T0 INNER JOIN creditos AS T1 ON T0.id_us = T1.id_us
                      WHERE T1.id_us = ${escapeIdUs}`;

      MySQL.ejecutarQuery( query, (err:any, credito: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener el crédito. Inténtelo más tarde.',
            error: err
          });

        } else {
          return res.status(200).send({
            ok: true,
            credito
          })
        }
      })
      
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en obtener... Revisar logs',
        error
      });
    }

  }



  //Método para actualizar crédito por ID
  public static updateCreditoById = (req: Request, res: Response) =>{

    try {

      const query = `
                UPDATE creditos
                SET monto_cred = '${req.body.monto}', plazo_cred = ${req.body.plazo}, valorcuota_cred = ${req.body.valorcuota}, estado_cred = ${req.body.estado}, comentario_cred = '${req.body.comentario}'
                WHERE id_cred = '${req.body.idCredito}' `;

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
            msg: 'No es posible actualizar el crédito. Inténtelo más tarde.',
            error: err
          });
          
        } else {
          return res.status(200).send({
            ok: true,
            msg: 'Crédito actualizado con éxito.',
            result
          });
        }


      });
      
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en crédito... Revisar logs',
        error
      });
    }

  }




}