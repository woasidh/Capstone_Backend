import React, {useState, useCallback} from "react";
import styled from 'styled-components';
import { Form , Checkbox} from 'antd';

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
function SignUp(){
	const [term,setTerm] = useState(false);
	const [termError,setTermError] = useState(false);

	const gotoStudent = useCallback((e) => {
        e.preventDefault();                
        if(!term){
            return setTermError(true);
		}
		
		window.location.href = '/signup/student';
	},[term]);

	const gotoProfessor = useCallback((e) => {
        e.preventDefault();                
        if(!term){
            return setTermError(true);
		}
		
		window.location.href = '/signup/professor';
	},[term]);
	
	return(
		<Form onSubmit={onsubmit}>
			<Box>
				<InfoBox>
					<label>약관</label><br/>
					<textarea style={{width : "100%", height: "100px", resize: "none", border: "none"}}readOnly>약관내용</textarea><br/>	
           			<Checkbox name="user-term" value={term} onChange={onChangeTerm}>약관에 동의하십니까?</Checkbox>
               		{termError && <div style={{color : 'red'}}>약관에 동의하셔야 합니다.</div>}
				</InfoBox>
           	</Box>
			<div>
				<SubmitBtn style={{marginBottom : "5px"}} onClick={gotoProfessor}>교수로 시작하기</SubmitBtn>
				<SubmitBtn style={{marginBottom : "5px"}} onClick={gotoStudent}>학생으로 시작하기</SubmitBtn>
			</div>
		</Form>
		
	);
}

export default SignUp;