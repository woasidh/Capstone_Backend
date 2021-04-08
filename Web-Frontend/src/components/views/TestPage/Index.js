import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import './Index.css'
import axios from "axios"
import ZoomInstant from "@zoomus/instantsdk";
import { RenderCanvas, ToggleCanvas, SetCanvasSize } from './utils/SetCanvas/Index'
import Loading from './utils/Loading/Index'
import { generateInstantToken } from './utils/Auth/Index'
import MediaController from './utils/MediaController/Index'

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
`

const ScreenMenuCnt = styled.div`
border : 1px solid black;
flex-basis : 5%;
display : flex;
justify-content : left;
align-items : center;
`

const ScreenMenu = styled.button`
border : 1px solid black;
height : 80%;
width : 120px;
margin : 0 10px;
border-radius : 10px;
&.active{
  background-color : ${props => props.theme.color.blue};
  color : white;
  border : 1px solid ${props => props.theme.color.blue};
}
`

const ZoomScreen = styled.div`
flex-basis : 95%;
position : relative;
`

const RightCnt = styled.div`
flex-basis : 30%;
height : 100%;
border : 1px solid black;
`

function Index(props) {

  //states
  const [isLoading, setisLoading] = useState(true);
  const [screenNum, setscreenNum] = useState(0);
  const [client, setclient] = useState();

  //when entered
  useEffect(() => {
    setisLoading(false);
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

    client.on('active-share-change', async (payload) => {
      console.log('active-share-change');
      const canvas = document.getElementById("canvas1");
      const stream = client.getMediaStream();
      console.log(payload);
      if (payload.state === 'Active') {
        stream.startShareView(canvas, payload.userId);
        console.log('sharing active');
      } else if (payload.state === 'Inactive') {
        await stream.stopShareView().then(response => {
          console.log(response);
        });
      }
    })

    client.on('share-content-dimension-change', payload => {
      console.log('share-content-dimension-change');
      const canvas1 = document.getElementById("canvas1");
      const canvas2 = document.getElementById("canvas2");
      const arr = [canvas1, canvas2];
      arr.forEach((value, index) => {
        const canvas = value;
        const parent = canvas.parentElement;
        const contentWidth = payload.width;
        const contentHeight = payload.height;
        const cntWidth = parent.offsetWidth;
        const cntHeight = parent.offsetHeight;
        console.log(canvas.style);
        if (cntWidth / contentWidth > cntHeight / contentHeight) {
          canvas.style.height = `${cntHeight}px`;
          canvas.style.width = `${cntHeight * contentWidth / contentHeight}px`;
        } else {
          canvas.style.width = `${cntWidth}px`;
          canvas.style.height = `${cntWidth * contentHeight / contentWidth}px`;
        }
      })
    })

    client.on("event_share_content_change", async (payload) => {
      console.log("event_share_content_change");
    });

    client.on("event_passively_stop_share", async (payload) => {
      console.log("event_passively_stop_share");
    });

    /*     client.on("video-active-change", async (payload) => {
          console.log("this is it!!");
          const canvas = document.getElementById("canvas0");
          const stream = client.getMediaStream();
          if (payload.state === "Active") {
    
          } else if (payload.state === "Inactive") {
    
          }
        }); */

    //resize canvas when window resizes
    window.addEventListener('resize', () => {
      const canvas = document.getElementById("canvas0");
      const parent = canvas.parentElement;
      const stream = client.getMediaStream();
      stream.updateVideoCanvasDimension(canvas, parent.offsetWidth, parent.offsetHeight);
      stream.adjustRenderedVideoPosition(canvas, client.getCurrentUserInfo().userId, canvas.width, canvas.height, 0, 0);
    });

  }, [])

  useEffect(() => {
    !isLoading && ToggleCanvas(screenNum);
  }, [screenNum, isLoading])

  useEffect(() => {
    !isLoading && SetCanvasSize();
  }, [isLoading])

  /* async function shareScreenBtn() {
    const stream = client.getMediaStream();
    try {
      const canvas = document.getElementById("canvas1");
      await stream.startShareScreen(canvas);
    } catch (error) {
      console.log(error);
    }
  }

  async function stopShareBtn() {
    const stream = client.getMediaStream();
    try {
      await stream.stopShareScreen();
      console.log("stopsharebtn");
      await stream.stopShareView().then(response => {
        console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  } */

  //render menu buttons
  const RenderMenuBtns = () => {
    const screens = ['내화면', '공유화면', '참가자들'];
    const result = screens.map((value, index) => {
      return (<ScreenMenu onClick={changeScrenBtn} id={index}>{value}</ScreenMenu>);
    })
    return result;
  }

  //change menu controller
  const changeScrenBtn = (e) => {
    setscreenNum(parseInt(e.target.id));
  }

  if (isLoading) return <Loading type="spin" color='orange'></Loading>

  return (
    <MainCnt>
      <LeftCnt>
        <ScreenMenuCnt>
          {RenderMenuBtns()}
        </ScreenMenuCnt>
        <ZoomScreen id="zoomScreen">
          {RenderCanvas()}
          <MediaController client={client} />
        </ZoomScreen>
      </LeftCnt>
      <RightCnt>
        {/* <button onClick={shareScreenBtn}>share screen</button> */}
        <button onClick={() => {
        }}>testing</button>
        {/* <button onClick={stopShareBtn}>stop sharing</button> */}
        <button onClick={() => {
          const canvas = document.getElementById("canvas1");
          console.log(canvas.parentElement);
          canvas.style.height = `${canvas.parentElement.offsetHeight}px`;
          canvas.style.width = '300px';
          console.log(canvas.style.height);
        }}>clear canvas</button>
      </RightCnt>
    </MainCnt>
  )
}

export default Index
