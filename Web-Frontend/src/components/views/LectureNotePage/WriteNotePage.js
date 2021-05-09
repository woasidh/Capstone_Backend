import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Container = styled.div`
width : 100%;
height : 100%;
display : block;
align-items : center;
justify-content : center;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 80px;
line-height : 80px;
font-style : italic;
`
const SubmitBtn = styled.button`
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const TitleInput = styled.input`
padding : 5px;
border : 1px solid ${props => props.theme.color.gray4};
width : 100%;
margin : 10px 0px;
`

function Index({match}){
    const subjectID = String(match.params.subject);
    const subjectName = String(match.params.name);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState();
    const [fileURL, setFileURL] = useState("");

    const getTitle = (e) => {
        setTitle(e.target.value);
        console.log(title);
    }

    const submitBtn = () => {
        console.log("title: " + title);
        console.log("content: " + content);

        axios.post('/api/lectureNote/create',{
            subject : subjectID,
            title : title,
            content : content,
            fileURL : fileURL
        })
        .then((response) => {
            console.log(response);
            return window.location.href=`/main/${subjectID}/${subjectName}/note/`;
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
    }

    return(
        <Container>
                <Title>Lecture Note</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <div style={{fontSize: "16px", float: "left"}}>내 강의 / {subjectName} / 강의 노트 작성</div>
                        <SubmitBtn onClick={submitBtn} style={{display: "inline-block", float:"right"}}>저장하기</SubmitBtn>
                    </div>
                    <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
                    <TitleInput type="text" name="title" onChange={getTitle} placeholder="제목"/>
                    <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onReady={ editor => {
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        setContent(data);
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />                   
            </Container>
    );
}

export default Index;