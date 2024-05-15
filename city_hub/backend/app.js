require('dotenv').config()

// Librerias
const express = require('express')
const cors = require('cors')
const morganBody = require('morgan-body')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./docs/swagger')

// Módulos propios
const loggerStream = require('./utils/handleLogger')
const routerGlobal = require('./routes')
const dbConnect = require('./config/mongo')

const app = express()

morganBody(app, {
    // Limpiamos el String de datos lo máximo posible antes de mandarlo a Slack
    noColors: true,

    // Solo enviamos errores (4XX de cliente y 5XX de servidor)
    skip: function(req, res) {
        return res.statusCode < 400
    },

    // Especificamos sel flujo de salida de registro como loggerStream
    stream: loggerStream
})

// Middelwares
app.use(cors())
app.use(express.json())

app.use(express.static('res')) // Almacenamos aqui las imágenes


app.use('/api-docs',
 swaggerUi.serve,
 swaggerUi.setup(swaggerSpecs)
)

app.use('/api', routerGlobal) // Usamos routerGlobal por lo que todas las URLs empezaron por http://localhost:3001/api

dbConnect() // Nos conectamos a MongoDB

const PORT = process.env.PORT || 3000 // Leemos el puerto que hay en el .env y en caso de que no este definido usamos el 3000 por defecto
app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})

module.exports = app