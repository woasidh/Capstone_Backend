import styled, { css } from 'styled-components'
import 'antd/dist/antd.css';
import { Select } from 'antd';
import { useState } from 'react';
import { Line } from "react-chartjs-2";

const {Option} = Select;

const Container = styled.div`
width : 100%;
height : 100%;
display :flex;
//align-items : center;
justify-content : center;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 80px;
line-height : 80px;
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
const RateBoxRed = styled.div`
width : 60px;
text-align: center;
border-radius:5px;
padding : 5px;
font-size : 12px;
display : inline;
bottom : 0px;
color : #f44a4b;
background : #feeceb;
`
const RateBoxGreen = styled.div`
width : 60px;
text-align: center;
border-radius:5px;
padding : 5px;
font-size : 12px;
display : inline;
bottom : 0px;
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
//display: inline-block;
background: white;
border-radius: 5px;
padding: 10px;
box-shadow: 5px 5px #f5f5f5;
margin: 10px;
`
const SelectCust = styled.select`
font-size: 16px;
width: 100px; /* 원하는 너비설정 */
margin-right: 5px;
padding: .3em .3em; /* 여백으로 높이 설정 */
//font-family: inherit;  /* 폰트 상속 */
border-radius: 5px; /* iOS 둥근모서리 제거 */
-webkit-appearance: none; /* 네이티브 외형 감추기 */
-moz-appearance: none;
appearance: none;
`

const data = {
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

const legend = {
    display: true,
    labels: {
      fontColor: "black",
    },
    position: "bottom", //label를 넣어주지 않으면 position이 먹히지 않음
  };

  const options = {
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
function Index(){
	const [rate, setRate] = useState(50);
	const [rate2, setRate2] = useState(-50);

	return (
		<Container>
			<div style={{width: "95%", display: "block"}}>
				<div style={{width: "100%"}}>
					<Title>Lecture</Title>
					<div style={{fontSize: "16px"}}>내강의/강의명/학습분석차트</div>
					<div style={{bottom: "0px", display: "flex", alignItems: "flex-end", justifyContent:"flex-end"}}>
						<SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}}>
							<option>전체</option>
							<option>학생1</option>
						</SelectCust>
						<SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white"}}>
							<option>3월 12일</option>
							<option>3월 13일</option>
						</SelectCust>
					</div>
				</div>
				<hr style={{width: "100%", margin: "10px 0px"}}/>
				<table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate"}}>
				<tbody>
				<tr>
				<Box style={{}}>
					<SubTitle>이해가 잘돼요</SubTitle>
					<DayBox>3월 12일</DayBox>
					<NumTitle>100</NumTitle>
					{rate > 0 ? <RateBoxGreen>{rate}%</RateBoxGreen>:<RateBoxRed>{rate}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				<Box style={{}}>
					<SubTitle>이해가 안돼요</SubTitle>
					<DayBox>3월 12일</DayBox>
					<NumTitle>100</NumTitle>
					{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				<Box rowSpan="2">
					<SubTitle>시간별 보기</SubTitle>
					<DayBox>3월 12일</DayBox>
					<Line data={data} legend={legend} options={options}/>
				</Box>
				</tr>
				<tr>
				<Box>
					<SubTitle>참여 점수</SubTitle>
					<DayBox>3월 12일</DayBox>
					<NumTitle>100</NumTitle>
					{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				<Box>
					<SubTitle>출석 비율</SubTitle>
					<DayBox>3월 12일</DayBox>
					<NumTitle>100</NumTitle>
					{rate2 > 0 ? <RateBoxGreen>{rate2}%</RateBoxGreen>:<RateBoxRed>{rate2}%</RateBoxRed>}
					<InfoBox>Since last class</InfoBox>
				</Box>
				</tr>
				<tr>
				<Box colSpan="2">
					<SubTitle>학생별 점수</SubTitle>
					<DayBox>3월 12일</DayBox>
					<table>
						<tr><th>이름</th><th>점수</th><th>전날 대비</th><th>학생</th></tr>
					</table>
				</Box>
				<Box colSpan="2">
					<SubTitle>날짜별 보기</SubTitle>
					<DayBox>3월 12일</DayBox>
				</Box>
				</tr>
				</tbody>
				</table>
			</div>			

		</Container>
	)
}

export default Index;