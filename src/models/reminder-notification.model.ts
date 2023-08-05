const { v4: uuidv4 } = require("uuid");


export const typeNotificationReminder = (today:number) =>{
  switch (today) {
    case 3:
      return {
        id: uuidv4().split('-')[0],
        idAdmin: 1,
        titulo: 'Recordatorio de pagos!',
        desp: 'A hoy debes pagar Cesca',
        tipo: 'PAY',
        nombre: '',
        fecha: new Date().toISOString()
      }
    case 5:
      return {
        id: uuidv4().split('-')[0],
        idAdmin: 1,
        titulo: 'Recordatorio de pagos!',
        desp: 'No olvides pagar Banco Caja Social!',
        tipo: 'PAY',
        nombre: '',
        fecha: new Date().toISOString()
      }
    case 14:
      return {
        id: uuidv4().split('-')[0],
        idAdmin: 1,
        titulo: 'Recordatorio de pagos!',
        desp: 'Hay que pagar los servicios Claro!',
        tipo: 'PAY',
        nombre: '',
        fecha: new Date().toISOString()
      }
    case 20:
      return {
        id: uuidv4().split('-')[0],
        idAdmin: 1,
        titulo: 'Recordatorio de pagos!',
        desp: 'A hoy debes pagar el seguro vehículo!',
        tipo: 'PAY',
        nombre: '',
        fecha: new Date().toISOString()
      }
    case 25:
      return {
        id: uuidv4().split('-')[0],
        idAdmin: 1,
        titulo: 'Ingresos a tu cuenta!',
        desp: 'A hoy debes recibir el pago de DXC',
        tipo: 'PAY',
        nombre: '',
        fecha: new Date().toISOString()
      }
    default:
      return null
  }
} 