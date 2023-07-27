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
                    ( 
                      id_ingre, 
                      id_fina, 
                      id_us, 
                      valor_ingre, 
                      tipo_ingre, 
                      comentario_ingre, 
                      pago_credito_ingre, 
                      detalles_ingre, 
                      fecha_ingre 
                    )
                    VALUES 
                    ( 
                      '${idIngreso[0]}', 
                      ${req.body.idFina}, 
                      ${req.body.idUs}, 
                      ${req.body.valor}, 
                      '${req.body.tipo}', 
                      '${req.body.comentario}', 
                      ${req.body.pagoCredito}, 
                      '${req.body.detalles}', 
                      CURRENT_TIMESTAMP() 
                    )`;
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
                      ( 
                        id_egre, 
                        id_fina, 
                        id_us, 
                        valor_egre, 
                        tipo_egre,
                        comentario_egre, 
                        prestamo_egre,
                        detalles_egre, 
                        fecha_egre 
                      )
                      VALUES 
                      ( 
                        '${idEgreso[0]}', 
                        ${req.body.idFina}, 
                        ${req.body.idUs}, 
                        ${req.body.valor},
                        '${req.body.tipo}', 
                        '${req.body.comentario}', 
                        ${req.body.prestamo},
                        '${req.body.detalles}', 
                        CURRENT_TIMESTAMP() 
                      )`;
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
                    SELECT T0.*, T1.nombre_us, T1.email_us, T1.genero_us, T1.telefono_us, T1.estado_us, T1.admin_us, T1.avatar_us, T1.usuario_admin
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



  //Método para obtener los ingresos por usuario
  public static getIngresosById = (req: Request, res: Response) =>{
    try {
      const escapeIdUs = MySQL.instance.cnn.escape(req.params.idUs);
      const query = `
                  SELECT *
                  FROM ingresos
                  WHERE id_us = ${escapeIdUs} ORDER BY fecha_ingre DESC`;
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


  //Método para obtener ingreso por id
  public static getIngreso = (req: Request, res: Response) =>{
    try {
      const escapeId = MySQL.instance.cnn.escape(req.params.id);
      const query = `
                  SELECT *
                  FROM ingresos
                  WHERE id_ingre = ${escapeId}`;
      MySQL.ejecutarQuery( query, (err:any, ingreso: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener el ingreso. Inténtelo más tarde.',
            error: err
          });
        } else {
          return res.status(200).send({
            ok: true,
            ingreso
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


  //Método para obtener ingreso por id
  public static getEgreso = (req: Request, res: Response) =>{
    try {
      const escapeId = MySQL.instance.cnn.escape(req.params.id);
      const query = `
                  SELECT *
                  FROM egresos
                  WHERE id_egre = ${escapeId}`;
      MySQL.ejecutarQuery( query, (err:any, egreso: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener el egreso. Inténtelo más tarde.',
            error: err
          });
        } else {
          return res.status(200).send({
            ok: true,
            egreso
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


  //Método para actualizar los ingresos por usuario
  public static updateIngresosById = (req: Request, res: Response) =>{
    const query = `
                UPDATE ingresos
                SET valor_ingre        = ${req.body.valor}, 
                    comentario_ingre   = '${req.body.comentario}', 
                    pago_credito_ingre = ${req.body.pagoCredito}, 
                    fecha_ingre        = '${req.body.fecha}',
                    tipo_ingre         = '${req.body.tipo}',
                    detalles_ingre     = '${req.body.detalles}'
                WHERE id_ingre = '${req.body.idIngreso}' `;
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
          msg: 'No es posible actualizar el ingreso. Inténtelo más tarde.',
          error: err
        });
      } else {
        return res.status(200).send({
          ok: true,
          msg: 'Ingreso actualizado con éxito.',
          result
        });
      }
    });
  }


  //Método para actualizar los egresos por usuario
  public static updateEgresosById = (req: Request, res: Response) =>{
    const query = `
                UPDATE egresos
                SET valor_egre      = ${req.body.valor}, 
                    comentario_egre = '${req.body.comentario}', 
                    prestamo_egre   = ${req.body.prestamo}, 
                    fecha_egre      = '${req.body.fecha}',
                    tipo_egre       = '${req.body.tipo}',
                    detalles_egre   = '${req.body.detalles}'
                WHERE id_egre = '${req.body.idEgreso}' `;
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
          msg: 'No es posible actualizar el egreso. Inténtelo más tarde.',
          error: err
        });
      } else {
        return res.status(200).send({
          ok: true,
          msg: 'Egreso actualizado con éxito.',
          result
        });
      }
    });
  }






}