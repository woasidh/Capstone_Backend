const assert = require('assert');

describe('이해안됨 알람 테스트', ()=>{
    let ud = [];

    describe('5개 이상 시 알람', ()=>{
        let now;
        let limit;
        let minutes = [];
        let count = 0;

        before(()=>{
            limit = 5;
            minutes = [23, 26, 27, 28, 29];
            now = 29;
            
            for (let min in minutes) {
                ud.push({
                    response: 'X',
                    minutes: min
                });
            }
        })
        it('must be 4', ()=>{
            minutes.sort((a,b)=>b-a).some((min)=>{
                if (now - min <= 5) {
                    count++;
                    return false;
                }
                return true;
            });

            assert.strictEqual(count, 4);
        })
    })
    describe('10개 이상 시 알람', ()=>{
        let now;
        let limit;
        let minutes = [];
        let count = 0;
        before(()=>{
            limit = 10;
            minutes = [0, 3, 8, 10, 13, 15, 20, 23, 26, 27, 28, 29, 30, 30, 31, 31, 32, 32, 32, 32, 33, 33];
            now = 33;
            
            for (let min in minutes) {
                ud.push({
                    response: 'X',
                    minutes: min
                });
            }
        })
        it('must be 12', ()=>{
            minutes.sort((a,b)=>b-a).some((min)=>{
                if (now - min <= 5) {
                    count++;
                    return false;
                }
                return true;
            })

            assert.strictEqual(count, 12);
        })
    })
})