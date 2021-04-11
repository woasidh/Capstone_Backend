import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { RenderCanvas, ToggleCanvas, SetCanvasSize } from './utils/SetCanvas/Index'
import MediaController from './utils/MediaController/Index'
import Loading from './utils/Loading/Index'
import { generateInstantToken } from './utils/Auth/Index'
import ZoomInstant from "@zoomus/instantsdk";
import './Index.css'

const MainCnt = styled.div`
background-color : ${props => props.theme.color.background_gray};
padding : 0.5rem;
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
flex-basis : 5%;
display : flex;
justify-content : left;
align-items : center;
background-color : ${props => props.theme.color.background_gray};
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
display : flex;
flex-direction : column;
padding : 1rem 2rem;
justify-content : space-between;
background-color : ${props => props.theme.color.background_gray};
`

const ActiveStyle = css`
flex-basis : 49%;
background-color : white;
border-radius : 20px;
box-shadow: 5px 5px #f5f5f5;
display : flex;
flex-direction : column;  
justify-content : space-between;
padding : 1rem;
`

const Active1Cnt = styled.div`
${ActiveStyle}
`

const Active2Cnt = styled.div`
${ActiveStyle}
`

const ActvieContentCntStyle = css`
flex-basis :85%;
position : relative;
`

const Active1ContentCnt = styled.div`
${ActvieContentCntStyle}
`
const Active2ContentCnt = styled.div`
${ActvieContentCntStyle}
`

const ActiveContentStyle = css`
position : absolute;
width : 100%;
height : 100%;
`

const ParticipantsContent = styled.div`
${ActiveContentStyle}
background-color : pink;
`

const ChatContent = styled.div`
${ActiveContentStyle}
background-color : blue;
`

const QuestionContent = styled.div`
${ActiveContentStyle}
background-color : red;
`

const UnderstoodContent = styled.div`
${ActiveContentStyle}
background-color : pink;
`

const SubtitleContent = styled.div`
${ActiveContentStyle}
background-color : blue;
`

const EtcContent = styled.div`
${ActiveContentStyle}
background-color : red;
`

const Active1Menu = styled.div`
flex-basis : 10%;
display : flex;
justify-content : space-between;
`

const Active2Menu = styled.div`
flex-basis : 10%;
display : flex;
justify-content : space-between;
`

const constActiveBtnStyle = css`
border-radius : 5px;
flex-basis : 30%;
background-color : ${props => props.theme.color.light_gray};
color : ${props => props.theme.color.font_light_gray};
&.active{
  background-color : ${props => props.theme.color.dark_gray};
  color : ${props => props.theme.color.font_dark_gray};
}
`

const ParticipantsBtn = styled.button`
${constActiveBtnStyle}
`

const ChatBtn = styled.button`
${constActiveBtnStyle}
`

const QuestionBtn = styled.button`
${constActiveBtnStyle}
`

const UnderstoodsBtn = styled.button`
${constActiveBtnStyle}
`

const SubtitleBtn = styled.button`
${constActiveBtnStyle}
`

const EtcBtn = styled.button`
${constActiveBtnStyle}
`

interface TestProps {
  match: {
    params: {
      id: number
    }
  }
}

