const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Test API with swagger",
        version: '1.0.0'
    },
    host: process.env.IP,
    basePath: "/api",
    schemes: ['http', 'https'],
    tags: [
        { "name": "Auth" },
        { "name": "User" },
        { "name": "Subject" },
        { "name": "Lecture" }
    ],
    definitions: {
        signUp: {
            $email: 'kkimbj18@ajou.ac.kr',
            $name: '김민건',
            photourl: 'url',
            $identityID: '201620912',
            $school: '아주대',
            $major: '소프트웨어학과',
            grade: 4,
            $type: 'student'
        },
        createSubject: {
            name: '캡스톤디자인',
            start_period: '2021-03-02',
            end_period: '2021-06-30',
            start_time: ['16:30', '18:00', '19:30'],
            end_time: ['18:00', '19:30', '21:00'],
            days: [1, 1, 1],
        },
        closeLecture: {
            question: [{
                lecture: 0,
                questioner: '김민건',
                questionContent: '아 몰랑 안해',
                answers: [{
                    respondent: '최민우',
                    content: '아 나도 몰랑 안해'
                }]
            }],
            lectureId: 0
        }
    }
}

const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/auth.js', 
    './routes/index.js', 
    './routes/user.js', 
    './routes/subject.js',
    './routes/lecture.js'
]

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('../bin/www');
});