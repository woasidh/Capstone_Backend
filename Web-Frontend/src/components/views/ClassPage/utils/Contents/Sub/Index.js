import { Socket } from 'dgram';
import { REFUSED } from 'dns';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import './style.css'

const SubCnt = styled.div`
width : 100%;
height : 100%;
display : flex;
flex-direction : column;
align-items : center;
`

const SubContentCnt = styled.div`
width : 100%;
height : 30vh;
overflow-y : scroll;
::-webkit-scrollbar {
    display: none;
}
`

const SubInputCnt = styled.div`
width : 100%;
height : 5vh;
display : flex;
justify-content : space-between;
align-items : center;
`

const SubInput = styled.input`
padding: 0 0.5rem;
height : 80%;
width: 80%;
border: 1px solid #D4D4D4; 
border-radius: 5px;
`

const SubSubmitBtn = styled.button`
font-size: 0.8rem;
width : 20%;
text-align : center;
font-weight : bold;
color : #A6C5F3;
`

const SubFlexBox = styled.div`
width : 100%;
height : fit-content;
display : flex;
flex-direction : column;
min-height : 30vh;
`

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = new Recognition();
function Index(props) {
    const socket = props.socket;

    const [flexRef, setflexRef] = useState(React.createRef());
    const [inputRef, setinputRef] = useState(React.createRef());
    const [subContent, setsubContent] = useState("");

    useEffect(() => {
        inputRef.current.total = "";
        socket.on('sendSubtitle', function (data) {
            console.log(data);
            addSub(data.content);
            inputRef.current.total = inputRef.current.total.concat(" " + data.content);
        })
    }, [])

    function addSub(str) {
        console.log("added!");
        const box = document.createElement('div');
        const timeStamp = document.createElement('span');
        const content = document.createElement('span');
        box.setAttribute('class', 'subBox');
        timeStamp.innerHTML = '00:00';
        content.innerHTML = str;
        box.appendChild(timeStamp);
        box.appendChild(content);
        console.log(flexRef.current);
        flexRef.current.appendChild(box);
    }

    function findAnswer(){
        console.log(inputRef.current.value);
        console.log(inputRef.current.total);
        axios.get(`http://3.37.36.54:5000/mrc/${inputRef.current.total}/${inputRef.current.value}`).then(response =>{
            console.log(response);
        })
        inputRef.current.value = '';
    }

    return (
        <SubCnt>
            <SubContentCnt id="chatContentContainer">
                <SubFlexBox ref={flexRef}>
                </SubFlexBox>
            </SubContentCnt>
            <SubInputCnt>
                <SubInput  ref = {inputRef} id="chatInput" type="TextArea" placeholder="질문을 입력해주세요!" />
                <SubSubmitBtn onClick = {findAnswer}>내전송</SubSubmitBtn>
            </SubInputCnt>
        </SubCnt>
    )
}

export default Index
