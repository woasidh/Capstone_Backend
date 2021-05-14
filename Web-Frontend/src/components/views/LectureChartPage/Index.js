import { useEffect, useState } from 'react';
import axios from 'axios';
import styled, {css} from 'styled-components';
import moment from 'moment';
import 'antd/dist/antd.css';
import { Select, Progress } from 'antd';
import { Line, Bar } from "react-chartjs-2";

const {Option} = Select;

const Container = styled.div`
width : 100%;
display :block;
//align-items : center;
justify-content : center;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
//height : 80px;
line-height : 40px;
font-style : italic;
`
const SubTitle = styled.div`
display: inline-block;
margin-right: 20px;
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
display : inline-block;
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
padding: .3em .3em; /* 여백으로 높이 설정 */
//font-family: inherit;  /* 폰트 상속 */
border-radius: 5px; /* iOS 둥근모서리 제거 */
-webkit-appearance: none; /* 네이티브 외형 감추기 */
-moz-appearance: none;
appearance: none;
`

const lineData = {
	labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    datasets: [
		//원소 1
      {
        label: "Student",
        data: [10, 20, 20, 10, 30, 30, 50, 80, 50, 90],
        lineTension: 0.5,
        backgroundColor: "rgba(15, 107, 255, 0.1)",
        borderWidth: 1,
        borderColor: "#0f6bff",
        fill: false,
      },
	 //원소2
      {
        label: "Average",
        data: [10, 20, 20, 67, 43, 43, 57, 60, 59, 60],
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
          //   position: "top", //default는 bottom
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

let rankColor = ["#1890ff"]

function Understanding({}){

}

function Index({match}){
	const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectID = match.params.subject;
    const subjectName = match.params.name;
    
    const isProfessor = user.type === "professor" ? true : false;
	const [isLoading, setisLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);

	const [dayList, setDayList] = useState(["2021-03-11", "2021-03-12", "2021-03-13", "2021-03-14"]);
	const [studentList, setStudentList] = useState(["학생1", "학생2"]);
	
	const [day, setDay] = useState(dayList[0]);
	const [rate, setRate] = useState(50);
	const [rate2, setRate2] = useState(-50);

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
	



	return (
		<Container>
				<div style={{width: "100%"}}>
					<Title>Lecture</Title>
					<div style={{float: 'left', marginRight: "20px", color: "#233044", fontSize: "16px", fontWeight: "700"}}>내강의/{subjectName}/학습분석차트</div>
					<div style={{bottom: "0px", display: "flex", alignItems: "flex-end", justifyContent:"flex-end"}}>
						<SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}}>
							{isProfessor ? <option>전체</option> : <option>{user.name}</option>}
							{isProfessor && studentList.map((value) => <option>{value}</option>)}
						</SelectCust>
						<SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white"}} onChange={(e) => setDay(e.target.value)}>
							{dayList.map((value, Index) => <option value={value}>{moment(value).format('M월 DD일')}</option>)}
						</SelectCust>
					</div>
				</div>
				<hr style={{width: "100%", margin: "10px 0px"}}/>
				<table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate", margin: "20px auto"}}>
				<tbody>
				<tr>
				<Box style={{}}>
					<SubTitle>이해가 잘돼요</SubTitle>
					<DayBox>{moment(day).format('M월 DD일')}</DayBox>
					<NumTitle>100</NumTitle>
					{rate > 0 ? <RateBoxGreen>{rate}%</RateBoxGreen>:<RateBoxRed>{rate}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				<Box style={{}}>
					<SubTitle>이해가 안돼요</SubTitle>
					<DayBox>{moment(day).format('M월 DD일')}</DayBox>
					<NumTitle>100</NumTitle>
					{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				<Box rowSpan="2" colSpan="2">
					<SubTitle>시간별 보기</SubTitle>
					<DayBox>{moment(day).format('M월 DD일')}</DayBox>
					<Line data={lineData} legend={lineLegend} width={200} height={80} options={lineOptions}/>
				</Box>
				</tr>
				<tr>
				<Box>
					<SubTitle>참여 점수</SubTitle>
					<DayBox>{moment(day).format('M월 DD일')}</DayBox>
					<NumTitle>100</NumTitle>
					{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				<Box>
					<SubTitle>출석 비율</SubTitle>
					<DayBox>{moment(day).format('M월 DD일')}</DayBox>
					<NumTitle>100</NumTitle>
					{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				</tr>
				<tr>
				<Box colSpan="2" >
					<SubTitle style={{}}>학생별 점수</SubTitle>
					<DayBox>{moment(day).format('M월 DD일')}</DayBox>
					<table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5"}}>
						<thead style={{borderBottom: "1px solid #D5D5D5"}}><tr>
							<th style={{padding: "10px 0", width: "15%"}}>이름</th>
							<th style={{padding: "10px 0", width: "15%"}}>점수</th>
							<th style={{padding: "10px 0", width: "20%"}}>전날 대비</th>
							<th style={{padding: "10px 0", width: "50%"}}>%학생</th></tr></thead>
						<tbody>
							<tr>
								<td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>이이름</td>
								<td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>점수</td>
								<td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}</td>
								<td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}><Progress percent={50} status="active"/></td>
							</tr>
						</tbody>
					</table>
				</Box>
				<Box colSpan="2">
					<SubTitle>날짜별 보기</SubTitle>
					<DayBox>{moment(day).format('M월 DD일')}</DayBox>
					<SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0", float: "right", fontSize: "14px"}}>
							<option>참여점수</option>
							<option>몰입</option>
							<option>이해가 됨</option>
							<option>이해가 안됨</option>
					</SelectCust>
					<Bar data={barData} width={200} height={80} options={barOptions}/>
				</Box>
				</tr>
				</tbody>
				</table>

		</Container>
	)
}

export default Index;