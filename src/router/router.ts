import { Router, Request, Response } from "express";
import cron = require("node-cron");
import bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

import NodeMailer from "../nodemailer/config-nodemailer";
import MySQL from "../mysql/mysql";
import RouterValida from "./router.validators";
import JsonWebToken from "../helpers/jwt";
import MiddlewareJWT from "../middlewares/validar-jwt";
import MiddlewareEmail from "../middlewares/validar-email";
import FileUploads from "../uploads/upload";
import Usuarios from "../Router-Usuarios/usuarios";
import Creditos from "../Router-Creditos/creditos";
import Pagos from "../Router-pagos/pagos";
import Finanzas from "../Router-finanzas/finanzas";
import Proyectos from "../Router-proyectos/proyectos";

const routValida = new RouterValida();
const jwt = new JsonWebToken();
const middleware = new MiddlewareJWT();
const middlewareEmail = new MiddlewareEmail();

const router = Router();

/*************************************************************************************/
/*#region MÉTODOS POST  **************************************************************/

/**
 * Método POST para insertar usuario nuevo
 */
router.post(
  "/api/insertUsuario",
  middleware.validarJWT,
  async (req: Request, res: Response) => {
    //Usuarios.insertUsuarios(req, res)

    routValida.validarUsuario(req.body.email, (err: any, data: any) => {
      if (data) {
        return res.status(400).send({
          ok: false,
          msg: "El usuario con este correo electrónico ya está registrado",
        });
      }

      if (err) {
        if (err == "No hay registros.") {
          //Encriptar contraseña
          const salt = bcrypt.genSaltSync();
          const password = bcrypt.hashSync(req.body.password, salt);

          const query = `
        INSERT INTO usuarios 
        (nombre_us, email_us, password_us, telefono_us, direccion_us, estado_us, genero_us, admin_us, fechareg_us )
        VALUES ( '${req.body.nombre}', '${req.body.email}', '${password}', '${req.body.telefono}', '${req.body.direccion}', 1, '${req.body.genero}', 'N', CURRENT_TIMESTAMP() )`;

          MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
            if (err) {
              return res.status(400).send({
                ok: false,
                error: err,
                query,
              });
            }

            res.status(200).send({
              ok: true,
              msg: "Usuario registrado con éxito.",
              result,
            });
          });
        } else {
          return res.status(400).send({
            ok: false,
            msg: "Problema al crear el usuario.",
            err,
          });
        }
      }
    });
  }
);

/**
 * Método POST para insertar inversiones
 */
router.post(
  "/api/insertCredito",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Creditos.insertCredito(req, res);
  }
);

/**
 * Método POST para iniciar sesión
 */
router.post("/api/loginUser", (req: Request, res: Response) => {
  Usuarios.loginUser(req, res);
});

/**
 * Método POST para insertar pagos nuevos
 */
router.post(
  "/api/crearPago",
  middleware.validarJWT,
  async (req: Request, res: Response) => {
    //Pagos.crearPagos(req, res);
    try {
      let idPago = uuidv4();
      idPago = idPago.split("-");

      const query = `
                  INSERT INTO pagos 
                  ( id_pag, id_cred, id_us, valor_pag, fecha_pag, estado_pag, comentario_pag )
                  VALUES ( '${idPago[0]}', '${req.body.idCredito}', ${req.body.idUs}, ${req.body.valor}, '${req.body.fecha}', 1, '${req.body.comentario}' ) `;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: "Problema al crear el pago.",
            err: query,
          });
        }
        return res.status(200).send({
          ok: true,
          msg: "Pago creado con éxito.",
          idCredito: idPago[0],
          result,
        });
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en inserción... Revisar logs",
        error,
      });
    }
  }
);

/**
 * Método POST para insertar ingresos
 */
router.post(
  "/api/insertIngreso",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.insertIngresos(req, res);
  }
);

/**
 * Método POST para insertar egresos
 */
