import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Popup from './util/Popup'

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
`

interface QuizProps {
    socket : any
}

function Index(props :QuizProps) {

    const [popup1, setpopup1] = useState(false);
    const [popup2, setpopup2] = useState(false);
    const [popup3, setpopup3] = useState(false);

    function submitQuiz(){
        setpopup1(false);
    }

    return (
        <QuizContainer>
            <FlexContainer>
                <QuizBox>
                    <span>주관식 퀴즈</span>
                    <SubmitBtn onClick = {()=>{setpopup1(true)}}>제출</SubmitBtn>
                </QuizBox>
                <QuizBox>
                    <span>객관식 퀴즈</span>
                    <SubmitBtn onClick = {()=>{setpopup2(true)}}>제출</SubmitBtn>
                </QuizBox>
                <QuizBox>
                    <span>O/X 퀴즈</span>
                    <SubmitBtn onClick = {()=>{setpopup3(true)}}>제출</SubmitBtn>
                </QuizBox>
            </FlexContainer>
            {popup1 && <Popup socket = {props.socket} setOptions = {submitQuiz}/>}
            {popup2 && <Popup socket = {props.socket} setOptions = {submitQuiz}/>}
            {popup3 && <Popup socket = {props.socket} setOptions = {submitQuiz}/>}
        </QuizContainer>
    )
}

export default Index
