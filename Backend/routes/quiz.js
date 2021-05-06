const express = require('express');
const router = express.Router();

const { Quiz } = require('../models/models');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 퀴즈 생성
router.post('/create', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/create' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[201] = {
            description: '퀴즈가 정상적으로 생성된 경우',
            schema: {
                success: true,
                quiz: {
                    _id: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    date: '',
                    deadLine: '',
                    $answerSheets: [{
                        $question: '배고파?',
                        $answer: 'O',
                        $points: 5
                    }],
                    $status: 'pending',
                    $type: 'ox',
                    responses: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $name: '중간점검 OX',
                $subjectId: 0,
                $answerSheets: [{
                    $question: '배고파?',
                    $answer: 'O'
                }],
                $type: 'ox'
            }
        } */
    const quiz = new Quiz({
        name: req.body.name,
        subject: req.body.subjectId,
        answerSheets: req.body.answerSheets,
        status: 'pending',
        type: req.body.type,
    });
    quiz.save((err, q)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json({
            success: true,
            quiz: q
        });
    });
});

// 해당 Id에 해당하는 subject에 속하는 quiz 불러오기
router.get('/get/subject/:id', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/get/subject/{id}' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '해당 과목에 속하는 quiz 전부 정상적으로 받아온 경우',
            schema: {
                success: true,
                quizzes: [{
                    _id: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    date: '',
                    deadLine: '',
                    $answerSheets: [{
                        $question: '배고파?',
                        $answer: 'O',
                        $points: 5
                    }],
                    $status: 'pending',
                    $type: 'ox',
                    responses: []
                }]
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        } */
    Quiz.find({ subject: req.params.id }, (err, quizzes)=>{
        if (err) return res.status(500).json(err);

        res.status(200).json({
            success: true,
            quizzes
        });
    })
})

router.get('/get/student/subject/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/get/student/subject/{id}' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '정상적으로 학생이 열람가능한 퀴즈들에서 본인과 관련된 정보만을 받아왔을 경우',
            schema: {
                success: true,
                quizzes: [{
                    quizId: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    $questions: [{
                        $question: '배고파?',
                        $points: 5
                    }],
                    date: '2021-05-05T15:38:19.424Z',
                    deadLine: '2021-05-05T16:00:00.000Z',
                    $status: 'open',
                    $type: 'ox',
                    responses: []
                }]
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } */
    Quiz.find({
        subject: req.params.id,
        status: { $in: ['open', 'done'] }
    }, (err, quizzes)=>{
        if (err) return res.status(500).json(err);

        let quizzesForStudentArr = [];
        quizzes.forEach((quiz)=>{
            const response = quiz.responses.filter(response=>response.student === req.session._id);

            let problemSheets = [];
            quiz.answerSheets.forEach((answerSheet)=>{
                const problemForm = {
                    question: answerSheet.question,
                    points: answerSheet.points
                }
                problemSheets.push(problemForm);
            })

            const quizForStudentForm = {
                quizId: quiz._id,
                name: quiz.name,
                subjectId: quiz.subject,
                questions: problemSheets,
                date: quiz.date,
                deadLine: quiz.deadLine,
                status: quiz.status,
                type: quiz.type,
                responses: response
            }
            quizzesForStudentArr.push(quizForStudentForm);
        });

        res.status(200).json({
            success: true,
            quizzes: quizzesForStudentArr
        });
    })
})

router.get('/get/:id', professorAuth, (req, res)=>{
     /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/get/{id}' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '해당 id의 퀴즈를 정상적으로 받아올 경우',
            schema: {
                success: true,
                quiz: {
                    _id: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    date: '',
                    deadLine: '',
                    $answerSheets: [{
                        $question: '배고파?',
                        $answer: 'O',
                        $points: 5
                    }],
                    $status: 'pending',
                    $type: 'ox',
                    responses: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        }
        #swagger.responses[404] = {
            description: '해당 id를 지니는 퀴즈가 존재하지 않을 경우',
            schema: {
                success: false,
                existQuiz: false
            }
        } */
    Quiz.findOne({ _id: req.params.id }).populate('user').exec((err, quiz)=>{
        if (err) return res.status(500).json(err);
        if (quiz === null) return res.status(404).json({
            success: false,
            existQuiz: false
        });

        res.status(200).json({
            success: true,
            quiz: quiz
        });
    })
})

router.get('/get/student/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/get/student/{id}' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '해당 퀴즈에서 정상적으로 본인과 관련된 정보만을 받아왔을 경우',
            schema: {
                quizId: 0,
                name: '중간점검 OX',
                subjectId: 0,
                $questions: [{
                    $question: '배고파?',
                    $points: 5
                }],
                date: '2021-05-05T15:38:19.424Z',
                deadLine: '2021-05-05T16:00:00.000Z',
                $status: 'open',
                $type: 'ox',
                responses: []
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[409] = {
            description: '해당 quiz의 status가 학생이 열람하기에 허용되지 않은 경우',
            schema: {
                success: false,
                isPending: true
            }
        } */
    Quiz.findOne({ _id: req.params.id }, (err, quiz)=>{
        if (err) return res.status(500).json(err);
        if (quiz.status === 'pending') return res.status(409).json({
            success: false,
            isPending: true
        })

        const response = quiz.responses.filter(response=>response.student === req.session._id);

        let problemSheets = [];
        quiz.answerSheets.forEach((answerSheet)=>{
            const problemForm = {
                question: answerSheet.question,
                points: answerSheet.points
            }
            problemSheets.push(problemForm);
        })

        const quizForStudentForm = {
            quizId: quiz._id,
            name: quiz.name,
            subjectId: quiz.subject,
            questions: problemSheets,
            date: quiz.date,
            deadLine: quiz.deadLine,
            status: quiz.status,
            type: quiz.type,
            responses: response
        }

        res.status(200).json({
            success: true,
            quiz: quizForStudentForm
        });
    })
})