router.post(
  "/api/insertEgreso",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.insertEgreso(req, res);
  }
);

/**
 *Método POST que obtiene los ingresos por usuario y fecha
 */
router.post(
  "/api/filterFechasIngre",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    try {
      const query = `
                  SELECT *
                  FROM ingresos
                  WHERE id_us = ${req.body.idUs} AND fecha_ingre BETWEEN '${req.body.fechaInicio}' AND '${req.body.fechaFin}' 
                  ORDER BY fecha_ingre DESC`;

      MySQL.ejecutarQuery(query, (err: any, ingresos: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: "No es posible obtener los ingresos. Inténtelo más tarde.",
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            ingresos,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en obtener... Revisar logs",
        error,
      });
    }
  }
);

/**
 *Método POST que obtiene los egresos por usuario y fecha
 */
router.post(
  "/api/filterFechasEgre",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    try {
      const query = `
                  SELECT *
                  FROM egresos
                  WHERE id_us = ${req.body.idUs} AND fecha_egre BETWEEN '${req.body.fechaInicio}' AND '${req.body.fechaFin}' 
                  ORDER BY fecha_egre DESC`;

      MySQL.ejecutarQuery(query, (err: any, egresos: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: "No es posible obtener los ingresos. Inténtelo más tarde.",
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            egresos,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en obtener... Revisar logs",
        error,
      });
    }
  }
);

/**
 * Método POST para enviar correos
 */
router.post("/api/email", (req: Request, res: Response) => {
  const nodemailer = new NodeMailer(req.body);
  nodemailer.SendMailer(res);
});

/**
 * Método POST para insertar proyectos
 */
router.post(
  "/api/insertProject",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Proyectos.insertProjects(req, res);
  }
);

/**
 * Método POST para subir imagen de proyecto
 */
router.post(
  "/api/uploadImage",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    FileUploads.uploadImages(req, res);
  }
);

/**
 * Método POST para resetear la contraseña
 */
router.post(
  "/api/resetEmail",
  middlewareEmail.validarEmail,
  async (req: Request, res: Response) => {
    //Generar un token - JWT
    const token = await JsonWebToken.generarJWT(middlewareEmail.result);
    const nodemailer = new NodeMailer({ ...middlewareEmail.result[0], token });
    nodemailer.sendEmailPassword(res);
  }
);

/*#endregion */
/*************************************************************************************/

/*************************************************************************************/
/*#region MÉTODOS GET   **************************************************************/
/*******************************************************************************************/

/**
 * Método GET para validar en token de seguridad
 */
router.get(
  "/api/loginrenew",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    const token = req.header("x-token");
    const query = `
                SELECT * 
                FROM usuarios 
                WHERE id_us = ${middleware.user.id} AND email_us = '${middleware.user.email}'`;
    MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          error: err,
        });
      } else {
        return res.status(200).send({
          ok: true,
          msg: "Usuario valido.",
          token,
          usuario,
        });
      }
    });
  }
);

/**
 *Método GET que obtiene todos los clientes
 */
router.get(
  "/api/usuarios",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    //Usuarios.getAllClientes(req, res);
    try {
      const query2 = `SELECT * FROM usuarios WHERE id_us NOT IN (1)`;
      const query = `SELECT * FROM usuarios `;

      MySQL.ejecutarQuery(query, (err: any, usuarios: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            usuarios,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en inserción... Revisar logs",
        error,
      });
    }
  }
);

/**
 *Método GET que obtiene el usuario por id
 */
router.get(
  "/api/usuario/:id",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Usuarios.getUsuario(req, res);
  }
);

/**
 *Método GET que obtiene todos los proyectos
 */
router.get("/api/allProyectos", (req: Request, res: Response) => {
  Proyectos.getProjects(req, res);
});

/**
 *Método GET que obtiene todos los créditos
 */
