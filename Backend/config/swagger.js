const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Test API with swagger",
        version: '1.0.0'
    },
    host: process.env.IP,
    schemes: ['http'],
    tags: [
        {
            "name": "Auth"
        },
        {
            "name": "User"
        },
    ]
}

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/auth.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('../bin/www');
});

if(process.env.NODE_ENV === 'production')
    process.exit();