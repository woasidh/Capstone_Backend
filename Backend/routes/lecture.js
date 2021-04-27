const express = require('express');
const router = express.Router();

const { Subject, Lecture } = require('../models/subjects');
const { User } = require('../models/users');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault('Asia/Seoul');

// 곧 있을 수업 정보 받아오기
router.get('/get/upcoming', auth, (req, res) => {
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/get/upcoming' 
        #swagger.description = '현재 수업 중인 강의, 또는 곧 있을 강의 // 얼마나 지났는 지, 또는 해당 강의까지 남은 시간 반환',
        #swagger.responses[200] = {
            description: '현재 진행중인 수업이 있을 경우, inProgress, subject: subjectId, diffH, diffM 반환
                \n오늘 내에 강의가 있을 경우, upcoming, subject: subjectId, diffH, diffM 반환
                \n오늘 내에 강의가 없을 경우, upcoming: false 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
    */
    if (!req.session.isLogined) res.status(401).json({
        success: false
    });
    
    User.findOne({ email: req.session.email }).populate('subjects').exec((err, user)=>{
        if (err) res.status(500).json(err);
        else {
            let minDiff = 60 * 24;
            let existUpcomingLecture = false;
            let existInProgressLecture = false;
            let upcomingLecture;

            const today = moment();

            const nowDay = today.day();
            const nowHour = today.hours();
            const nowMin = today.minutes();

            user.subjects.some((subject)=>{
                subject.days.some((day, dayIndex)=>{
                    if (day == nowDay) {
                        const startTime = subject.start_time[dayIndex].split(':');
                        const endTime = subject.end_time[dayIndex].split(':');

                        const startHourDiff = (startTime[0] - nowHour);
                        const endHourDiff = (endTime[0] - nowHour);
                        const startMinuteDiff = (startTime[1] - nowMin);
                        const endMinuteDiff = (endTime[1] - nowMin);

                        const startTimeDiff = startHourDiff * 60 + startMinuteDiff;
                        const endTimeDiff = endHourDiff * 60 + endMinuteDiff;

                        if (endTimeDiff > 0) {
                            if (startTimeDiff < 0) {
                                res.status(200).json({
                                    inProgress: true,
                                    subject: subject._id,
                                    diffH: startHourDiff,
                                    diffM: startMinuteDiff
                                });

                                existInProgressLecture = true;
                                return true;
                            }

                            if (endTimeDiff < minDiff) {
                                minDiff = endTimeDiff;
                                upcomingLecture = subject._id;
                                existUpcomingLecture = true;
                            }
                        }
                    }
                });

                if (existInProgressLecture) return true;
            });
            if (!existInProgressLecture) {
                if (existUpcomingLecture) {
                    res.status(200).json({
                        upcoming: true,
                        subject: upcomingLecture._id,
                        diffH: minDiff / 60,
                        diffM: minDiff % 60
                    });
                }
                else {
                    res.status(200).json({
                        upcoming: false
                    })
                }
            }
        }
    });
});

// 현재 진행중인 수업이 있으면 어떤 수업이든 바로 참가
router.put('/join/any', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/join/any' 
        #swagger.description = '현재 진행중인 수업이 있으면 어떤 수업이든 바로 참가',
        #swagger.responses[200] = {
            description: '진행중인 수업이 있으면, success, existInProgressLecture, lecture 객체 반환,
            \n없으면, success: false, existInProgressLecture: false 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
    */
    Lecture.findOneAndUpdate({ status: 'inProgress' }, {
        $push: { students: { student: req.session._id }}
    }, { new: true }, (err, lecture)=>{
        if (err) res.status(500).json(err);
        else if (lecture === null) {
            res.status(200).json({
                success: false,
                existInProgressLecture: false
            });
        }
        else {
            res.status(200).json({
                success: true,
                existInProgressLecture: true,
                lecture: lecture
            });
        }
    })
})

module.exports = router