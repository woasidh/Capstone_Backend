import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import {ReactComponent as LikeImg} from '../../../images/utils/heart.svg';
import {ReactComponent as CommentImg} from '../../../images/utils/comment.svg';
import WritePage from './WriteNotePage';
import UpdatePage from './UpdateNotePage';

const Container = styled.div`
width : 100%;
height : 100%;
display : inline-block;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 80px;
line-height : 80px;
font-style : italic;
`
const SubTitle = styled.div`
float: left;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const Box = styled.div`
display: block;
width: 100%;
margin : 10px 5px;
background : white;
border-radius: 5px;
padding: 10px;
box-shadow: 0px 3px #e0e0e0;
`
const NoteBox = styled.div`
display: block;
width: 100%;
margin: 0 auto;
padding: 10px;
`
const NoteTitle = styled.div`
float: left;
padding: 5px;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NoteContent = styled.div`
padding: 5px;
display: block;
font-size : 14px;
`
const CommentInputBox = styled.textarea`
display: inline-block;
width : 87.5%;
padding : 10px;
resize: none;
border : 1px solid ${props => props.theme.color.gray4};
`
const WriteBtn = styled.a`
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const SmallBtn = styled.button`
display: inline-block;
font-size: 12px;
padding: 5px;
margin: 1px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const ReactBtn = styled.button`
display: inline-block;
width: 40%;
margin: 5px;
`
const CommentBtn = styled.button`
display: inline-block;
background-color: ${props => props.theme.color.blue};
color: white;
position: absolute;
width: 8%;
height: 66px;
margin-top: -0px;
border: solid 1px #ababab;
cursor: pointer;
border-radius: 0 5px 5px 0;
`

function Index({match}) {
    
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectID = match.params.subject;
    const subjectName = match.params.name;
    
    const isProfessor = user.type === "professor" ? true : false;
    const [isLoading, setisLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);
    const [isEditing, setisEditing] = useState(false);
    const [isShowing, setisShowing] = useState(false);
    
    const [noteList, setNoteList] = useState([]);
    const [comment, setComment] = useState();

    const getData = () => {
        const url = '/api/lectureNote/get/subject/' + subjectID;
        axios.get(url)
        .then((response)=>{
            const result = response.data.lectureNotes;
            console.log(result);
            setisEmpty(result.length === 0 ? true : false);
            setNoteList(result);
            setisLoading(true);            
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const deleteNote = (noteID) => {
        const url = '/api/lectureNote/delete/' + noteID;
        axios.delete(url)
        .then((response)=>{
            const result = response.data;
            console.log(result);
            if(result.success){ 
                alert("해당 강의노트가 삭제되었습니다.");
                return window.location.href = `/main/${subjectID}/${subjectName}/note`;}
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const updateNote = (noteID) => {
        return (window.location.href = `/main/${subjectID}/${subjectName}/note/update/${noteID}`);
    }

    const submitComment = (e, postId, content) => {
        console.log(comment);
        axios.put('/api/comment/add',{
            postType : "lectureNote",
            postId : postId,
            content : content
        })
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            if(result){
                setComment('');
                alert("댓글 작성을 완료했습니다.");
                return window.location.href = `/main/${subjectID}/${subjectName}/note`;                
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const editComment = (e, postId, commenetId) => {
            axios.put('/api/comment/edit', {
                postType : "lectureNote",
                postId : postId,
                commentIndex : commenetId,
                content : comment
            })
            .then((response)=>{
                const result = response.data;
                console.log(result);
                if(result.success){
                    setisEditing(!isEditing)
                    alert("댓글 수정을 완료했습니다.");
                    return window.location.href = `/main/${subjectID}/${subjectName}/note`;                
                }
            })
            .catch((error)=>{
                console.log(error);
            });

    }

    const deleteComment = (e, commenetId, postId) => {
        axios.put('/api/comment/delete', {
            postType : "lectureNote", 
            postId : postId,
            commentIndex : commenetId
        })
        .then((response)=>{
            const result = response.data;
            console.log(result);
            if(result.success){
                alert("댓글 삭제를 완료했습니다.");
                return window.location.href = `/main/${subjectID}/${subjectName}/note`;                
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const showCommentList = (commentList, postId) => {
        return(
            commentList.map((value, index) => <div style={{display: "block", width: "100%", margin: "10px auto"}}>
                {isEditing ? 
                <div>
                    <CommentInputBox onChange={(e) => setComment(e.target.value)} rows={2} style={{resize : "none"}} placeholder={value.content}/>
                    <CommentBtn onClick={(e) => editComment(e, postId, index)}>수정</CommentBtn>
                </div>:
                <div>
                    <div style={{display: "inline-block"}}>{value.user} : {value.content}</div>
                    {value.user === user._id && <div style={{float:"right"}}>
                        <SmallBtn onClick={(e) => {setisEditing(!isEditing); setComment(value.content)}}>수정</SmallBtn>
                        <SmallBtn onClick={(e) => deleteComment(e, index, postId)}>삭제</SmallBtn></div>}                               
                </div>
                }
            </div>)
        );
    }


    const display = () => {
        return( 
            <div> 
                {isEmpty ? "작성된 강의 노트가 없습니다." : noteList.map((value, index) => 
                <Box>
                    <NoteBox>
                        <NoteTitle>{value.title}</NoteTitle>
                        {isProfessor && <div style={{display: "inline-block", float:"right"}}>
                            <SmallBtn onClick={(e) => updateNote(value._id)}>수정</SmallBtn>
                            <SmallBtn onClick={(e) => deleteNote(value._id)}>삭제</SmallBtn>
                        </div>}
                        <NoteContent>
                            {value.date}
                            {ReactHtmlParser(value.content)}
                        </NoteContent>
                    </NoteBox>
                    <hr style={{width: "100%", margin: "10px 0px", display:"block"}}/>
                    <div>
                        <ReactBtn onClick={(e) => setisShowing(!isShowing)}><CommentImg width="15px" height="15px"/> 댓글({value.comments.length})</ReactBtn>
                    </div>
                    <div style={{width: "100%", marginBottom: "20px", display:"block"}}>{isShowing && showCommentList(value.comments, value._id)} </div>
                    <div style={{width: "100%", display:"block", margin: "0 auto"}}>
                        <CommentInputBox onChange={(e => setComment(e.target.value))} rows={2} style={{resize : "none"}}/>
                        <CommentBtn onClick={(e) => submitComment(e, value._id, comment)}>등록</CommentBtn>
                    </div>
                </Box>                
                )}
            </div>
        )
    }

    useEffect(() => {
        getData();
    },[])

    return(
        <Router>
            <Switch>
                <Route path="/main/:subject/:name/note/write" component={WritePage}/>
                <Route path="/main/:subject/:name/note/update/:id" component={UpdatePage}/>
                <Route path="/">
                    <Container>
                    <Title>Lecture Note</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <SubTitle>내 강의 / {subjectName} / 강의 노트</SubTitle>
                        {isProfessor && <WriteBtn href={`/main/${subjectID}/${subjectName}/note/write`} style={{display: "inline-block", float:"right"}}>작성하기</WriteBtn>}
                    </div>
                    <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
                    <div>
                        {isLoading && display()}
                    </div>                    
                    </Container>
                </Route>
            </Switch>
        </Router>
    );
}

export default Index;