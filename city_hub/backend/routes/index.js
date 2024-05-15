const express = require('express')
const fs = require('fs')

// Creamos un router global que gestiona todos los routes
const routerGlobal = express.Router()

const removeExtension = (fileName) => {
    //Solo la primera parte del split (lo de antes del punto)
    return fileName.split('.').shift()
}

fs.readdirSync(__dirname).filter((file) => {
    const name = removeExtension(file) // index, users, storage, tracks
    if(name !== 'index') {
        routerGlobal.use('/' + name, require('./'+name))
    }
})

module.exports = routerGlobal