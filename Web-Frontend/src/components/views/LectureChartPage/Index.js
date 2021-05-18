import { useEffect, useState } from 'react';
import axios from 'axios';
import styled, {css} from 'styled-components';
import moment from 'moment';
import 'antd/dist/antd.css';
import { Select, Progress } from 'antd';
import { Line, Bar } from "react-chartjs-2";

const {Option} = Select;

const Container = styled.div`
width : 97%;
height : 100%;
display : inline-block;
//overflow-y: auto;
//align-items : center;
//justify-content : center;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 40px;
line-height : 40px;
font-style : italic;
`
const SubTitle = styled.div`
float: left;
margin-top: 3px;
margin-right: 20px;
color : #8b8b8b;
font-size : 13px;
font-weight: 400;
`
const BoxTitle = styled.div`
display: inline-block;
margin-right: 10px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NumTitle = styled.div`
margin: 10px 0px;
color : #757575;
font-size : 30px;
font-weight: bold;
`

const RateBox = css`
text-align: center;
border-radius:5px;
padding : 5px;
font-size : 12px;
display : inline;
bottom : 0px;
`
const RateBoxRed = styled.div`
${RateBox}
color : #f44a4b;
background : #feeceb;
`
const RateBoxGreen = styled.div`
${RateBox}
color : #4caf54;
background : #edf7ed;
`
const InfoBox = styled.div`
margin-left : 5px;
font-size : 12px;
color : #757575;
display : inline;
`
const DayBox = styled.div`
background : #407AD6;
color : white;
//display : inline-block;
border-radius: 5px;
padding: 5px;
float: right;
top: 0;
`

const Box = styled.td`
background: white;
border-radius: 5px;
padding: 10px;
box-shadow: 5px 5px #f5f5f5;
margin: 10px;
`
const SelectCust = styled.select`
font-size: 16px;
width: 80px; /* 원하는 너비설정 */
margin-right: 5px;
padding: 3px; /* 여백으로 높이 설정 */
//font-family: inherit;  /* 폰트 상속 */
border-radius: 5px; /* iOS 둥근모서리 제거 */
-webkit-appearance: none; /* 네이티브 외형 감추기 */
-moz-appearance: none;
appearance: none;
`
function LineChart ({studentData, averageData, studentName}){
   const lineData = {
      labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      datasets: [
        {
         label: studentName,
         data: studentData,
         lineTension: 0.5,
         backgroundColor: "rgba(15, 107, 255, 0.1)",
         borderWidth: 1,
         borderColor: "#0f6bff",
         fill: false,
        },
        {
         label: "Average",
         data: averageData,
         lineTension: 0.5,
         backgroundColor: "rgba(242, 184, 113, 0.1)",
         borderWidth: 1,
         borderColor: "#f2b471",
         fill: false,
        },
      ],
     };
     
   const lineLegend = {
      display: true,
      labels: {
        fontColor: "black",
      },
      position: "bottom", //label를 넣어주지 않으면 position이 먹히지 않음
     };
   
   const lineOptions = {
      //responsive: true,
      //maintainAspectRatio: false,   
      //tooltips 사용시
      tooltips: {
        enabled: true,
        mode: "nearest",
        //position: "average",
        intersect: false,
      },
      scales: {
         xAxes: [
         {
            //position: "top", //default는 bottom
            display: true,
            scaleLabel: {
               display: true,
               labelString: "Time",
               fontFamily: "Montserrat",
               fontColor: "black",
            },
            ticks: {
               beginAtZero: true,
               stepSize: 10,
               min: 0,
               max:100,
               //maxTicksLimit: 10 //x축에 표시할 최대 눈금 수
               callback: function (value) {
                  return value + "분";
               }
           },
         },
        ],
        yAxes: [
         {
           display: true,
           //   padding: 10,
           scaleLabel: {
            display: true,
            labelString: "Attention",
            fontFamily: "Montserrat",
            fontColor: "black",
           },
           ticks: {
            beginAtZero: true,
            stepSize: 20,
            min: 0,
            max: 100,
            //y축 scale 값에 % 붙이기 위해 사용
            callback: function (value) {
              return value + "%";
            },
           },
         },
        ],
      },
     };

   return(<Line data={lineData} legend={lineLegend} width={200} height={80} options={lineOptions}/>);
}

function BarChart ({dayList}){
   let rankColor = ["#1890ff"];
   const barOptions = {
      legend: {
         display: false, // label 숨기기
      },
      scales: {
         yAxes: [{
            ticks: { 
               min: 0, // 스케일에 대한 최솟갓 설정, 0 부터 시작
               stepSize: 20, // 스케일에 대한 사용자 고정 정의 값
            }
         }]
      },
      //maintainAspectRatio: false // false로 설정 시 사용자 정의 크기에 따라 그래프 크기가 결정됨.
   }

   const barData = {
      labels: dayList.map((value) => moment(value).format('M월 DD일')),
      datasets: 
      [
        {
         backgroundColor: rankColor,
         borderColor: rankColor,
         borderWidth: 1,
         hoverBackgroundColor: rankColor,
         hoverBorderColor: rankColor,
         data: [10, 20, 30, 40],
         label: "참여점수"
        }
      ]
     }; 
   

   return (<Bar data={barData} width={200} height={80} options={barOptions}/>);
}

function Index({match}){
   const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;
    
    const isProfessor = user.type === "professor" ? true : false;
   const [isLoading, setisLoading] = useState(false);
   const [isAll, setisAll] = useState(true);
    const [isEmpty, setisEmpty] = useState(false);

   const [dayList, setDayList] = useState(["2021-03-11", "2021-03-12", "2021-03-13", "2021-03-14"]);
   const [studentNameList, setStudentNameList] = useState(["학생1", "학생2", "학생3", "학생4"]);
   const [studentUnderstandingGood, setStudentUnderstandingGood] = useState([[10, 20, 20, 67], [20, 20, 67, 43], [67, 43, 43, 57], [1, 2, 3, 4]]);
   const [studentUnderstandingBad, setStudentUnderstandingBad] = useState([[10, 20, 20, 67], [20, 20, 67, 43], [67, 43, 43, 57], [1, 2, 3, 4]]);
   const [understandingGood, setUnderstandingGood] = useState([]);
   const [understandingBad, setUnderstandingBad] = useState([]);
   const [studentData, setStudentData] = useState([
      [10, 20, 20, 67, 43, 43, 57, 40, 55, 60],
      [10, 40, 30, 40, 50, 50, 57, 30, 23, 60], 
      [10, 30, 20, 67, 20, 50, 57, 40, 59, 55], 
      [10, 20, 10, 80, 60, 70, 30, 60, 59, 60]
   ]);
   const [averageData, setAverageData] = useState([
      [10, 20, 20, 67, 43, 43, 57, 60, 59, 60],   
      [10, 20, 30, 67, 43, 50, 57, 60, 23, 60],    
      [10, 20, 20, 67, 43, 50, 57, 40, 59, 70],    
      [10, 20, 20, 80, 60, 70, 57, 60, 59, 60]
   ]);
   
   
   
   const [day, setDay] = useState(dayList[0]);
   const [dayIndex, setDayIndex] = useState(0);
   const [studentName, setStudentName] = useState(studentNameList[0]);
   const [studentIndex, setStudentIndex] = useState(0);
   const [rate, setRate] = useState(50);
   const [rate2, setRate2] = useState(-50);

   const onChangeDay = (e) => {
      const change = e.target.value;
      const i = dayList.indexOf(change);
      setDay(change);
      setDayIndex(i);
   }

   const onChangeStudent = (e) => {
      const change = e.target.value;
      change === "all" ? setisAll(true) : setisAll(false);
      const i = studentNameList.indexOf(change);

      setStudentName(change);
      setStudentIndex(i);
   }

   const CalcTotalUnderstanding = () => {
      for (let index = 0; index < studentUnderstandingBad.length; index++) {
         let sum = 0;
         studentUnderstandingGood.forEach(element => {
            sum = element[index] + sum;
         });
         understandingGood[index] = sum;
      }
      
      for (let index = 0; index < studentUnderstandingBad.length; index++) {
         let sum = 0;
         studentUnderstandingBad.forEach(element => {
            sum = element[index] + sum;
         });
         understandingBad[index] = sum;
      }
      console.log(understandingGood);
      console.log(understandingBad);
      setisLoading(true);
   }
   
     const getData = () => {
        axios.get('/api/understanding/get/lecture/' + String(subjectId))
        .then((response)=>{
            const result = response.data;
            console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        });

      axios.get('/api/subject/info/'+ String(subjectId))
        .then((response)=>{
            const result = response.data.subject;
         console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        });

      axios.get('/api/lecture/get/subject/'+ String(subjectId))
        .then((response)=>{
            const result = response.data;
         console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        });
     }

     const display = () => {
        return(<>
        <Title>Lecture Chart</Title>
        <div style={{width: "100%", display: "block"}}>
            <SubTitle>내 강의 / <a style={{color: "inherit"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 학습 분석 차트</SubTitle>
               <div style={{display: "inline-block", float:"right"}}>
                  <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
                     {isProfessor ? <option value={"all"}>전체</option> : <option>{user.name}</option>}
                     {isProfessor && studentNameList.map((value, index) => <option>{value}</option> )}
                  </SelectCust>
                  <SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white"}} onChange={onChangeDay}>
                     {dayList.map((value, Index) => <option value={value}>{moment(value).format('M월 DD일')}</option>)}
                  </SelectCust>
               </div>
         </div>
         <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
            <table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate", margin: "0px auto"}}>
            <tbody>
            <tr>
            <Box style={{}}>
               <BoxTitle>이해가 잘돼요</BoxTitle>
               <DayBox>{moment(day).format('M월 DD일')}</DayBox>
               <NumTitle>{isAll ? understandingGood[dayIndex] : studentUnderstandingGood[studentIndex][dayIndex]}</NumTitle>
               {rate > 0 ? <RateBoxGreen>{rate}%</RateBoxGreen>:<RateBoxRed>{rate}%</RateBoxRed>}
               <InfoBox>Since last class</InfoBox>
            </Box>
            <Box style={{}}>
               <BoxTitle>이해가 안돼요</BoxTitle>
               <DayBox>{moment(day).format('M월 DD일')}</DayBox>
               <NumTitle>{isAll ? understandingBad[dayIndex] : studentUnderstandingBad[studentIndex][dayIndex]}</NumTitle>
               {rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
               <InfoBox>Since last class</InfoBox>
            </Box>
            <Box rowSpan="2" colSpan="2">
               <BoxTitle>시간별 보기</BoxTitle>
               <DayBox>{moment(day).format('M월 DD일')}</DayBox>
               <LineChart studentData={studentData[studentIndex]} averageData={averageData[dayIndex]} studentName={studentName}/>
            </Box>
            </tr>
            <tr>
            <Box>
               <BoxTitle>참여 점수</BoxTitle>
               <DayBox>{moment(day).format('M월 DD일')}</DayBox>
               <NumTitle>100</NumTitle>
               {rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
               <InfoBox>Since last class</InfoBox>
            </Box>
            <Box>
               <BoxTitle>출석 비율</BoxTitle>
               <DayBox>{moment(day).format('M월 DD일')}</DayBox>
               <NumTitle>100</NumTitle>
               {rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
               <InfoBox>Since last class</InfoBox>
            </Box>
            </tr>
            <tr>
            <Box colSpan="2" style={{display: "table-cell", verticalAlign: "top"}}>
               <BoxTitle style={{}}>학생별 점수</BoxTitle>
               <DayBox>{moment(day).format('M월 DD일')}</DayBox>
               <table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5"}}>
                  <thead style={{borderBottom: "1px solid #D5D5D5"}}><tr>
                     <th style={{padding: "10px 0", width: "15%"}}>이름</th>
                     <th style={{padding: "10px 0", width: "15%"}}>점수</th>
                     <th style={{padding: "10px 0", width: "20%"}}>전날 대비</th>
                     <th style={{padding: "10px 0", width: "50%"}}>%학생</th></tr></thead>
                  <tbody>
                     {studentNameList.map((value) => 
                     <tr>
                        <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{value}</td>
                        <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>점수</td>
                        <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}</td>
                        <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}><Progress percent={50} status="active"/></td>
                     </tr>
                     )}
                  </tbody>
               </table>
            </Box>
            <Box colSpan="2">
               <BoxTitle>날짜별 보기</BoxTitle>
               <DayBox>{moment(day).format('M월 DD일')}</DayBox>
               <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0", float: "right", fontSize: "14px"}}>
                     <option>참여점수</option>
                     <option>몰입</option>
                     <option>이해가 됨</option>
                     <option>이해가 안됨</option>
               </SelectCust>
               <BarChart dayList={dayList}/>
            </Box>
            </tr>
            </tbody>
            </table>

        </>);
     }

     useEffect(() => {
      console.log("This is chart page");
        getData();
      CalcTotalUnderstanding();
    },[])

   return (
      <Container  style={{marginLeft: "20px", marginTop: '10px'}}>
         {isLoading && display()}
      </Container>
   )
}

export default Index;