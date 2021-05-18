import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Progress } from 'antd';
import moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";



const Container = styled.div`
width: 100%;
display: block;
justify-content: center;
align-items: center;
`
const Title = styled.div`
font-size: 30px;
font-style: italic;
text-alignment: left;
`
const SubTitle = styled.div`
font-size: 16px;
display: inline-block;
color: ${props => props.theme.color.font_dark_gray};
`

const WriteBtn = styled.button`
display: inline-block;
float: right;
background-color: ${props => props.theme.color.blue};
color: white;
font-size: 16px;
width: 80px; /* 원하는 너비설정 */
margin-right: 5px;
padding: 5px; /* 여백으로 높이 설정 */
border-radius: 5px;
`
const SelectCust = styled.select`
font-size: 16px;
width: 80px; /* 원하는 너비설정 */
margin-right: 5px;
padding: 5px; /* 여백으로 높이 설정 */
//font-family: inherit;  /* 폰트 상속 */
border-radius: 5px;
-webkit-appearance: none; /* 네이티브 외형 감추기 */
-moz-appearance: none;
appearance: none;
`
const Box = styled.td`
background: white;
border-radius: 10px;
padding: 20px;
box-shadow: 3px 5px 5px 3px #f5f5f5;
`
const BoxTitle = styled.div`
font-size: 16px;
font-weight: 700;
display: block;
margin-bottom: 5px;
text-align: left;
`
const Icon = styled.img`
max-height: 14px;
max-width: 14px;
`
const BoxText = styled.div`
display: inline-block;
font-size: 14px;
font-weight: normal;
`
const NumText = styled.div`
display: inline-block;
font-size: 24px;
font-weight: 700;
`

function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;
    
    const isProfessor = (user.type === "professor");
    const isAll = String(subjectId) == "all" ? true : false;

    const [isLoading, setIsLoading] = useState(true);

    const [subjectList, setSubjectList] = useState([]);
    const [lectureList, setLectureList] = useState([]);
    const [studentNameList, setStudentNameList] = useState([]);
    const [dayList, setDayList] = useState([]);

    const [attendance, setAttendance] = useState(0);
    const [absence, setAbsence] = useState(0);;
    const [late, setLate] = useState(0);

    const getData = () => {
    }
 
    const onChangeSubject = () => {

    }

    const onChangeStudent = () => {

    }
    
    const onChangeDay = () => {
        
    }

    

    const display = () => {
        return(
        <div>
            <Title>Lecture Chart</Title>
            {isAll ?
            <> 
            <SubTitle>출결 관리</SubTitle>
            <div style={{display: "inline-block", float:"right"}}>
                <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeSubject}>
                    {subjectList.map((value, index) => <option>{value}</option> )}
			    </SelectCust>
            </div>
            </> : <>
            <SubTitle>내 강의 / <a style={{color: "inherit"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 출석</SubTitle>
            {isProfessor && <div style={{display: "inline-block", float:"right"}}>
                <WriteBtn>엑셀 추출</WriteBtn>
				<SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
                    {studentNameList.map((value, index) => <option>{value}</option> )}
				</SelectCust>
                <SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white"}} onChange={onChangeDay}>
                    {dayList.map((value, Index) => <option value={value}>{moment(value).format('M월 DD일')}</option>)}
				</SelectCust>
			</div>}
            </>}
            <hr style={{width: "100%", margin: "15px auto", marginBottom: "0px"}}/>
            <table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate", margin: "0px auto"}}>
                <tr>
                <Box style={{width: "48%", marginRight: "5px"}}>
                    <BoxTitle>출결 현황</BoxTitle>
                    <div style={{padding: "10px", display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Progress type="circle" percent={30} format={percent => `${percent}/${17} 주`} style={{marginRight: "30px"}}/>
                        <div style={{width: "50%", margin: "5px", display: 'inline-block', marginLeft: "30px"}}>
                            <div style={{borderBottom: "1px dotted black", padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiMxNzgyZDIiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjMWU3OGJiIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 출석</BoxText>
                                <NumText>{attendance} <BoxText>건</BoxText></NumText>
                            </div>
                            <div style={{borderBottom: "1px dotted black", padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiM1NWMyNmYiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjNDlhYjYxIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 지각</BoxText>
                                <NumText>{late} <BoxText>건</BoxText></NumText>
                            </div>
                            <div style={{padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText style={{width: "50px", textAlign: "left"}}><Icon src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDU1LjExMSA0NTUuMTExIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTUuMTExIDQ1NS4xMTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6I0UyNEM0QjsiIGN4PSIyMjcuNTU2IiBjeT0iMjI3LjU1NiIgcj0iMjI3LjU1NiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0QxNDAzRjsiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMw0KCWMzOC40LDMxLjI4OSw4OC4xNzgsNDkuNzc4LDE0Mi4yMjIsNDkuNzc4YzEyNS4xNTYsMCwyMjcuNTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NmMwLTU0LjA0NC0xOC40ODktMTAzLjgyMi00OS43NzgtMTQyLjIyMg0KCUM0MjIuNCw5MS4wMjIsNDU1LjExMSwxNTUuMDIyLDQ1NS4xMTEsMjI3LjU1NnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzMxLjM3OCwzMzEuMzc4Yy04LjUzMyw4LjUzMy0yMi43NTYsOC41MzMtMzEuMjg5LDBsLTcyLjUzMy03Mi41MzNsLTcyLjUzMyw3Mi41MzMNCgljLTguNTMzLDguNTMzLTIyLjc1Niw4LjUzMy0zMS4yODksMGMtOC41MzMtOC41MzMtOC41MzMtMjIuNzU2LDAtMzEuMjg5bDcyLjUzMy03Mi41MzNsLTcyLjUzMy03Mi41MzMNCgljLTguNTMzLTguNTMzLTguNTMzLTIyLjc1NiwwLTMxLjI4OWM4LjUzMy04LjUzMywyMi43NTYtOC41MzMsMzEuMjg5LDBsNzIuNTMzLDcyLjUzM2w3Mi41MzMtNzIuNTMzDQoJYzguNTMzLTguNTMzLDIyLjc1Ni04LjUzMywzMS4yODksMGM4LjUzMyw4LjUzMyw4LjUzMywyMi43NTYsMCwzMS4yODlsLTcyLjUzMyw3Mi41MzNsNzIuNTMzLDcyLjUzMw0KCUMzMzkuOTExLDMwOC42MjIsMzM5LjkxMSwzMjIuODQ0LDMzMS4zNzgsMzMxLjM3OHoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K"/> 결석</BoxText>
                                <NumText>{absence} <BoxText>건</BoxText></NumText>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box style={{width: "48%"}}>
                    <BoxTitle>이번달 출결 현황</BoxTitle>
                    <BoxTitle>이번주 출결 현황</BoxTitle>
                </Box>
                </tr>
                <tr>
                    <Box style={{width: "100%", marginLeft: "5px"}} colSpan="2">
                        <BoxTitle>출결 상태</BoxTitle>
                        <BoxText style={{display: "block", float: 'right'}}>출석 <NumText style={{color: "#0E7ED1"}}> {attendance}</NumText>회 / 지각 <NumText style={{color: "#61C679"}}> {late}</NumText>회 / 결석 <NumText style={{color: "#E24C4B"}}> {absence}</NumText>회</BoxText>
                    </Box>
                </tr>
            </table>
        </div>

            
        );
    }

    useEffect(() => {
        getData();
        
    },[])

    return(
        <Container>
            {isLoading && display()}
        </Container>                
    );
}

export default Index;