router.get(
  "/api/allCreditos/:IdUser",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Creditos.getAllCreditos(req, res);
  }
);

/**
 *Método GET que obtiene el crédito por id de cliente
 */
router.get(
  "/api/credito/:idUs",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    //Creditos.getCreditoById(req, res);
    try {
      const escapeIdUs = MySQL.instance.cnn.escape(req.params.idUs);

      const query = ` SELECT T0.id_us, T0.nombre_us, T0.telefono_us, T1.*
                    FROM usuarios AS T0 INNER JOIN creditos AS T1 ON T0.id_us = T1.id_us
                    WHERE T1.id_us = ${escapeIdUs} AND T1.estado_cred = 1`;

      MySQL.ejecutarQuery(query, (err: any, credito: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: "No es posible obtener el crédito. Inténtelo más tarde.",
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            credito,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en obtener... Revisar logs",
        error,
      });
    }
  }
);

/**
 *Método GET que obtiene todos los pagos
 */
router.get(
  "/api/pagos/:idUser",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Pagos.getAllPagos(req, res);
  }
);

/**
 *Método GET que obtiene los pagos por id crédito
 */
router.get(
  "/api/pagos/:idCredito",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    //Pagos.getPagosById(req, res);
    try {
      const escapeIdCredito = MySQL.instance.cnn.escape(req.params.idCredito);

      const query = `
                  SELECT T0.nombre_us, T0.telefono_us, T0.email_us, T2.monto_cred, T2.plazo_cred, T2.estado_cred, T3.* 
                  FROM usuarios AS T0 INNER JOIN pagos AS T3 ON T0.id_us = T3.id_us
                  INNER JOIN creditos AS T2 ON T3.id_us = T2.id_us
                  WHERE T3.id_cred = ${escapeIdCredito} GROUP by T3.id_pag ORDER BY T3.fecha_pag DESC `;

      MySQL.ejecutarQuery(query, (err: any, pagos: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: "No es posible obtener los pagos. Inténtelo más tarde.",
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            pagos,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en consulta... Revisar logs",
        error,
      });
    }
  }
);

/**
 *Método GET que obtiene los datos de la finanzas y el usuario
 */
router.get(
  "/api/finanzas/:idUs",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.getFinanzasById(req, res);
  }
);

/**
 *Método GET que obtiene los ingresos por usuario
 */
router.get(
  "/api/ingresos/:idUs",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.getIngresosById(req, res);
  }
);

/**
 *Método GET que obtiene ingreso por id
 */
router.get(
  "/api/ingreso/:id",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.getIngreso(req, res);
  }
);

/**
 *Método GET que obtiene los egresos por usuario
 */
router.get(
  "/api/egresos/:idUs",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    //Finanzas.getEgresosById(req, res);
    try {
      const escapeIdUs = MySQL.instance.cnn.escape(req.params.idUs);

      const query = `
                  SELECT *
                  FROM egresos
                  WHERE id_us = ${escapeIdUs} ORDER BY fecha_egre DESC`;

      MySQL.ejecutarQuery(query, (err: any, egresos: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: "No es posible obtener los egresos. Inténtelo más tarde.",
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            egresos,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        ok: false,
        msg: "Error inesperado en obtener... Revisar logs",
        error,
      });
    }
  }
);

/**
 *Método GET que obtiene egreso por id
 */
router.get(
  "/api/egreso/:id",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.getEgreso(req, res);
  }
);

/**
 *Método GET que obtiene todos los archivos
 */
router.get(
  "/api/archivos",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    const query = ` SELECT T0.*, T1.nombres_us
                  FROM informacion_clientes AS T0 INNER JOIN usuarios AS T1 
                  ON id_us_info = id_us 
                  ORDER BY fech_publica_info DESC `;

    MySQL.ejecutarQuery(query, (err: any, archivos: Object[]) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          error: err,
        });
      } else {
        return res.status(200).send({
          ok: true,
          archivos,
        });
      }
    });
  }
);

