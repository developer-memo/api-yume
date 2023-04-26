import nodemailer = require('nodemailer');
import { Response } from 'express';
import Enviroments from '../enviroments/enviroments';

const TRANSPORTER = nodemailer.createTransport(Enviroments.createTransportEmail());

export default class NodeMailer{

  public dataInfo:any;

  constructor( data:any ){
    this.dataInfo = data;
  }

  public SendMailer = (res?:any) => {
    const mailOptions = {
          from: '"GTSoftweb" <desarrollomemo@gmail.com>',
          to: 'desarrollomemo@gmail.com', 
          subject: `${this.dataInfo.subject} ✔`, 
          html: `<b>${this.dataInfo.subject} - (${this.dataInfo.email})</b>
                 <p>Señor(a) ${this.dataInfo.name} - (${this.dataInfo.phone})</p>
                 ${this.dataInfo.comment}`,
      };
      TRANSPORTER.sendMail( mailOptions, (err:any, info:any) =>{
      if (err) {
        return res.status(400).send({
          ok: false,
          msg: 'No se pudo enviar el correo electrónico.',
          error: err.message
        })
      } else {
        return res.status(200).send({
          ok: true,
          msg: 'Correo enviado'
        })
      }
    })
  }



  public sendEmailPassword = (res:Response) =>{
    const mailOptions = {
      from:    '"GTSoftweb" <desarrollomemo@gmail.com>',
      to:      this.dataInfo.email_us,  
      subject: `Recuperar contraseña YUME ✔`, 
      html: `<div style="width:600px; margin: auto; font-family: sans-serif; color: rgb(69, 83, 146);">
        <header style="background-color: #ebf0f6; text-align: center; padding: 7px; border-top-left-radius: 30px; border-top-right-radius: 30px;">
          <img src="https://yume.gtsoftweb.com/assets/images/logo-icon.png" style="width:70px;">
        </header>
        <div style="text-align: center;padding: 50px 15px;font-size: 18px;">
          <p>Señor(a) ${this.dataInfo.nombre_us}</p>
          <p>Acaba de solicitar un servicio para <br> recuperar su contraseña para la plataforma YUME.</p>
          <br>
          <p>Ingrese al siguiente link para resetear su contraseña:</p>
          <a href="https://yume.gtsoftweb.com/#/new-password/${this.dataInfo.token}" target="_blank">yume.gtsoftweb.com/new-password</a>
          <br>
          <br>
          <p>Si presenta alguna novedad, comuníquese con el administrador <a href="mailto:desarrollo@gtsoftweb.com">desarrollo@gtsoftweb.com</a></p>
          <br>
          <p>Para mayor información, ingrese a <a href="https://gtsoftweb.com/contacto" target="_blank">gtsoftweb.com/contacto</a> </p>
        </div>
        <footer style="background-color: #ebf0f6; text-align: center; padding: 7px; font-size: 12px; border-bottom-left-radius: 30px; border-bottom-right-radius: 30px;">
          <p>©2023 - Todos los derechos reservados.</p>
          <p>Diseño y desarrollo de Software - <a href="https://gtsoftweb.com" target="_blank">GtSoftWeb.com</a></p>
        </footer>
      </div> `,
    };
    TRANSPORTER.sendMail( mailOptions, (err:any, info:any) =>{
      if (err) {
        return res.status(400).send({
          ok: false,
          msg: 'No se pudo enviar el correo electrónico.',
          error: err.message
        })
      } else {
        return res.status(200).send({
          ok: true,
          msg: 'Correo enviado',
          token: this.dataInfo.token
        })
      }
    });
  }




}