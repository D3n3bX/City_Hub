// CONFIG -> mongo.js
/*
    El config exporta un objeto de configuración o una serie de variables que se utilizan en la aplicación. 
    Este archivo puede tener diferentes propósitos según la aplicación, como configurar constantes, opciones de entorno, etc.
*/
// ----------------------------------------------------------------------------

// Librerías
const mongoose = require('mongoose')

/*
  FUNCION
    dbConnect()
    Función para conectar a la base de datos utilizando Mongoose.
    Obtiene la URI de la base de datos desde las variables de entorno, configura Mongoose para que no sea estricto en las consultas y realiza la conexión a la base de datos.
    Return:
        - Conexión a la base de datos utilizando la URI proporcionada.
        - Mensaje de error en caso de no poder conectar a la base de datos.
*/
const dbConnect = () => {
    // Obtenemos la uri de la BBDD desde las variables de entorno
    const db_uri = process.env.DB_URI 
    
    // Configuramos mongoose para que no sea estricto en las consultas (strrictQuery)
    mongoose.set('strictQuery', false) 
    
    try {
        // Nos conectamos a la BBDD con la URI proporcionada
        mongoose.connect(db_uri) 
    } catch (error) {
        console.err('Error conectando a la BD:', error) // En caso de no conseguirlo, mostramos un mensaje de error en la consola
    }

    // Escuchamos eventos relacionados con la conexión a la BBDD
    mongoose.connection.on('connected',() => console.log('Conectado a la BD')) 
}

module.exports = dbConnect