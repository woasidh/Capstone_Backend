import { REFUSED } from 'dns';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './style.css'

const SubContainer = styled.div`
height : 36vh;
overflow-y : scroll;
::-webkit-scrollbar {
    display: none;
}
`

const SubFlexBox = styled.div`
display : flex;
flex-direction : column;
`

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = new Recognition();
function Index() {

    const [recognition, setrecognition] = useState();
    const [flexRef, setflexRef] = useState(React.createRef());

    useEffect(() => {
        rec.lang = 'ko-KR';
        rec.continuous = true;
        rec.interimResults = false;
        rec.maxAlternative = 1;

        rec.onspeechend = () => {
            console.log('stopped');
        };
        rec.onnomatch = event => {
            console.log('no match');
        };
        rec.onstart = () => {
            console.log('started');
        };
        rec.onend = () => {
            console.log('end');
            stopListen();
            startListen();
        };
        rec.onerror = event => {
            console.log('error', event);
        };
        rec.onresult = event => {
            const text = event.results[event.results.length-1][0].transcript;
            console.log('transcript', text);
            addSub(text);
        };
    }, [])

    function startListen() {
        rec.start();
    }

    function stopListen() {
        rec.stop();
    }

    function addSub(str){
        const box = document.createElement('div');
        const timeStamp = document.createElement('span');
        const content = document.createElement('span');
        box.setAttribute('class', 'subBox');
        timeStamp.innerHTML = '00:00';
        content.innerHTML = str;
        box.appendChild(timeStamp);
        box.appendChild(content);
        flexRef.current.appendChild(box);
    }

    return (
        <SubContainer>
            <SubFlexBox ref = {flexRef}>
            </SubFlexBox>
            <button style ={{width : '200px', height : '50px', backgroundClip : 'black'}} onClick = {startListen}></button>
        </SubContainer>
    )
}

export default Index
