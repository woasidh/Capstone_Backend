const express = require('express');
const router = express.Router();

const { Notice, LectureNote } = require('../models/models');
const { User } = require('../models/users');
const { Subject } = require('../models/subjects');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.put('/add', auth, (req, res)=>{
    /*  #swagger.tags = ['Comment']
        #swagger.path = '/comment/add' 
        #swagger.responses[200] = {
            description: 'success 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[404] = {
            description: '해당하는 게시글이 존재하지 않을 경우'
        } */
    const Post = (req.body.postType === 'notice') ? Notice : LectureNote;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        post.comments.push({
            user: req.session._id,
            content: req.body.content,
            date: moment()
        });
        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true })
        })
    })
});

router.put('/edit', auth, (req, res)=>{
    /*  #swagger.tags = ['Comment']
        #swagger.path = '/comment/edit' 
        #swagger.responses[200] = {
            description: 'success 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'user가 해당 댓글에 대한 권한이 없을 경우'
        }
        #swagger.responses[404] = {
            description: '해당하는 게시글이 존재하지 않을 경우,
            \n해당하는 댓글이 존재하지 않을 경우'
        } */
    const Post = (req.body.postType === 'notice') ? Notice : LectureNote;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        const targetComment = post.comments[req.body.commentIndex];
        if (targetComment === undefined) return res.status(404).json({
            success: false,
            existComment: false
        })
        if (req.session._id != targetComment.user) {
            return res.status(403).json({
                success: false,
                validUser: false
            });
        }

        targetComment.content = req.body.content;
        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true });
        })
    })
})

router.delete('/delete', auth, (req, res)=>{
    /*  #swagger.tags = ['Comment']
        #swagger.path = '/comment/delete' 
        #swagger.responses[200] = {
            description: 'success 반환'
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우'
        }
        #swagger.responses[403] = {
            description: 'user가 해당 댓글에 대한 권한이 없을 경우'
        }
        #swagger.responses[404] = {
            description: '해당하는 게시글이 존재하지 않을 경우,
            \n해당하는 댓글이 존재하지 않을 경우'
        } */
    const Post = (req.body.postType === 'notice') ? Notice : LectureNote;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        const targetComment = post.comments[req.body.commentIndex];
        if (targetComment === undefined) return res.status(404).json({
            success: false,
            existComment: false
        });
        if (req.session._id != targetComment.user) {
            return res.status(403).json({
                success: false,
                validUser: false
            });
        }
        
        post.comments.splice(req.body.commentIndex, 1);
        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true });
        })
    })
})

module.exports = router;