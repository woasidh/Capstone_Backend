const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Test API with swagger",
        version: '1.0.0'
    },
    host: process.env.IP,
    schemes: ['http', 'https'],
    tags: [
        { "name": "Auth" },
        { "name": "User" },
        { "name": "Room" }
    ]
}

const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/auth.js', 
    './routes/index.js', 
    './routes/user.js', 
    './routes/room.js'
]

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('../bin/www');
});