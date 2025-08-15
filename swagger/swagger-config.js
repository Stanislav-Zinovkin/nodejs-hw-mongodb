
import swaggerJSDoc from 'swagger-jsdoc';


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Phonebook API',
            version: '1.0.0',
            description: 'API documentation for the Phonebook project',

        },
    },
    apis: ['./routes/*.js'],
}

export const swaggerSpec = swaggerJSDoc(options);