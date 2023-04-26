import { json, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

import MySQL from '../mysql/mysql';
import RouterValida from '../router/router.validators';
import JsonWebToken from '../helpers/jwt';
import Enviroments from '../enviroments/enviroments';
const routValida = new RouterValida();

export default class Usuarios {

  constructor() {}

  //Método para insertar usuarios
  public static insertUsuarios = async(req: Request, res: Response) =>{

    await routValida.validarUsuario(req.body.email, (err:any, data:any ) =>{
      if(data){
        return res.status(400).send({ 
          ok: false, 
          msg: 'El usuario con este correo electrónico ya está registrado'
        }); 
      }

      if ( err ) {
        if ( err == 'No hay registros.' ) {
          
          //Encriptar contraseña
          const salt = bcrypt.genSaltSync();
          const password = bcrypt.hashSync( req.body.password, salt );
          
          const query = `
          INSERT INTO usuarios 
          (nombre_us, email_us, password_us, telefono_us, direccion_us, estado_us, genero_us, admin_us, fechareg_us )
          VALUES ( '${req.body.nombre}', '${req.body.email}', '${password}', '${req.body.telefono}', '${req.body.direccion}', 1, '${req.body.genero}', 'N', CURRENT_TIMESTAMP() )`;
          
          MySQL.ejecutarQuery( query, (err:any, result: Object[]) =>{
            if ( err ) {
              return res.status(400).send({
                ok: false,
                error: err,
                query 
              });
              
            } 
  
            res.status(200).send({
              ok: true,
              msg: 'Usuario registrado con éxito.',
              result
            })
  
          });
  
        } else {
          return res.status(400).send({
            ok: false,
            msg: 'Problema al crear el usuario.',
            err
          })
        }
      }
    })

  }


  //Método para login de usuario
  public static loginUser = async(req: Request, res: Response) =>{
    const { email, password } = req.body;
    const queryUs = `SELECT * FROM usuarios WHERE email_us = '${email}'`;
    try {
      MySQL.ejecutarQuery( queryUs, async(err:any, result:any) =>{
        if ( err ) {
          if ( err == 'No hay registros.' ) {
            return res.status(400).send({
              ok: false,
              err,
              msg: 'E-mail y/o password incorrectos.'
            })
          } else {
            return res.status(400).send({
              ok: false,
              err,
              msg: 'Error en la consulta de usuario. Intente más tarde.'
            })
          }
        } else {
          const passUser = bcrypt.compareSync( password,  result[0].password_us);
          if ( !passUser ) {
            return res.status(400).send({
              ok: false,
              err: 'Password incorrecto.',
              msg: 'E-mail y/o password son incorrectos.'
            })
          } else if( result[0].estado_us === 0 ){
            return res.status(400).send({
              ok: false,
              err: 'Acceso denegado.',
              msg: 'Su cuenta esta bloqueada. comuníquese con el administrador.'
            })
          } else {
            //Generar un token - JWT
            const token = await JsonWebToken.generarJWT( result[0].id_us, result[0].email_us );
            return res.status(200).send({
              ok: true,
              err,
              msg: 'Login correcto!',
              token
            })
          }
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en login... Revisar logs',
        error
      });
    }
  }


  //Método para obtener todos los clientes
  public static getAllClientes = (req: Request, res: Response) =>{
    const query2 = `SELECT * FROM usuarios WHERE id_us NOT IN (1)`;
    const query = `SELECT * FROM usuarios `;
    MySQL.ejecutarQuery( query, (err:any, usuarios: Object[]) =>{
      if ( err ) {
        return res.status(400).send({
          ok: false,
          error: err
        });
      } else {
        return res.status(200).send({
          ok: true,
          usuarios
        })
      }
    })
  }


  //Método para obtener usuario por id
  public static getUsuario = (req: Request, res: Response) =>{
    try {
      const escapeId = MySQL.instance.cnn.escape(req.params.id);
      const query = `
                  SELECT *
                  FROM usuarios
                  WHERE id_us = ${escapeId}`;
      MySQL.ejecutarQuery( query, (err:any, usuario: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener el usuario. Inténtelo más tarde.',
            error: err
          });
        } else {
          return res.status(200).send({
            ok: true,
            usuario
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



  //Método para atualizar el cliente 
  public static actualizarCliente = (req: Request, res: Response) =>{
    try {
      const query = `
                  UPDATE usuarios
                  SET nombre_us    = '${req.body.nombre}', 
                      email_us     = '${req.body.email}', 
                      telefono_us  = '${req.body.telefono}', 
                      direccion_us = '${req.body.direccion}', 
                      estado_us    = ${req.body.estado}
                  WHERE id_us = ${req.body.idUs} `;
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
            msg: 'No es posible actualizar el cliente. Verifica los datos.',
            error: err
          });
        } else {
          return res.status(200).send({
            ok: true,
            msg: 'Cliente actualizado con éxito.',
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


  //Método para atualizar el cliente 
  public static actualizarUsuario = (req: Request, res: Response) =>{
    try {
      const query = `
                  UPDATE usuarios
                  SET nombre_us    = '${req.body.nombre}',  
                      direccion_us = '${req.body.direccion}', 
                      telefono_us  = '${req.body.telefono}', 
                      avatar_us    = '${req.body.avatar}'
                  WHERE id_us = ${req.body.id} `;
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
            msg: 'No es posible actualizar el usuario. Verifica los datos.',
            error: err
          });
        } else {
          return res.status(200).send({
            ok: true,
            msg: 'Usuario actualizado con éxito.',
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


  //Método para actualizar la contraaseña
  public static updatePassword = (req: Request, res: Response) => {
    const process = new Enviroments();
    let data:any = jwt.verify(req.body.token, process.JWT_SECRET);
    data = data.id[0];
    try {
      //Encriptar contraseña
      const salt = bcrypt.genSaltSync();
      const password = bcrypt.hashSync( req.body.confirmPass, salt );
      const query = `
                  UPDATE usuarios
                  SET password_us = '${password}' 
                  WHERE email_us = '${data.email_us}' AND id_us = ${data.id_us} `;
      MySQL.ejecutarQuery(query, (err:any, result:any) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            error: err
          });
        } 
        if ( result.affectedRows == 0 ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible actualizar la contraseña.',
            error: err
          });
        } else {
          return res.status(200).send({
            ok: true,
            msg: 'Contraseña actualizada con éxito.',
            result
          });
        }
      })
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en actualizar... Revisar logs',
        error
      });
    }    
  }


}