const assert = require('assert');

describe('퀴즈 제출 시 점수 환산 테스트', ()=>{
    let quiz;
    let myResponse;

    before(()=>{
        quiz = {
            name: '중간점검 OX',
            subject: 0,
            answerSheets: [{
                question: '배고파?',
                answer: 'O',
                points: 5
            },
            {
                question: '테스트성공?',
                answer: 'X',
                points: 3
            },
            {
                question: '흠',
                answer: 'O',
                points: 2
            }],
            status: 'open',
            type: 'ox',
            responses: []
        };
    })
    describe('0점 테스트', ()=>{
        beforeEach(()=>{
            myResponse = {
                student: 0,
                response: 
                [{
                    answer: 'X'
                },
                {
                    answer: 'O'
                },
                {
                    answer: 'X'
                }]
            }
        })
        it('result must be 0', ()=>{
            let score = 0;
    
            quiz.answerSheets.forEach((answerSheet, index)=>{
                if (answerSheet.answer === myResponse.response[index].answer) {
                    myResponse.response[index].correctness = true;
                    score += answerSheet.points;
                }
                else {
                    myResponse.response[index].correctness = false;
                }
            });
    
            assert.strictEqual(score, 0);
        })
    })
    describe('8점 테스트', ()=>{
        beforeEach(()=>{
            myResponse = {
                student: 0,
                response: 
                [{
                    answer: 'O'
                },
                {
                    answer: 'X'
                },
                {
                    answer: 'X'
                }]
            }
        });
        it('result must be 8', ()=>{
            let score = 0;
    
            quiz.answerSheets.forEach((answerSheet, index)=>{
                if (answerSheet.answer === myResponse.response[index].answer) {
                    myResponse.response[index].correctness = true;
                    score += answerSheet.points;
                }
                else {
                    myResponse.response[index].correctness = false;
                }
            });
    
            assert.strictEqual(score, 8);
        })
    })
})