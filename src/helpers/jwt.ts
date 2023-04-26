import jwt from 'jsonwebtoken';
import Enviroments from '../enviroments/enviroments';

export default class JsonWebToken{
  
  //Métodos
  public static generarJWT = (id?:number, email?:string, data?:any) =>{
    const process = new Enviroments();
    let payLoad:any;
    if (id) {
      payLoad = { id, email };
    } else {
      payLoad = { data: data[0] };
    }
    return new Promise( (resolve, reject) =>{
      jwt.sign( payLoad, process.JWT_SECRET, { expiresIn: '12h' }, (err, token) =>{

        if (err) {
          reject(`No se pudo crear el JWT -> ${err}`);
  
        } else {
          resolve( token );
        }
  
      })
    });

  }

  
} 