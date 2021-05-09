import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Container = styled.div`
width : 100%;
height : 100%;
display : block;
//align-items : center;
//justify-content : center;
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
    const [isLoading, setisLoading] = useState(false);

    const [subject, setSubject] = useState({
        id: match.params.subject,
        name: match.params.name
    });

    const noticeID = String(match.params.id)

    const [title, setTitle] = useState("");
    const [content, setContent] = useState();

    const getData = () => {
        const url = '/api/notice/get/' + noticeID;
        axios.get(url)
        .then((response) => {
            const result = response.data;
            console.log(result);
            setTitle(result.notice.title);
            setContent(result.notice.content);
            setisLoading(true);
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
    }

    const getTitle = (e) => {
        setTitle(e.target.value);
        console.log(title);
    }

    const submitBtn = () => {
        console.log(subject.id);
        console.log("title: " + title);
        console.log("content: " + content);

        axios.put('/api/notice/update',{
            id : noticeID,
            title : title,
            content : content             
        })
        .then((response) => {
            console.log(response);
            return window.location.href=`/main/${subject.id}/${subject.name}/notice/`;
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
    }

    const display = () => {
        return(
            <Container>
                <Title>Notice</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <div style={{fontSize: "16px", float: "left"}}>내 강의 / {subject.name} / 공지 사항 수정</div>
                        <SubmitBtn onClick={submitBtn} style={{display: "inline-block", float:"right"}}>저장하기</SubmitBtn>
                    </div>
                    <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
                    <TitleInput type="text" name="title" onChange={getTitle} placeholder={title}/>
                    <CKEditor
                    editor={ ClassicEditor }
                    data={content}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
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
        )
    }

    useEffect(() => {
        getData();
    },[])

    return(
        <div>{isLoading && display()}</div>
    );
}

export default Index;