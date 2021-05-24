import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Popup from './util/Popup'
import axios from 'axios'
import './style.css'

const QuizContainer = styled.div`
height : 36vh;
width : 100%;
`

const FlexContainer = styled.div`
width : 100%;
display : flex;
flex-direction : column;
justify-content : center;
align-items : center;
`

const QuizBox = styled.div`
position : relative;
width : 95%;
margin-bottom : 1vh;
height : 6vh;
border : 1px solid #70707090;
border-radius : 4px;
display : flex;
justify-content : space-between;
align-items : center;
padding : 5px 10px;
font-size : 0.9rem;
color : #707070;
`

const SubmitBtn = styled.button`
width : 20%;
border : 1px solid #70707090;
border-radius : 4px;
height : 90%;
z-index : 99;
`

const Background = styled.div`
z-index : 98;
height : 100%;
position: absolute;
background-color: #ddfab1;
left : 0;
border-radius : 4px;
&.active{
    animation-name: slidein;
    animation-duration: 5s;
}
`

interface QuizProps {
    socket: any
}

function Index(props: QuizProps) {

    const socket = props.socket;

    const [popup, setpopup] = useState(false);
    const [isListening, setisListening] = useState(false);
    const [listeningTime, setlisteningTime] = useState(0);
    const [quizType, setquizType] = useState(0);
    const [backRef, setBackRef] = useState(React.createRef());

    function submitQuiz(e: any) {
        if (isListening) {
            alert('퀴즈가 진행중입니다!');
            return;
        }
        setquizType(e.target.parentNode.id);
        setpopup(true);
    }

    function renderQuizTypes() {
        const names = ['주관식 퀴즈', '객관식 퀴즈', 'OX 퀴즈'];
        return names.map((name, idx) => (
            <QuizBox className="quizTypes" id={(idx + 1).toString()}>
                <span style={{ zIndex: 99 }}>주관식 퀴즈</span>
                <SubmitBtn onClick={submitQuiz}>제출</SubmitBtn>
                <Background id="quizBackground"></Background>
            </QuizBox>
        ))
    }

    function set(time: number) {
        setpopup(false);
        setisListening(true);
        setTimeout(() => {
            setisListening(false);
        }, time * 60000);
        setlisteningTime(time * 60);
        const quizBackground = document.querySelectorAll('#quizBackground')[quizType - 1] as HTMLElement;
        quizBackground.style.animationName = 'slidein';
        quizBackground.style.animationDuration = `${time * 60}s`;
    }

    return (
        <QuizContainer>
            <FlexContainer>
                {renderQuizTypes()}
            </FlexContainer>
            {popup && <Popup type={quizType} socket={props.socket} setOptions={(time: number) => {
                set(time);
            }} />}
        </QuizContainer>
    )
}

export default Index
