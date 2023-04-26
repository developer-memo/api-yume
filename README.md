# API YUME

Este proyecto esta creado con [NodeJs](https://nodejs.org/es) version 16.13.1

## Development server

Corre `npm install` para instalar los paquetes de Node

## Build

Corre `tsc` para crear la carpeta `dist/`.

## Running unit tests

Corre `npm run start` para iniciar el server de express  conecta con la BD.

## Ejemplo de enviroments

Solicita los datos de conexión al Project manager, lider técnico o a la persona encargada:

```export default class Enviroments {

  public JWT_SECRET:string = 'Aca es la JWT Secret';

  //Método con objeto para conexión a BD MYSQL
  public static datosConexion = () =>{
    const dataConnect:any = {
      host: 'Dirección IP',
      user: 'USER',
      password: 'PASSWORD',
      database: 'Nombre BD'
    };
    return dataConnect;
  }

  //Return object with data transporter email 
  public static createTransportEmail = () =>{
    return {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'Correo configurado',
          pass: 'clave de goggle'
      }
    }
  }
}
```




