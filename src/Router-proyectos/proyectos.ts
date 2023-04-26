import { Request, Response } from 'express';
import bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

import MySQL from '../mysql/mysql';
import RouterValida from '../router/router.validators';

export default class Proyectos {

  constructor(){}


  //Método para obtener los proyectos
  public static getProjects = (req: Request, res: Response) =>{
    try {
      const query = `
                    SELECT *
                    FROM proyectos`;

      MySQL.ejecutarQuery(query, (err:any, projects: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: 'No es posible obtener los proyectos. Inténtelo más tarde.',
            error: err
          });
        } else {
          return res.status(200).send({
            ok: true,
            projects
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


  //Método para insertar proyectos
  public static insertProjects = (req: Request, res: Response) =>{
    try {
      let idProject = uuidv4().split('-')[0];
      const query = `
                      INSERT INTO proyectos
                      (
                        id, 
                        nombre, 
                        descripcion, 
                        imagen, 
                        sitio, 
                        tipo,
                        skills
                      )
                      VALUES (
                        '${idProject}', 
                        '${req.body.nombre}', 
                        '${req.body.descripcion}', 
                        '${req.body.imagen}', 
                        '${req.body.sitio}', 
                        '${req.body.tipo}',
                        '${req.body.skills}'
                      )`;
      MySQL.ejecutarQuery(query, (err: any, result: Object[]) =>{
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: 'Problema al crear el proyecto.',
            err: query
          });
        }
        return res.status(200).send({
          ok: true,
          msg: 'Proyecto creado con éxito.',
          idProject,
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


  //Método para insertar proyectos
  public static putProjects = (req: Request, res: Response) =>{
    const query = `
                UPDATE proyectos
                SET nombre      = '${req.body.nombre}', 
                    descripcion = '${req.body.descripcion}', 
                    imagen      = '${req.body.imagen}', 
                    sitio       = '${req.body.sitio}',
                    tipo        = '${req.body.tipo}'
                WHERE id = '${req.body.id}'`;
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
          msg: 'No es posible actualizar el proyecto. Inténtelo más tarde.',
          error: err
        });
      } else {
        return res.status(200).send({
          ok: true,
          msg: 'Proyecto actualizado con éxito.',
          result
        });
      }
    });
  }


  //Método para eliminar proyectos
  public static deleteProject = (req: Request, res: Response) =>{
    try {
      const escapeId = MySQL.instance.cnn.escape(req.params.id);
      const query = `DELETE FROM proyectos WHERE id = ${escapeId}`;
  
      MySQL.ejecutarQuery( query, (err:any, result: Object[]) =>{
        if ( err ) {
          return res.status(400).send({
            ok: false,
            msg: `No es posible eliminar el proyecto. Inténtelo más tarde.`,
            error: err
          });
  
        } else {
          return res.status(200).send({
            ok: true,
            msg: `El proyecto fue eliminado con éxito.`,
            result
          })
        }
      })
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: 'Error inesperado en eliminación... Revisar logs',
        error
      }); 
    }
  }


}