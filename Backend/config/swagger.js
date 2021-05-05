const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Test API with swagger",
        version: '1.0.0'
    },
    host: process.env.IP,
    basePath: "/api",
    schemes: ['http'],
    tags: [
        { "name": "Auth" },
        { "name": "User" },
        { "name": "Subject" },
        { "name": "Lecture" },
        { "name": "Quiz" },
        { "name": "Notice" },
        { "name": "LectureNote" },
        { "name": "Comment" },
        { "name": "Emotion" }
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
            $name: '캡스톤디자인',
            $start_period: '2021-03-02',
            $end_period: '2021-06-30',
            $start_time: ['16:30', '18:00', '19:30'],
            $end_time: ['18:00', '19:30', '21:00'],
            $days: [1, 1, 1],
        },
        closeLecture: {
            chatting: [{
                time: '09:00',
                name: '노민도',
                content: '담타 ㄱㄱ?'
            },
            {
                time: '09:10',
                name: '윤다연',
                content: '혹시 제 말 안 들렸어요?'
            }],
            question: [{
                lecture: 0,
                questioner: '김민건',
                questionContent: '아 몰랑 안해',
                answers: [{
                    respondent: '최민우',
                    content: '아 나도 몰랑 안해'
                },
                {
                    respondent: '김수민',
                    content: '아니 그게 아니라니까?'
                }]
            }],
            lectureId: 0
        },
        authFailed: {
            success: false,
            isLogined: false
        },
        proAuthFailed: {
            success: false,
            isProfessor: false
        },
    }
}

const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/auth.js', 
    './routes/index.js', 
    './routes/user.js', 
    './routes/subject.js',
    './routes/lecture.js',
    './routes/quiz.js',
    './routes/lectureNote.js',
    './routes/notice.js',
    './routes/comment.js',
    './routes/emotion.js'
]

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('../bin/www');
});