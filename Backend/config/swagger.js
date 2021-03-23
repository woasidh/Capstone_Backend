const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Test API with swagger",
        version: '1.0.0'
    },
    host: process.env.IP,
    schemes: ['http', 'https'],
    tags: [
        { "name": "Auth", "prefix": "/auth" },
        { "name": "User" },
        { "name": "Zoom" }
    ]
}

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/auth.js', './routes/index.js', './routes/user.js', './routes/zoom.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('../bin/www');
});

if(process.env.NODE_ENV === 'production')
    process.exit();