function IndexT(props: TestProps) {

  //------states------
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [screenNum, setscreenNum] = useState<number>(0);
  const [client, setclient] = useState<any>();
  const [Active1Num, setActive1Num] = useState<number>(1);
  const [Active2Num, setActive2Num] = useState<number>(1);

  //------useeffect------

  //zoom init
  useEffect(() => {
    setisLoading(true);
    const client = ZoomInstant.createClient();
    client.init("en-US", `${window.location.origin}/lib`);
    const token = generateInstantToken(
      "BkxDIpVzJ3wIa0Wwt7HIGg9hdMeit8qtg5BL",
      "RgEUnU0BDoSEozxsw8ySNWs8C0WvTfpDsUxA",
      "harry"
    );
    console.log(props.match.params.id);
    client.join("harry", token, props.match.params.id.toString())
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
      const canvas = document.getElementById("canvas1") as HTMLCanvasElement;;
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
      const canvas1 = document.getElementById("canvas1") as HTMLCanvasElement;
      const arr = [canvas1];
      arr.forEach((value, index) => {
        const canvas = value;
        const parent = canvas.parentElement as HTMLElement;
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

    //resize canvas when window resizes
    window.addEventListener('resize', () => {
      const canvas = document.getElementById("canvas0") as HTMLCanvasElement;;
      const parent = canvas.parentElement as HTMLElement;
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

  //for Active 1 
  useEffect(() => {
    const contents: NodeListOf<Element> = document.querySelectorAll('.Active1Content');
    contents.forEach((content: Element, idx) => {
      content.setAttribute("style", "display : none;")
      if (parseInt(content.id) === Active1Num)
        content.setAttribute("style", "display : block;")
    })
    const buttons = document.querySelectorAll('.Active1Btn');
    buttons.forEach((button: Element, idx) => {
      button.classList.remove('active');
      if (parseInt(button.id) === Active1Num) button.classList.add('active');
    })
  }, [Active1Num])

  //for Active 2
  useEffect(() => {
    const contents = document.querySelectorAll('.Active2Content');
    contents.forEach((content, idx) => {
      content.setAttribute("style", "display : none;")
      if (parseInt(content.id) === Active2Num)
        content.setAttribute("style", "display : block;")
    })
    const buttons = document.querySelectorAll('.Active2Btn');
    buttons.forEach((button, idx) => {
      button.classList.remove('active');
      if (parseInt(button.id) === Active2Num) button.classList.add('active');
    })
  }, [Active2Num])

  //------rendering------
  //render screen button handler
  const RenderMenuBtns = () => {
    const screens = ['내화면', '공유화면', '참가자들'];
    const result = screens.map((value, index) => {
      return (<ScreenMenu onClick={changeScrenBtn} id={index.toString()}>{value}</ScreenMenu>);
    })
    return result;
  }

  //------handler------
  //change screen handler
  const changeScrenBtn = (e: any) => {
    console.log(e);
    setscreenNum(parseInt(e.target.id));
  }

  //change active1 content
  const Active1BtnHandler = (e: any) => {
    console.log(e);
    setActive1Num(parseInt(e.target.id));
  }
  //change active2 content
  const Active2BtnHandler = (e: any) => {
    setActive2Num(parseInt(e.target.id));
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
        <Active1Cnt>
          <Active1ContentCnt>
            <ParticipantsContent className="Active1Content" id="1"></ParticipantsContent>
            <ChatContent className="Active1Content" id="2"></ChatContent>
            <QuestionContent className="Active1Content" id="3"></QuestionContent>
          </Active1ContentCnt>
          <Active1Menu>
            <ParticipantsBtn className="Active1Btn active" id="1" onClick={Active1BtnHandler}>참가자</ParticipantsBtn>
            <ChatBtn className="Active1Btn" id="2" onClick={Active1BtnHandler}>채팅</ChatBtn>
            <QuestionBtn className="Active1Btn" id="3" onClick={Active1BtnHandler}>질문</QuestionBtn>
          </Active1Menu>
        </Active1Cnt>
        <Active2Cnt>
          <Active2ContentCnt>
            <UnderstoodContent className="Active2Content" id="1"></UnderstoodContent>
            <SubtitleContent className="Active2Content" id="2"></SubtitleContent>
            <EtcContent className="Active2Content" id="3"></EtcContent>
          </Active2ContentCnt>
          <Active2Menu>
            <UnderstoodsBtn className="Active2Btn active" id="1" onClick={Active2BtnHandler}>이해도</UnderstoodsBtn>
            <SubtitleBtn className="Active2Btn" id="2" onClick={Active2BtnHandler}>자막</SubtitleBtn>
            <EtcBtn className="Active2Btn" id="3" onClick={Active2BtnHandler}>작업</EtcBtn>
          </Active2Menu>
        </Active2Cnt>
        <button onClick={() => {
          const stream = client.getMediaStream();
          const canvas = document.getElementById("canvas1");
          console.log("share screen");
          stream.startShareScreen(canvas);
          console.log("share screen");
        }}>share screen</button>
      </RightCnt>
    </MainCnt>
  )
}

export default IndexT
