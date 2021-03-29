import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { KJUR } from "jsrsasign";
import './Index.css'
import axios from "axios"
import ZoomInstant from "@zoomus/instantsdk";
import { RenderCanvas, ToggleCanvas, SetCanvasSize } from './utils/SetCanvas/Index'
import Loading from './utils/Loading/Index'
const MainCnt = styled.div`
padding : 0.7rem;
display : flex;
height : 100%;
`

const LeftCnt = styled.div`
flex-basis : 70%;
display : flex;
flex-direction : column;
height : 100%;
border : 1px solid black;
`

const ScreenMenuCnt = styled.div`
border : 1px solid black;
flex-basis : 5%;
display : flex;
justify-content : left;
align-items : center;
`

const ScreenMenu = styled.button`
height : 80%;
width : 120px;
margin : 0 10px;
border : 1px solid black;
border-radius : 10px;
`

const ZoomScreen = styled.div`
border : 1px solid black;
flex-basis : 95%;
position : relative;
`

const RightCnt = styled.div`
flex-basis : 30%;
height : 100%;
border : 1px solid black;
`

function Index(props) {

  //resize canvas when window resizes
  window.addEventListener('resize', () => {
    SetCanvasSize();
  });

  //states
  const [isLoading, setisLoading] = useState(true);
  const [screenNum, setscreenNum] = useState(0);
  const [client, setclient] = useState();

  //when entered
  useEffect(() => {
    setisLoading(true);
    const client = ZoomInstant.createClient();
    client.init("en-US", `${window.location.origin}/lib`);
    const token = generateInstantToken(
      "BkxDIpVzJ3wIa0Wwt7HIGg9hdMeit8qtg5BL",
      "RgEUnU0BDoSEozxsw8ySNWs8C0WvTfpDsUxA",
      "harry"
    );
    client.join("harry", token, props.match.params.id)
      .then(() => {
        console.log("Successfully joined a session.");
        setclient(client);
        setisLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

    client.on("connection-change", (payload) => {
      if (payload.state === "Connected") {
        console.log("connected!");
      } else {
        console.log("connected other");
      }
    });

    client.on('active-share-change', payload => {
      console.log(payload);
      const stream = client.getMediaStream();
      if (payload.state === 'Active') {
        console.log(stream.getReceivedVideoDimension());
        const canvas = document.getElementById("canvas1");
        stream.startShareView(canvas, payload.userId);
        console.log('sharing active');
      } else if (payload.state === 'Inactive') {
        console.log('sharing inactive');
      }
    })

    client.on('share-content-dimension-change',payload=>{
      const canvas = document.getElementById("canvas1");
      const parent = canvas.parentElement;
      canvas.style.width = `${parent.offsetWidth}px`;
      canvas.style.height = `${parent.offsetHeight}px`; 
     })

    client.on("video-active-change", async (payload) => {
      console.log("this is it!!");
      const stream = client.getMediaStream();
      if (payload.state === "Active") {
        const videoQuality = 2;
        const canvas = document.getElementById("canvas0");
        console.log(stream.getReceivedVideoDimension());
        console.log(canvas.width);
        await stream.renderVideo(canvas, payload.userId, canvas.width, canvas.height, 0, 0, 1).then(response => {
          console.log('on active change');
          console.log(response);
        })
      } else if (payload.state === "Inactive") {
        console.log('video inactive');
      }
    });
  }, [])

  //generating token
  function generateInstantToken(sdkKey, sdkSecret, topic, password = "") {
    let signature = "";
    const iat = Math.round(new Date().getTime() / 1000);
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };
    const oPayload = {
      app_key: sdkKey,
      iat,
      exp,
      tpc: topic,
      pwd: password,
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
    return signature;
  }


  useEffect(() => {
    !isLoading && ToggleCanvas(screenNum);
  }, [screenNum, isLoading])

  useEffect(() => {
    !isLoading && SetCanvasSize();
  }, [isLoading])


  async function joinBtn() {
    const stream = client.getMediaStream();
    try {
      const newCameraDeviceId = stream.getCameraList()[0];
      await stream.startVideo();
    } catch (error) {
      console.log(error);
    }
  }

  async function startVideoBtn() {
    const stream = client.getMediaStream();
    try {
      const newCameraDeviceId = stream.getCameraList()[0];
      await stream.startVideo();
    } catch (error) {
      console.log(error);
    }
  }

  async function stopVideo() {
    const stream = client.getMediaStream();
    try {
      await stream.stopVideo();
    } catch (error) {
      console.log(error);
    }
  }

  async function shareScreenBtn() {
    const stream = client.getMediaStream();
    try {
      const canvas = document.getElementById("canvas2");
      stream.startShareScreen(canvas);
    } catch (error) {
      console.log(error);
    }
  }

  async function getUsrInfoBtn() {
    console.log(client.getCurrentUserInfo());
  }

  //render menu buttons
  const RenderMenuBtns = () => {
    const screens = ['화면1', '화면2', '화면3'];
    const result = screens.map((value, index) => {
      return (<ScreenMenu onClick={changeScrenBtn} id={index}>{value}</ScreenMenu>);
    })
    return result;
  }


  //change menu controller
  const changeScrenBtn = (e) => {
    setscreenNum(parseInt(e.target.id));
  }

  if(isLoading) return <Loading type = "spin" color = 'orange'></Loading>

  return (
    <MainCnt>
      <LeftCnt>
        <ScreenMenuCnt>
          {RenderMenuBtns()}
        </ScreenMenuCnt>
        <ZoomScreen id="zoomScreen">
          {RenderCanvas()}
        </ZoomScreen>
      </LeftCnt>
      <RightCnt>
        <button onClick={startVideoBtn}>start video</button>
        <button onClick={stopVideo}>stop video</button>
        <button onClick={shareScreenBtn}>share screen</button>
        <button onClick={() => {
          console.log(client);
        }}>check client</button>
        <button onClick = {()=>{
          const canvas = document.getElementById("canvas0");
          console.log(canvas.width);
          console.log(canvas.height);
          console.log("canvas");
        }}>check canvas size</button>
      </RightCnt>
    </MainCnt>
  )
}

export default Index