/**
 *Método GET que obtiene los archivos por id de usuario
 */
router.get(
  "/api/archivos/:id",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    const escapeId = MySQL.instance.cnn.escape(req.params.id);
    const query = ` SELECT * FROM informacion_clientes WHERE  id_us_info = ${escapeId}`;
    MySQL.ejecutarQuery(query, (err: any, archivos: Object[]) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          error: err,
        });
      } else {
        return res.status(200).send({
          ok: true,
          archivos,
        });
      }
    });
  }
);

/**
 *Método GET que obtiene los archivos por id de usuario y id inversión
 */
router.get(
  "/api/archivos/:idInversion/:id",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    const escapeId = MySQL.instance.cnn.escape(req.params.id);
    const escapeInver = MySQL.instance.cnn.escape(req.params.idInversion);
    const query = ` SELECT * 
                  FROM informacion_clientes 
                  WHERE id_us_info = ${escapeId} AND id_inv = ${escapeInver}`;

    MySQL.ejecutarQuery(query, (err: any, archivos: Object[]) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          error: err,
        });
      } else {
        return res.status(200).send({
          ok: true,
          archivos,
        });
      }
    });
  }
);

/**
 *Método GET que obtiene la imagen
 */
router.get(
  "/api/getarchivo/:extension/:archivo",
  (req: Request, res: Response) => {
    FileUploads.returnFile(req, res);
  }
);

/**
 *Método GET que obtiene los usuarios y sus inversiones
 */
router.get(
  "/api/usuariosInversion",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    const query = `
                SELECT T0.id_us, T0.nombres_us, T0.compania_us, T0.email_us, T1.nombre_inv, T1.capital_inv, T1.moneda_inv, T1.tiempo_inv, T1.tasa_ea_inv  
                FROM usuarios AS T0 INNER JOIN  inversiones_clientes AS T1 ON T0.id_us = T1.id_us_inv
                WHERE T0.estado_us = 1 ORDER BY T0.id_us ASC`;

    MySQL.ejecutarQuery(query, (err: any, datos: Object[]) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          msg: "No es posible obtener los anexos. Inténtelo más tarde.",
          error: err,
        });
      } else {
        return res.status(200).send({
          ok: true,
          datos,
        });
      }
    });
  }
);

/*#endregion */
/*************************************************************************************/

/*************************************************************************************/
/*#region MÉTODOS PUT   **************************************************************/
/*******************************************************************************************/

/**
 * Método PUT para actualizar cliente por id
 */
router.put(
  "/api/updateCliente",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Usuarios.actualizarCliente(req, res);
  }
);

/**
 * Método PUT para actualizar usuario por id
 */
router.put(
  "/api/updateUser",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Usuarios.actualizarUsuario(req, res);
  }
);

/**
 * Método PUT para actualizar el crédito
 */
router.put(
  "/api/updateCredito",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Creditos.updateCreditoById(req, res);
  }
);

/**
 * Método PUT para actualizar el pago
 */
router.put(
  "/api/updatePago",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Pagos.updatePagosById(req, res);
  }
);

/**
 * Método POST para cargar archivos del cliente
 */
router.put(
  "/api/uploadfile/:idInversion/:idAnexo/:id",
  [middleware.validarJWT, FileUploads.uploadsFile],
  async (req: Request, res: Response) => {
    const escapeId = MySQL.instance.cnn.escape(req.params.id);
    const escapeIdInver = MySQL.instance.cnn.escape(req.params.idInversion);
    const escapeIdAnex = MySQL.instance.cnn.escape(req.params.idAnexo);

    if (FileUploads.upFile) {
      const query = `
            INSERT INTO informacion_clientes
            (id_us_info, id_inv, id_anex, nom_archivo_info, tipo_archivo_info, fech_publica_info )
            VALUES ( ${escapeId}, ${escapeIdInver}, ${escapeIdAnex}, '${FileUploads.nomDocumento}', '${FileUploads.extenFile}', CURRENT_TIMESTAMP() )`;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: "Problema al crear la información.",
            err,
          });
        }
        return res.status(200).send({
          ok: true,
          msg: "Información registrada con éxito.",
          result,
        });
      });
    }
  }
);

