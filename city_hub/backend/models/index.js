// Creamos models donde importamos todos los models que tenemos, asi solo tenemos que importar este archivo
const models = {
    comercioModel: require('./nosql/comercio'), // Requerimos el modelo de comercio
    userModel: require('./nosql/user'), // Requerimos el modelo de user
    storageModel: require('./nosql/storage'), // Requerimos el modelo de storage
}

module.exports = models