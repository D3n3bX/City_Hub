const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Tracks - Express API with Swagger (OpenAPI 3.0)',
            version: '0.1.0',
            description: 'This is a CRUD API application made with Express and documented with Swagger',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'u-tad',
                url: 'https://u-tad.com',
                email: 'ricardo.palacios@u-tad.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
            schemas: {
                user: {
                    type: 'object',
                    required: ['nombre', 'correo', 'password', 'edad', 'ciudad', 'intereses'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Menganito',
                        },
                        correo: {
                            type: 'string',
                            example: 'miemail@google.co',
                        },
                        password: {
                            type: 'string',
                        },
                        edad: {
                            type: 'integer',
                            example: 20,
                        },
                        ciudad: {
                            type: 'string',
                            example: 'Madrid',
                        },
                        intereses: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['Interes 1', 'Interes 2'],
                        },
                    },
                },
                obtenerUsuario: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: {
                            type: 'string',
                            example: 'usuario@ejemplo.com',
                        },
                    },
                },
                modificarUsuario: {
                    type: 'object',
                    required: ['ciudad', 'intereses', 'ofertas'],
                    properties: {
                        ciudad: {
                            type: 'string',
                            example: 'Madrid',
                        },
                        intereses: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['Interes 1', 'Interes 2'],
                        },
                        ofertas: {
                            type: 'boolean',
                            example: true
                        }
                    },
                },
                comercio: {
                    type: 'object',
                    required: ['nombre', 'CIF', 'correo', 'password', 'telefono', 'ciudad', 'actividad', 'titulo', 'resumen', 'textos'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Comercio',
                        },
                        CIF: {
                            type: 'string',
                            example: 'A98765430',
                        },
                        correo: {
                            type: 'string',
                            example: 'info@comercio.com',
                        },
                        password: {
                            type: 'string',
                        },
                        telefono: {
                            type: 'integer',
                            example: 612345789,
                        },
                        ciudad: {
                            type: 'string',
                            example: 'Barcelona',
                        },
                        actividad: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['Actividad 1', 'Actividad 2'],
                        },
                        titulo: {
                            type: 'string',
                            example: 'Titulo',
                        },
                        resumen: {
                            type: 'string',
                            example: 'Este es el resumen de la empresa.',
                        },
                        textos: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['Texto 1', 'Texto 2'],
                        },
                        review: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['Reseña 1', 'Reseña 2'],
                        },
                    },
                },
                registrarComercio: {
                    type: 'object',
                    required: ['nombre', 'CIF', 'correo', 'password', 'telefono'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Comercio',
                        },
                        CIF: {
                            type: 'string',
                            example: 'A98765430',
                        },
                        correo: {
                            type: 'string',
                            example: 'info@comercio.com',
                        },
                        password: {
                            type: 'string',
                        },
                        telefono: {
                            type: 'integer',
                            example: 612345789,
                        },
                    },
                },
                modificarComercio: {
                    type: 'object',
                    required: ['nombre', 'correo', 'password', 'telefono', 'ciudad', 'actividad'],
                    properties: {
                        nombre: {
                            type: 'string',
                            example: 'Comercio',
                        },
                        correo: {
                            type: 'string',
                            example: 'info@comercio.com',
                        },
                        password: {
                            type: 'string',
                        },
                        telefono: {
                            type: 'integer',
                            example: 612345789,
                        },
                        ciudad: {
                            type: 'string',
                            example: 'Barcelona',
                        },
                        actividad: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['Actividad 1', 'Actividad 2'],
                        },
                    },
                },
                infoComercio: {
                    type: 'object',
                    required: ['titulo', 'resumen', 'textos', 'fotos'],
                    properties: {
                        titulo: {
                            type: 'string',
                            example: 'TITULO',
                        },
                        resumen: {
                            type: 'string',
                            example: 'resumen',
                        },
                        textos: {
                            type: 'string',
                            example: 'texto',
                        },
                    },
                },
                reviewComercio: {
                    type: 'object',
                    required: ['scoring', 'review'],
                    properties: {
                        scoring: {
                            type: 'number',
                            example: 4.3,
                        },
                        review: {
                            type: 'string',
                            example: 'Me ha encantado',
                        },
                    },
                },
                fotoComercio: {
                    type: 'object',
                    required: ['scoring', 'review'],
                    properties: {
                        scoring: {
                            type: 'number',
                            example: 4.3,
                        },
                        review: {
                            type: 'string',
                            example: 'Me ha encantado',
                        },
                    },
                },
                login: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            example: 'miemail@google.com',
                        },
                        password: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
