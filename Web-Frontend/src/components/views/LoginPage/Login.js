import './Login.css';
import React, {useEffect, useRef} from 'react';
import {useHistory} from 'react-router';
import styled from 'styled-components';
import logoImg from '../../../images/logo/mainlogo1.png';

import axios from "axios"

const Container = styled.div`
width : 100%;
height : 100%;
display : flex;
justify-content : center;
align-items : center;
background-color : #233044;
`

const GoogleBtn = styled.button`  
  display: block;
  margin: auto;
  background: white;
  color: #444;
  width: auto;
  height: 44px;
  border-radius: 2px;
  border-color: white;
  border: thin solid #888;
  white-space: nowrap;
  margin-bottom: 2.5px;
  padding: 1px;

  &:hover {
    background: #4285F4;
    cursor: pointer;
  }
`;

const header = new Headers();
header.append('Access-Control-Allow-Origin', '*');

function Login() {
  const googleLoginBtn = useRef(null);
  const history = useHistory();

  useEffect(() => {
    googleSDK();
  }, []);


  //SDK 초기 설정 및 내 API초기화
  const googleSDK = () => {
    window.googleSDKLoaded = () => {
      //console.log(window.gapi);
      window.gapi.load("auth2", () => {
        const auth2 = window.gapi.auth2.init({
          client_id:
            "634966437860-qgcmn7q85nm1h9mp12mh2v3rkqrkj3nk.apps.googleusercontent.com",
          scope: "profile email",
        });
        //버튼 클릭시 사용자 정보 불러오기
        auth2.attachClickHandler(
          googleLoginBtn.current,
          {},
          (googleUser) => {
            const profile = googleUser.getBasicProfile();
           
            let user = {
              name : profile.getName(),
              email: profile.getEmail(),
              imgUrl: profile.getImageUrl()
            }
            console.log(user);
            sessionStorage.setItem("userInfo", JSON.stringify(user));
            // const instance = axios.create({
            //   crossDomain: true,
            //   withCredentials: true,
            //   baseURL: 'https://cabstone.ml'
            // });

            axios.get('/api/', { crossDomain: true });

            axios.post('/api/auth/login', {email: user.email})
              .then((response) => {
              const result = response.data;
              console.log(result);
              if(result.userExist===false){
                return history.push("/signup");
              }
              sessionStorage.removeItem("userInfo");
              sessionStorage.setItem("user", JSON.stringify(result.session));
              console.log(result.session);
              return history.push("/main");
            })
            .catch((response) => {
              console.log('Error!');
              console.log(response);
            });
          },
          (error) => {
            alert(JSON.stringify(error, undefined, 2));
          }
        );
      });
    };
    //구글 SDK 불러오기
    (function (d, s, id) {
      let js;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "google-jssdk");
  };



  return (
    <Container>
      <div className="Login">
        <img src={logoImg} alt='LOGO' />
        <GoogleBtn id="gSignInWrapper">
          <span class="label" />
          <div ref={googleLoginBtn} id="customBtn" className="customGPlusSignIn">
            <span className="icon"></span>
            <span className="buttonText">SIGN IN WITH GOOGLE</span>
          </div>
        </GoogleBtn>
      </div>
    </Container>
  );
}

export default Login;