/**
 * Método PUT para actualizar el ingreso seleccionado
 */
router.put(
  "/api/updateIngreso",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.updateIngresosById(req, res);
  }
);

/**
 * Método PUT para actualizar el egreso seleccionado
 */
router.put(
  "/api/updateEgreso",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Finanzas.updateEgresosById(req, res);
  }
);

/**
 * Método PUT para actualizar el proyecto seleccionado
 */
router.put(
  "/api/updateProject",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Proyectos.putProjects(req, res);
  }
);

/**
 * Método POST para actualizar la contraseña
 */
router.put("/api/updatePassword", (req: Request, res: Response) => {
  Usuarios.updatePassword(req, res);
});

/*#endregion */
/*************************************************************************************/

/*************************************************************************************/
/*#region MÉTODOS DELETE *************************************************************/
/*******************************************************************************************/

/**
 * Método para eliminar ingresos por id
 */
router.delete(
  "/api/deleteIngreso/:idIngreso",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    try {
      const escapeId = MySQL.instance.cnn.escape(req.params.idIngreso);

      const query = `DELETE FROM ingresos WHERE id_ingre = ${escapeId}`;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: `No es posible eliminar el ingreso. Inténtelo más tarde.`,
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            msg: `El ingreso fue eliminado con éxito.`,
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
);

/**
 * Método para eliminar egresos por id
 */
router.delete(
  "/api/deleteEgreso/:idEgreso",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    try {
      const escapeId = MySQL.instance.cnn.escape(req.params.idEgreso);

      const query = `DELETE FROM egresos WHERE id_egre = ${escapeId}`;

      MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
        if (err) {
          return res.status(400).send({
            ok: false,
            msg: `No es posible eliminar el egreso. Inténtelo más tarde.`,
            error: err,
          });
        } else {
          return res.status(200).send({
            ok: true,
            msg: `El egreso fue eliminado con éxito.`,
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
);

/**
 * Método para eliminar imagen por id
 */
router.delete(
  "/api/deleteImage/:nomArchivo",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    FileUploads.deleteImage(req, res);
  }
);

/**
 * Método para eliminar proyecto por id
 */
router.delete(
  "/api/deleteProject/:id",
  middleware.validarJWT,
  (req: Request, res: Response) => {
    Proyectos.deleteProject(req, res);
  }
);

/**
 * Método para eliminar archivos por id
 */
router.delete(
  "/api/deletearchivo/:extension/:archivo/:id",
  [middleware.validarJWT, FileUploads.deleteFile],
  (req: Request, res: Response) => {
    const escapeId = MySQL.instance.cnn.escape(req.params.id);

    const query = `DELETE FROM informacion_clientes 
                 WHERE id_info = ${escapeId} `;

    MySQL.ejecutarQuery(query, (err: any, result: Object[]) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          msg: `No es posible eliminar el archivo. Inténtelo más tarde.`,
          error: err,
        });
      } else {
        return res.status(200).send({
          ok: true,
          msg: `El archivo fue eliminado con éxito.`,
          result,
        });
      }
    });
  }
);

/*#endregion */
/*************************************************************************************/

//================================================================
//================================================================
/**
 * Método que mantiene la conexión de MySQL
 */
cron.schedule("*/3 * * * *", () => {
  const hora = new Date().getTime();
  MySQL.ejecutarQuery("SELECT 1", (err: any, result: any) => {
    if (err) {
      throw new Error("Error conexión");
    } else {
      console.log(`Conexión constante!! ${result} - ${hora}`);
    }
  });
});

export default router;
