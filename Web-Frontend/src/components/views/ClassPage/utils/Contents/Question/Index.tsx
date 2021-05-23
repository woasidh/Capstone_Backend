import React, { useEffect, useState } from 'react'
import Box from './utils/Box'
import styled from 'styled-components'
import socketio from 'socket.io-client'
import axios from 'axios'

const QuestionContainer = styled.div`
width : 100%;
height : 37vh;
overflow-y : scroll;
::-webkit-scrollbar {
    display: none;
}
`
const ChatContentCnt = styled.div`
width : 100%;
height : 31vh;
overflow-y : scroll;
::-webkit-scrollbar {
    display: none;
}
`
const ChatInputCnt = styled.div`
width : 100%;
height : 5vh;
display : flex;
justify-content : space-between;
align-items : center;
`
const ChatInput = styled.input`
width: 80%;
height : 75%;
border: 1px solid #D4D4D4; 
border-radius: 5px;
padding: 0 0.5rem;
`
const ChatSubmitBtn = styled.button`
font-size :0.8rem;
width : 20%;
text-align : center;
font-weight : bold;
color : #A6C5F3;
`

function Index(props: any) {
    const socket = props.socket;

    const [qNum, setqNum] = useState<number>(0);
    const [inputRef, setinputRef] = useState<any>(React.createRef());

    const [questions, setquestions] = useState<Array<any>>([]);

    function mySubmit() {
        console.log('button');
        const qInput = document.querySelector('#qInput') as HTMLInputElement;
        let val = qInput.value;
        if (qInput.value) {
            setqNum(qNum + 1);
            axios.post('/api/question/create', {
                lectureId: props.lecture_id,
                name: "",
                questionContent: qInput.value
            }).then(res => {
                socket.emit('question', {
                    content: val,
                    qNum: res.data.question._id
                })
                setquestions(questions.concat([<Box qNum={res.data.question._id} socket={socket} msg={val}></Box>]));
            })
        }
        inputRef.current.value = '';
    }

    useEffect(() => {
        axios.put(`/api/lecture/join/${props.lecture_id}`).then(res => {
            let arr: Array<any> = [];
            res.data.lecture.questions.forEach((q: any, idx: any) => {
                console.log(q);
                arr = arr.concat([<Box data={q} qNum={q._id} socket={socket} msg={q.questionContent}></Box>]);
            })
            setquestions(questions.concat(arr));
            setqNum(qNum + arr.length);
        })
    }, [])

    useEffect(() => {
        socket.on('sendQ', (data: any) => {
            console.log(data);
            setquestions(questions.concat([<Box qNum={data.qNum} socket={socket} msg={data.content}></Box>]));
            setqNum(qNum + 1);
        })
    }, [questions])

    return (
        <QuestionContainer>
            <ChatContentCnt>
                {questions}
            </ChatContentCnt>
            <ChatInputCnt>
                <ChatInput ref={inputRef} id="qInput" type="TextArea" placeholder="질문을 입력해주세요" />
                <ChatSubmitBtn onClick={mySubmit}>내전송</ChatSubmitBtn>
            </ChatInputCnt>
        </QuestionContainer>
    )
}

export default Index
