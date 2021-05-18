import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled, { css } from 'styled-components'
import socketio from 'socket.io-client'
import { RenderCanvas, ToggleCanvas, SetCanvasSize } from '../utils/SetCanvas/Index'
import MediaController from '../utils/MediaController/Index'
import Loading from '../utils/Loading/Index'
import { generateInstantToken } from '../utils/Auth/Index'
import ZoomInstant from "@zoomus/instantsdk"
import Chat from '../utils/Contents/Chat/Index';
import Participant from '../utils/Contents/Participant/Index';
import Question from '../utils/Contents/Question/Index'
import Etc from './util/Etc/Index'
import Comp from './util/Comp/Index.js'
import Sub from './util/Sub/Index'
import Popup from './util/Popup/Index'
import './Index.css'

const MainCnt = styled.div`
background-color : ${props => props.theme.color.background_gray};
padding : 0.5vh;
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
padding : 1vh 1rem;
justify-content : space-between;
background-color : ${props => props.theme.color.background_gray};
`

const ActiveStyle = css`
height : 47vh;
background-color : white;
border-radius : 20px;
box-shadow: 5px 5px #f5f5f5;
display : flex;
flex-direction : column;  
justify-content : space-between;
padding : 2vh 1rem;
`

const Active1Cnt = styled.div`
${ActiveStyle}
`

const Active2Cnt = styled.div`
${ActiveStyle}
`

const ActvieContentCntStyle = css`
flex-basis : 37vh;
position : relative;
background-color : #F9F9F9;
//background-clip: content-box;
padding : 0.5vh 0.5rem;
margin-bottom : 1vh;
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
flex-basis : 4vh;
display : flex;
justify-content : space-between;
`

const Active2Menu = styled.div`
flex-basis : 4vh;
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

const ContentWrapper = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100%;
padding: 0.5rem;
visibility : hidden;
&.active{
  visibility : visible;
}
`

const ContentWrapper2 = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100%;
padding: 0.5rem;
visibility : hidden;
border-radius : 10px;
&.active{
  visibility : visible;
}
`

interface TestProps {
  match: {
    params: {
      class_code: string,
      id: string
    }
  }
}

const socket = socketio('http://disboard13.kro.kr:3000/', {
  transports: ['websocket']
});

const user = sessionStorage.userInfo && JSON.parse(window.sessionStorage.userInfo);
function Index(props: TestProps) {
  //------states------
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [screenNum, setscreenNum] = useState<number>(0);
  const [client, setclient] = useState<any>();
  const [Active1Num, setActive1Num] = useState<number>(1);
  const [Active2Num, setActive2Num] = useState<number>(1);
  const [ref, setref] = useState<any>(React.createRef());
  const [subType, setsubType] = useState<number>(1);
  const [compRef, setcompRef] = useState(React.createRef());

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
    client.join("harry", token, user.email)
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
      //stream.adjustRenderedVideoPosition(canvas, client.getCurrentUserInfo().userId, canvas.width, canvas.height, 0, 0);
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
    setscreenNum(parseInt(e.target.id));
  }

  //change active1 content
  const Active1BtnHandler = (e: any) => {
    setActive1Num(parseInt(e.target.id));
  }
  //change active2 content
  const Active2BtnHandler = (e: any) => {
    setActive2Num(parseInt(e.target.id));
  }

  useEffect(() => {
    const contents = document.querySelectorAll('.content1') as NodeListOf<HTMLElement>;
    contents.forEach((content, index) => {
      content.classList.remove('active');
      if (index == Active1Num - 1) content.classList.add('active');
    })
  }, [Active1Num])

  useEffect(() => {
    const contents = document.querySelectorAll('.content2') as NodeListOf<HTMLElement>;
    contents.forEach((content, index) => {
      content.classList.remove('active');
      if (index == Active2Num - 1) content.classList.add('active');
    })
  }, [Active2Num])

  useEffect(() => {

  }, [])

  useEffect(() => {
    socket.emit('user', {
      name: user ? user.name : props.match.params.class_code,
      code: '1234'
    });
    socket.on('newUser', (data: any) => {
      console.log(data);
    });
  }, [])
  if (isLoading) return <Loading type="spin" color='orange'></Loading>

/*   function setOption(num: number) {
    setsubType(num);
  } */

  function setColor(total: number) {
    console.log(total);
    const ref = document.querySelector('.content2.active#content1') as HTMLElement;
    if (total > 0) {
      ref.style.backgroundColor = `rgb(38, 255, 0, 0.0${total})`;
    } else if (total < 0) {
      ref.style.backgroundColor = `rgb(255, 39, 0, 0.0${total*-1})`;
    }else{
      ref.style.backgroundColor = 'transparent';
    }
  }

  return (
    <MainCnt>
      <LeftCnt>
        <ScreenMenuCnt>
          {RenderMenuBtns()}
        </ScreenMenuCnt>
        <ZoomScreen id="zoomScreen">
          {RenderCanvas()}
          <MediaController client={client}/>
        </ZoomScreen>
      </LeftCnt>
      <RightCnt>
        <Active1Cnt>
          <Active1ContentCnt>
            <ContentWrapper className="content1 active" id="content1"><Participant /></ContentWrapper>
            <ContentWrapper className="content1" id="content2"><Chat socket={socket} /></ContentWrapper>
            <ContentWrapper className="content1" id="content3"><Question socket={socket} /></ContentWrapper>
          </Active1ContentCnt>
          <Active1Menu>
            <ParticipantsBtn className="Active1Btn active" id="1" onClick={Active1BtnHandler}>참가자</ParticipantsBtn>
            <ChatBtn className="Active1Btn" id="2" onClick={Active1BtnHandler}>채팅</ChatBtn>
            <QuestionBtn className="Active1Btn" id="3" onClick={Active1BtnHandler}>질문</QuestionBtn>
          </Active1Menu>
        </Active1Cnt>
        <Active2Cnt>
          <Active2ContentCnt>
            <ContentWrapper2 className="content2 active" id="content1"><Comp setColor={setColor} socket={socket} /></ContentWrapper2>
            <ContentWrapper2 className="content2" id="content2"><Sub socket={socket} type={subType} /></ContentWrapper2>
            <ContentWrapper2 className="content2" id="content3"><Etc socket={socket} /></ContentWrapper2>
          </Active2ContentCnt>
          <Active2Menu>
            <UnderstoodsBtn className="Active2Btn active" id="1" onClick={Active2BtnHandler}>이해도</UnderstoodsBtn>
            <SubtitleBtn className="Active2Btn" id="2" onClick={Active2BtnHandler}>자막</SubtitleBtn>
            <EtcBtn className="Active2Btn" id="3" onClick={Active2BtnHandler}>퀴즈</EtcBtn>
          </Active2Menu>
        </Active2Cnt>
      </RightCnt>
      {/* <Popup setOptions={setOption} /> */}
    </MainCnt>
  )
}

export default Index
