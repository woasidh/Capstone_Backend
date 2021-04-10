import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import Micoff from '../../../../../images/utils/micoff.png'
import Micon from '../../../../../images/utils/micon.png'
import Videooff from '../../../../../images/utils/videooff.png'
import Videoon from '../../../../../images/utils/videoon.png'
import Screenoff from '../../../../../images/utils/screenoff.png'
import Screenon from '../../../../../images/utils/screenon.png'
import axios from 'axios'

const MediaController = styled.div`
width : 100%;
background-color : black;
height : 70px;
position : absolute;
bottom : 0;
display : flex;
justify-content : left;
align-items :center;
`

const AudioController = styled.button`
width : 100px;
height: 100%;
display : flex;
flex-direction : column;
justify-content : center;
align-items : center;
`

const AudioCnt = styled.div`
width : 30px;
height : 30px;
background-image : url(${Micoff});
background-position : center;
background-size : contain;
background-repeat : no-repeat;
`

const VideoController = styled.button`
width : 100px;
height: 100%;
display : flex;
flex-direction : column;
justify-content : center;
align-items : center;
`

const VideoCnt = styled.div`
width : 30px;
height : 30px;
background-image : url(${Videooff});
background-position : center;
background-size : contain;
background-repeat : no-repeat;
`

const ScreenController = styled.button`
width : 100px;
height: 100%;
display : flex;
flex-direction : column;
justify-content : center;
align-items : center;
`

const ScreenCnt = styled.div`
width : 30px;
height : 30px;
background-image : url(${Screenon});
background-position : center;
background-size : contain;
background-repeat : no-repeat;
`

function Index(props) {

    const [isVideoOn, setisVideoOn] = useState(false);
    const [isAudioOn, setisAudioOn] = useState(false);
    const [isShareOn, setisShareOn] = useState(false);
    const [cnt, setcnt] = useState(0);

    async function startVideoBtn() {
        const client = props.client;
        const stream = client.getMediaStream();
        const canvas = document.getElementById("canvas0");
        try {
            if (!stream.isCapturingVideo()) {
                const isCaptureForbidden = stream.isCaptureForbidden();
                console.log(isCaptureForbidden);
                const isCameraTaken = stream.isCameraTaken();
                console.log(isCameraTaken);
                setcnt(cnt + 1);
                await stream.startVideo().then((reponse) => {
                    stream.renderVideo(canvas, client.getCurrentUserInfo().userId, canvas.width, canvas.height, 0, 0, 1).then(response => {
                        console.log("rendering video");
                    })
                })
            }
        } catch (error) {
            console.error(error);
        }
        setcnt(cnt + 1);
    }

    async function stopVideo() {
        const client = props.client;
        const stream = client.getMediaStream();
        const canvas = document.getElementById("canvas0");
        try {
            if (stream.isCapturingVideo()) {
                await stream.stopVideo().then((response) => {
                    stream.stopRenderVideo(canvas, client.getCurrentUserInfo().userId, "", "#222222").then(response => {
                        console.log("stoprenderingvideo");
                    })
                })
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function shareScreen() {
        const client = props.client;
        const stream = client.getMediaStream();
        try {
            const canvas = document.getElementById("canvas1");
            await stream.startShareScreen(canvas);
        } catch (error) {
            console.log(error);
        }
    }

    async function stopShare() {
        const client = props.client;
        const stream = client.getMediaStream();
        try {
            await stream.stopShareScreen();
            console.log("stopsharebtn");
        } catch (error) {
            console.log(error);
        }
    }

    const audioToggleHandler = () => {
        if (isAudioOn) {
            setisAudioOn(false);
        } else {
            setisAudioOn(true);
        }
    }

    const videoToggleHandler = () => {
        if (isVideoOn) {
            setisVideoOn(false);
            stopVideo();
        } else {
            setisVideoOn(true);
            startVideoBtn();
        }
    }

    const screenToggleHandler = () => {
        if (isShareOn) {
            setisShareOn(false);
            stopShare();
        } else {
            setisShareOn(true);
            shareScreen();
        }
    }

    useEffect(() => {
        const audiocnt = document.getElementById("audioCnt");
        const audiotext = document.getElementById("audioText");
        //console.log(audiotext.innerText);
        if (isAudioOn) {
            audiocnt.style.backgroundImage = `url(${Micon})`;
            audiotext.innerText = "Mute";
        } else {
            audiocnt.style.backgroundImage = `url(${Micoff})`;
            audiotext.innerText = "unMute";
        }
    }, [isAudioOn])

    useEffect(() => {
        const videocnt = document.getElementById("videoCnt");
        const videotext = document.getElementById("videoText");
        if (isVideoOn) {
            videocnt.style.backgroundImage = `url(${Videoon})`;
            videotext.innerText = "Stop Video";
        } else {
            videocnt.style.backgroundImage = `url(${Videooff})`;
            videotext.innerText = "Start Video";
        }
    }, [isVideoOn])

    useEffect(() => {
        const screenCnt = document.getElementById("screenCnt");
        const screenText = document.getElementById("screenText");
        if (isShareOn) {
            screenCnt.style.backgroundImage = `url(${Screenoff})`;
            screenText.innerText = "Stop share";
        } else {
            screenCnt.style.backgroundImage = `url(${Screenon})`;
            screenText.innerText = "Share";
        }
    }, [isShareOn])

    return (
        <MediaController>
            <AudioController onClick={audioToggleHandler}>
                <AudioCnt id="audioCnt"></AudioCnt>
                <span id="audioText" style={{ color: '#A8A8A8' }}>Mute</span>
            </AudioController>
            <VideoController onClick={videoToggleHandler}>
                <VideoCnt id="videoCnt" />
                <span id="videoText" style={{ color: '#A8A8A8' }}>Stop Video</span>
            </VideoController>
            <ScreenController onClick={screenToggleHandler}>
                <ScreenCnt id="screenCnt" />
                <span id="screenText" style={{ color: '#A8A8A8' }}>Share</span>
            </ScreenController>
        </MediaController>
    )
}

export default Index
