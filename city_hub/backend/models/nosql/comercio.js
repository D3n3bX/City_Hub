// MODEL -> comercio.js
/*
    El modelo representa la capa de datos y lógica de negocio de la aplicación, proporcionando una abstracción de los datos subyacentes
    y garantizando que la aplicación funcione de manera coherente y eficiente.
*/
// ----------------------------------------------------------------------------

// Librerías
// Importa el módulo mongoose, que es una biblioteca de modelado de objetos MongoDB para Node.js
const mongoose = require('mongoose')
const mongooseDelete = require("mongoose-delete")

// Definimos el esquema que van a tener todos los comercios
const ComercioSchema = new mongoose.Schema( 
    {   
        // Datos introducidos por el admin -> obligatorios en el registro
        nombre: { 
            type: String
        },
        CIF: {
            type: String,
            unique: true // El CIF es único
        },
        direccion: {
            type: String
        },
        correo: {
            type: String,
            unique: true // El correo también es único
        },
        password: {
            type: String
        },
        telefono: {
            type: Number
        },

        // Datos introducidos por el comercio -> modificables por el comercio, además de los anteriores excepto el CIF
        ciudad: {
            type: String
        },
        actividad: {
            type: [String] // La activiad es un array ya que puede tener varias
        },
        titulo: {
            type: String
        },
        resumen: {
            type: String
        },
        textos: {
            type: [String] // Puede haber varios textos por lo que es un array
        },
        // Datos para suir fotos
        file: {
            filename: {
                type: String
            },
            url: {
                type: String,   
                unique: true
            },
        },
        // Datos no modificables por el comercio -> el usuario pone un scoring y review
        scoring: {
            type: [Number]
        },
        review: {
            type: [String]
        }
    },
    {
        timestamps: true, // Muestra  cuando se creó o se actualizó un comercio
        versionKey: false //  No muestra la clave de versión
    }
)

// Para poder hacer un soft delete
ComercioSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true })

// Para exportar el módulo indicamos el nombre de la colección de MongoDB y a continuación el nombre de la variable
module.exports = mongoose.model("comercio", ComercioSchema)