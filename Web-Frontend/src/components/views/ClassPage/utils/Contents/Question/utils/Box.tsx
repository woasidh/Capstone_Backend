import axios from 'axios';
import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

interface QuestionProps {
    data?: any
    msg: string
    socket: any
    qNum: number
}

const BoxContainer = styled.button`
position : relative;
background-color : #E5166835;
padding : 5px 10px;
border-radius : 5px;
color : white;
width : fit-content;
font-weight : 600;
font-size : 12px;
margin-bottom : 10px;
word-break : break-all;
text-align : left;
`

const AnswerShort = styled.div`
color : #4B9F1B;
width : 100%;
text-align :right;
font-size : 0.6rem;
`

const AnswerBox = styled.div`
display : flex;
flex-direction : column;
`

const Answer = styled.div`
margin-top : 5px;
width : fit-content;
font-size : 10px;
color : black;
text-align : left;
::before{
    content : "-";
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
height : 70%;
width: 80%;
border: 1px solid #D4D4D4;
padding : 0 5px; 
border-radius: 5px;
color : black;
`
const ChatSubmitBtn = styled.button`
font-size :0.8rem;
width : 20%;
text-align : center;
font-weight : bold;
color : #00000050;
`

function showAnswers() {

}

function Box(props: QuestionProps) {

    const socket = props.socket;

    const [showAnswer, setshowAnswer] = useState<boolean>(false);
    const [answers, setanswers] = useState<Array<any>>([]);
    const [boxRef, setboxRef] = useState<any>(React.createRef());
    const [inputRef, setinputRef] = useState<any>(React.createRef());

    useEffect(() => {
        if (showAnswer) {
            boxRef.current.style.width = '100%';
        } else {
            boxRef.current.style.width = 'fit-content';
        }
    }, [showAnswer])

    useEffect(() => {
        let arr:Array<any> = [];
        props.data && props.data.answers.forEach((answer: any, idx: any) => {
            console.log(answer);
            arr = arr.concat([<Answer>{answer.content}</Answer>]);
        })
        setanswers(answers.concat(arr));
    }, [])

    function showAnswers(e: any) {
        console.log(answers);
        e.stopPropagation();
        if (showAnswer) setshowAnswer(false);
        else setshowAnswer(true);
    }

    function stopProp(e: any) {
        console.log('fuck');
        e.stopPropagation();
    }

    function mySubmit() {
        socket.emit('answer', {
            qNum: props.qNum,
            content: inputRef.current.value
        })
        setanswers(answers.concat([<Answer>{inputRef.current.value}</Answer>]));
        axios.put('/api/question/reply',{
            questionId : props.qNum,
            respondent: "",
            content: inputRef.current.value
        })
        console.log(props.qNum);
        inputRef.current.value = '';
    }

    function keyDown(e: any) {
        if (e.keyCode == 32) return;
    }

    useEffect(() => {
        socket.on('sendA', (data: any) => {
            console.log(data);
            if (props.qNum == data.qNum) {
                setanswers(answers.concat([<Answer>{data.content}</Answer>]));
            }
        })
    }, [answers])
    return (
        <>
            <BoxContainer ref={boxRef}>
                <div style={{ fontSize: '1rem' }} id="Boxcontainer" onClick={showAnswers}>
                    {props.msg}
                    {showAnswer && <AnswerBox>
                        {answers}
                    </AnswerBox>}
                </div>
                <AnswerShort>답변{answers.length}</AnswerShort>
                {
                    showAnswer && <ChatInputCnt onClick={stopProp} onKeyDown={keyDown}>
                        <ChatInput ref={inputRef} onClick={stopProp} id="chatInput" type="TextArea" placeholder="답변을 입력해주세요" />
                        <ChatSubmitBtn onClick={mySubmit}>내전송</ChatSubmitBtn>
                    </ChatInputCnt>
                }
            </BoxContainer>
        </>
    )
}
export default Box
