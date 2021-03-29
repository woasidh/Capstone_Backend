import React, { useState, useCallback } from "react";
import styled from 'styled-components';
import { Form, Input } from 'antd';
import axios from "axios";
import { useHistory } from "react-router-dom";

const SubmitBtn = styled.button`
width : 100%;
height : 40px;
border : none;
background-color: #407AD6;
color : white;
text-align :center;
line-height : 40px;
border-radius : 5px;
margin-left : auto;
margin-right : auto;
`
const Box = styled.div`
background-color: #f7f9fc;
border-radius: 5px;
padding: 10px;
margin-bottom: 5px;
`

const InfoBox = styled.div`
margin-left : auto;
margin-right : auto;
border : none;
background-color: #f7f9fc;
padding : 5px;
`
function SignUp() {

	const [emptyError, setEmptyError] = useState(false);
	const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
	const history = useHistory();

	const [name, setName] = useState(userInfo.name);
	const [email, setEmail] = useState(userInfo.email);
	const [photourl, setPhote] = useState(userInfo.imgUrl);
	const [studentID, setStudentID] = useState('');
	const [school, setSchool] = useState('');
	const [major, setMajor] = useState('');
	const [grade, setGrade] = useState(0);

	const onChangeName = e => {
		setName(e.target.value);
	};

	const onChangeStudentID = e => {
		setStudentID(e.target.value);
	};

	const onChangeSchool = e => {
		setSchool(e.target.value);
	};

	const onChangeMajor = e => {
		setMajor(e.target.value);
	};

	const onChangeGrade = e => {
		setGrade(e.target.value);
	};

	const submitHandler = useCallback((e) => {
		e.preventDefault();
		let user = {
			type: 'student',
			email: email,
			name: name,
			photourl: photourl,
			professorID: '',
			school: school,
			major: major,
			studentID: studentID,
			grade: grade
		};
		console.log(user);

		if (!user.name || !user.school || !user.studentID || !user.major || !user.grade) {
			return setEmptyError(true);
		}
		axios.post('http://13.125.234.161:3000/auth/signup',
			{
				type: 'student',
				email: email,
				name: name,
				photourl: photourl,
				professorID: '',
				school: school,
				major: major,
				studentID: studentID,
				grade: grade
			}, {
			headers: { 'Content-type': 'application/json', 'Accept': 'application/json' }
		})
			.then((response) => {
				const result = response.data;
				console.log(response);
				if (result.success) {
					sessionStorage.removeItem("userInfo");
					return history.push("/");
				} else {
					//return history.push("/signup");
					return window.location.href = '/signup';
				}
			})
	}, [school, major, studentID, grade]);

	return (
		<Form onSubmit={onsubmit}>
			<Box>
				<InfoBox>
					<label>이름</label>
					<Input name="name" type="text" value={name} required onChange={onChangeName}></Input>
				</InfoBox>
				<InfoBox>
					<label>이메일</label>
					<Input name="email" type="text" value={email} required ></Input>
				</InfoBox>
				<InfoBox>
					<label>학번</label>
					<Input name="studentID" placeholder="학번" value={studentID} required onChange={onChangeStudentID}></Input>
				</InfoBox>
				<InfoBox>
					<label>학교</label>
					<Input name="school" placeholder="..대학교" value={school} required onChange={onChangeSchool}></Input>
				</InfoBox>
				<InfoBox>
					<label>학과</label><br />
					<select style={{ width: 200 }} name="major" value={major} required onChange={onChangeMajor}>
						<optgroup label="정보통신대학">
							<option value="major_it1">전자공학과</option>
							<option value="major_it2">컴퓨터공학과</option>
							<option value="major_it3">미디어학과</option>
						</optgroup>
						<optgroup label="공과대학">
							<option value="major_eng1">기계공학과</option>
							<option value="major_eng2">산업공학과</option>
							<option value="major_eng3">화학공학과</option>
						</optgroup>
					</select>
				</InfoBox>
				<InfoBox>
					<label>학년</label><br />
					<select style={{ width: 200 }} name="grade" value={grade} required onChange={onChangeGrade}>
						<option value="1">1학년</option>
						<option value="2">2학년</option>
						<option value="3">3학년</option>
						<option value="4">4학년</option>
						<option value="5">5학년 이상</option>
					</select>
				</InfoBox>
				{emptyError && <div style={{ color: 'red' }}>모든 항목을 채워야 합니다.</div>}
			</Box>
			<div>
				<SubmitBtn onClick={submitHandler}>DISBOARD 시작하기</SubmitBtn>
			</div>
		</Form>

	);
}

export default SignUp;