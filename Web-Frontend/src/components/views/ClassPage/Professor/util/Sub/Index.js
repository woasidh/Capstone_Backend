import { REFUSED } from 'dns';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './style.css'

const SubContainer = styled.div`
height : 30vh;
overflow-y : scroll;
::-webkit-scrollbar {
    display: none;
}
`

const SubFlexBox = styled.div`
display : flex;
flex-direction : column;
`

const ControlBox = styled.div`
margin-top :1vh;
height : 5vh;
width : 100%;
display : flex;
justify-content : left;
`

const PlayBtn = styled.button`
width : 30%;
border : 1px solid black;
line-height : 5vh;
`

const StopBtn = styled.button`
width : 30%;
border : 1px solid black;
line-height : 5vh;
`

const Listen = styled.div`
text-align : center;
width : 30%;
border : 1px solid black;
line-height : 5vh;
`


const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = new Recognition();
function Index(props) {
    const socket = props.socket;
    const type = props.type;

    const [flexRef, setflexRef] = useState(React.createRef());
    const [isListening, setisListening] = useState(true);

    useEffect(() => {
        console.log(props);
    }, [])

    useEffect(() => {
        rec.lang = 'ko-KR'
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
            /* if (isListening) startListen(); */
        };
        rec.onerror = event => {
            console.log('error', event);
        };
        rec.onresult = event => {
            console.log('onresult');
            let text = event.results[event.results.length - 1][0].transcript;
            console.log(text);
            if (text.charAt(0) == ' ') text = text.substring(1, text.length);
            addSub(text);
            socket.emit('subtitle', {
                time : '11:11',
                content : text
            })
        };
    }, [])

    useEffect(() => {
        rec.start();
    }, [])

    function startListen(){
        rec.start();
    }

    function stopListen() {
        rec.stop();
    }

    function addSub(str) {
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
        <>
            <SubContainer>
                <SubFlexBox ref={flexRef}>
                </SubFlexBox>
            </SubContainer>
            <ControlBox>
                {!isListening && <PlayBtn onClick={startListen}>녹음</PlayBtn>}
                {isListening &&
                    <>
                        <Listen>녹음중...</Listen>
                        <StopBtn onClick={stopListen}>중지</StopBtn>
                    </>
                }
            </ControlBox>
        </>
    )
}

export default Index