// quiz 시작
router.put('/open', professorAuth, (req, res)=>{
     /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/open' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '정상적으로 퀴즈가 학생들에게 개방되었을 경우',
            schema: {
                success: true,
                quiz: {
                    _id: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    date: '2021-05-05T15:38:19.424Z',
                    deadLine: '2021-05-05T16:00:00.000Z',
                    $answerSheets: [{
                        $question: '배고파?',
                        $answer: 'O',
                        $points: 5
                    }],
                    $status: 'open',
                    $type: 'ox',
                    responses: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $id: 0,
                deadLine: '2021-05-05T16:00:00.000Z'
            }
        } */
    Quiz.findOneAndUpdate({ _id: req.body.id }, {
        status: 'open',
        date: moment(),
        deadLine: req.body.deadLine
    }, { new: true }, (err, quiz)=>{
        if (err) return res.status(500).json(err);

        res.status(200).json({
            success: true,
            quiz
        });
    })
})

// 퀴즈 종료
router.put('/close', professorAuth, (req, res)=>{
     /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/close' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '정상적으로 퀴즈가 마감되었을 경우',
            schema: {
                success: true,
                quiz: {
                    _id: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    date: '2021-05-05T15:38:19.424Z',
                    deadLine: '2021-05-05T16:01:38.237Z',
                    $answerSheets: [{
                        $question: '배고파?',
                        $answer: 'O',
                        $points: 5
                    }],
                    $status: 'done',
                    $type: 'ox',
                    responses: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        } */
    Quiz.findOneAndUpdate({ _id: req.body.id }, {
        status: 'done',
        deadLine: moment()
    }, { new: true }).populate('user').exec((err, quiz)=>{
        if (err) return res.status(500).json(err);

        res.status(200).json({
            success: true,
            quiz
        })
    })
})

// 퀴즈 제출
router.put('/submit', auth, (req, res)=>{
     /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/submit' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '학생이 해당 퀴즈에 대한 답을 정상적으로 제출한 경우',
            schema: {
                success: true,
                quiz: {
                    quizId: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    $questions: [{
                        $question: '배고파?',
                        $points: 5
                    }],
                    date: '2021-05-05T15:38:19.424Z',
                    deadLine: '2021-05-05T16:00:00.000Z',
                    $status: 'open',
                    $type: 'ox',
                    responses: [{
                        date: '2021-05-05T15:59:19.424Z',
                        student: 0,
                        response: [{
                            answer: 'O',
                            correctness: true
                        }],
                        score: 5
                    }]
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } 
        #swagger.responses[409] = {
            description: 'quiz의 status가 done일 경우',
            schema: {
                success: true,
                isOver: true
            }
        } */
        
    const now = moment();

    Quiz.findOne({ _id: req.body.id }).populate('subject').exec((err, quiz)=>{
        if (err) return res.status(500).json(err);
        if (quiz.status==='done') {
            return res.status(409).json({
                success: false,
                isOver: true
            });
        }

        let response = req.body.response;
        let score = 0;

        quiz.answerSheets.forEach((answerSheet, index)=>{
            if (answerSheet.answer == response[index].answer) {
                response[index].correct = true;
                score += answerSheet.points;
            }
            else {
                response[index].correct = false;
            }
        });

        response.score = score;

        quiz.responses.push({
            date: now,
            student: req.body.studentId,
            response: response
        });
        quiz.save((err, doc)=>{
            if (err) return res.status(500).json(err);

            const myResponse = doc.responses.filter(response=>response.student===req.session._id)
            
            let problemSheets = [];
            doc.answerSheets.forEach((answerSheet)=>{
                const problemForm = {
                    question: answerSheet.question,
                    points: answerSheet.points
                }
                problemSheets.push(problemForm);
            })

            const responseForm = {
                quizId: doc._id,
                name: doc.name,
                subjectName: quiz.subject.name,
                questions: problemSheets,
                date: doc.date,
                deadLine: doc.deadLine,
                status: doc.status,
                type: doc.type,
                response: myResponse
            }

            res.status(200).json({ 
                success: true,
                quiz: responseForm
            });
        })
    })
})

router.delete('/delete/:id', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Quiz']
        #swagger.path = '/quiz/delete/{id}' 
        #swagger.description = 'status는 pending/open/done으로 나뉨'
        #swagger.responses[200] = {
            description: 'success, quiz 반환',
            schema: {
                success: true,
                quiz: {
                    quizId: 0,
                    name: '중간점검 OX',
                    subjectId: 0,
                    $questions: [{
                        $question: '배고파?',
                        $points: 5
                    }],
                    date: '2021-05-05T15:38:19.424Z',
                    deadLine: '2021-05-05T16:00:00.000Z',
                    $status: 'open',
                    $type: 'ox',
                    responses: [{
                        date: '2021-05-05T15:59:19.424Z',
                        student: 0,
                        response: [{
                            answer: 'O',
                            correctness: true
                        }],
                        score: 5
                    }]
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } 
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        } */
    Quiz.findOneAndDelete({ _id: req.params.id }, (err, quiz)=>{
        if (err) return res.status(500).json(err);
        
        res.status(200).json({
            success: true,
            quiz: quiz
        });
    })
})

module.exports = router;