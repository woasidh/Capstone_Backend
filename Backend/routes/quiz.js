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
            description: 'success, quiz 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $name: '중간점검 OX',
                $subjectId: 0,
                $answerSheets: [{
                    $question: '배고파?',
                    $answer: '웅'
                }],
                $status: 'pending',
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
        #swagger.responses[201] = {
            description: 'success, quizzes 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
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
        #swagger.responses[201] = {
            description: 'success, quizzes 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
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
            description: 'success, quiz 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
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
            description: 'success, quiz 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        } */
    Quiz.findOne({ _id: req.params.id }, (err, quiz)=>{
        if (err) return res.status(500).json(err);

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
            description: 'success, quiz 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
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
            description: 'success, quiz 객체 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우'
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
            description: 'success, quiz 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        } 
        #swagger.responses[409] = {
            description: 'quiz의 deadLine이 지났을 경우 success: false, isOver 반환'
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

module.exports = router;