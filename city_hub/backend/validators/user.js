// VALIDATOR -> user.js
/*
    El validator es un mecanismo utilizado para asegurar la integridad 
    y la calidad de los datos dentro de una aplicación, ayudando a prevenir errores 
    y garantizando que los datos sean consistentes y confiables.
*/
// ----------------------------------------------------------------------------

// Librerias
const { check } = require('express-validator')
// Módulos propios
const validateResults = require('../utils/handleValidator')

// Creamos un validador para iniciar sesión
// Indicamos los campos que debe tener así como un mensaje explicando el error en caso de no cumplir con los requisitos
const validatorLogin = [
    check('correo').exists().notEmpty().withMessage('El correo es obligatorio').isEmail().withMessage('El correo electrónico no es válido'),
    check('password').exists().notEmpty().withMessage('La contraseña es obligatoria')
]

// Creamos un validador para crear un nuevo usuario -> Regsitrar un usuario
// Indicamos los campos que debe tener así como un mensaje explicando el error en caso de no cumplir con los requisitos
// Por ahora todos los campos que hay para crear un comercio son obligatorios
const validatorCreateItem = [
    check('nombre').exists().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 3, max: 99 }).withMessage('El nombre debe tener entre 3 y 99 caracteres'),
    check('correo').exists().notEmpty().withMessage('El correo es obligatorio').isEmail().withMessage('El correo electrónico no es válido'),
    check('password').exists().notEmpty().withMessage('La contraseña es obligatoria').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    check('edad').exists().notEmpty().isNumeric().isLength({ min:2, max: 2}).withMessage('Edad no válida'),
    check('ciudad').exists().notEmpty().isLength({ min:3, max: 20}).withMessage('La ciudad debe tener entre 3 y 20 caracteres'),
    check('intereses').exists().isArray().withMessage('Los intereses deben ser un array'),
    check('ofertas').exists().notEmpty().isBoolean(),

    (req, res, next) => {
        return validateResults(req, res, next) // Mandamos los datos a validateResults y validamos los resultados, es importante pasar el next como parametro para que pueda pasar al siguiente middleware o acción
    }
]

// Creamos un validador para obtener un usuario a partir de su correp
// Indicamos los campos que debe tener así como un mensaje explicando el error en caso de no cumplir con los requisitos
const validatorGetItem = [
    check('correo').exists().notEmpty().withMessage('El correo es obligatorio').isEmail().withMessage('El correo electrónico no es válido'),
    
    (req, res, next) => {
        return validateResults(req, res, next) // Mandamos los datos a validateResults y validamos los resultados, es importante pasar el next como parametro para que pueda pasar al siguiente middleware o acción
    }
]

// Creamos un validador para modificar un usuario a partir de su correo
// Indicamos los campos que debe tener y que estos pueden ser opcionales así como un mensaje explicando el error en caso de no cumplir con los requisitos
const validatorModifyItem = [
    check('ciudad').optional().notEmpty().isLength({ min:3, max: 20}).withMessage('La ciudad debe tener entre 3 y 20 caracteres'),
    check('intereses').optional().isArray().withMessage('Los intereses deben ser un array'),
    check('ofertas').optional().notEmpty().isBoolean(),
    
    (req, res, next) => {
        return validateResults(req, res, next) // Mandamos los datos a validateResults y validamos los resultados, es importante pasar el next como parametro para que pueda pasar al siguiente middleware o acción
    }
]

module.exports = { validatorLogin, validatorCreateItem, validatorGetItem, validatorModifyItem }