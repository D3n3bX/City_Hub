// CONTROLLER -> storage.js
/*
    El controlador es el componente responsable de manejar las interacciones del usuario y actualizar el modelo y la vista en consecuencia, 
    es decir, actúa como un intermediario entre el modelo y la vista, gestionando las interacciones del usuario y asegurando que el estado 
    de la aplicación se actualice y se presente correctamente al usuario.
*/
// ----------------------------------------------------------------------------

const { storageModel } = require('../models')
const { matchedData } = require('express-validator')
const fs = require('fs')

const MEDIA_PATH = __dirname + '/../storage'

const getItems = async (req, res) => {
    const data = await storageModel.find({})
    res.send({data})
}

const createItem = async (req, res) => {
    const { body, file } = matchedData(req)
    console.log(file)
    
    const fileData = {
        filename: file.filename,
        url: process.env.PUBLIC_URL+'/'+file.filename
    }

    const data = await storageModel.create(fileData)
    res.send(data)
}

const getItem = (req, res) => {
    const data = 'ok getItem'
    res.send({data})
}

const updateItem = (req, res) => {
    res.send('ok updateItem')
}

const deleteItem = async (req, res) => {
    const { id }  = matchedData(req)
    console.log(file)
    const dataFile = await storageModel.findById({ _id : id })
    await storageModel.deleteOne({ _id : id })
    const filePath = MEDIA_PATH + '/' + dataFile.filename
    fs.unlinkSync(filePath)
    res.status(200).json({ message: "Elemento eliminado con éxito" })
}

module.exports = { getItems, getItem, createItem, updateItem, deleteItem }