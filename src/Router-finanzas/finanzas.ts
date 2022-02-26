import { Request, Response } from 'express';
import bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

import MySQL from '../mysql/mysql';
import RouterValida from '../router/router.validators';
import JsonWebToken from '../helpers/jwt';
const routValida = new RouterValida();


export default class Finanzas {

  constructor() {}


  //Método para insertar ingresos
  public static insertIngresos = (req: Request, res: Response) =>{

    try {
      let idIngreso = uuidv4();
      idIngreso = idIngreso.split('-'); 

      const query = `
                      INSERT INTO ingresos 
                      ( id_ingre, id_fina, id_us, valor_ingre, comentario_ingre, fecha_ingre )
                      VALUES ( '${idIngreso[0]}', ${req.body.idFina}, ${req.body.idUs}, ${req.body.valor}, '${req.body.comentario}', CURRENT_TIMESTAMP() )`;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: 'Problema al crear el ingreso.',
            err: query
          });

        }
        return res.status(200).send({
          ok: true,
          msg: 'Ingreso creado con éxito.',
          idIngreso: idIngreso[0],
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




  //Método para insertar egresos
  public static insertEgreso = (req: Request, res: Response) =>{

    try {
      let idEgreso = uuidv4();
      idEgreso = idEgreso.split('-'); 

      const query = `
                      INSERT INTO egresos 
                      ( id_egre, id_fina, id_us, valor_egre, comentario_egre, fecha_egre )
                      VALUES ( '${idEgreso[0]}', ${req.body.idFina}, ${req.body.idUs}, ${req.body.valor}, '${req.body.comentario}', CURRENT_TIMESTAMP() )`;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: 'Problema al crear el egreso.',
            err: query
          });

        }
        return res.status(200).send({
          ok: true,
          msg: 'Egreso creado con éxito.',
          idEgreso: idEgreso[0],
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





  //Método para obtener las finanzas por usuario
  public static getFinanzasById = (req: Request, res: Response) =>{

    try {

      const escapeIdUs = MySQL.instance.cnn.escape(req.params.idUs);

      const query = `
                    SELECT T0.*, T1.nombre_us, T1.email_us, T1.telefono_us, T1.estado_us, T1.admin_us
                    FROM finanzas AS T0 INNER JOIN usuarios AS T1 ON T0.id_us = T1.id_us
                    WHERE T0.id_us = ${escapeIdUs}`;

      MySQL.ejecutarQuery( query, (err:any, finanzas: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener las finanzas. Inténtelo más tarde.',
            error: err
          });

        } else {
          return res.status(200).send({
            ok: true,
            finanzas
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



  //Método para obtener las finanzas por usuario
  public static getIngresosById = (req: Request, res: Response) =>{

    try {

      const escapeIdUs = MySQL.instance.cnn.escape(req.params.idUs);

      const query = `
                    SELECT *
                    FROM ingresos
                    WHERE id_us = ${escapeIdUs}`;

      MySQL.ejecutarQuery( query, (err:any, ingresos: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener los ingresos. Inténtelo más tarde.',
            error: err
          });

        } else {
          return res.status(200).send({
            ok: true,
            ingresos
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




  //Método para obtener los egresos por usuario
  public static getEgresosById = (req: Request, res: Response) =>{

    try {

      const escapeIdUs = MySQL.instance.cnn.escape(req.params.idUs);

      const query = `
                    SELECT *
                    FROM egresos
                    WHERE id_us = ${escapeIdUs}`;

      MySQL.ejecutarQuery( query, (err:any, egresos: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener los egresos. Inténtelo más tarde.',
            error: err
          });

        } else {
          return res.status(200).send({
            ok: true,
            egresos
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





}