import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import {ReactComponent as LikeImg} from '../../../images/utils/heart.svg';
import {ReactComponent as CommentImg} from '../../../images/utils/comment.svg';
import WritePage from "./WriteNoticePage";
import UpdatePage from "./UpdateNoticePage";

const Container = styled.div`
width : 100%;
height : 100%;
display : inline-block;
//overflow-y: auto;
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
box-shadow: 5px 5px #e0e0e0;
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
const NoticeBox = styled.div`
display: inline-block;
padding: 5px;
border-right: 1px solid black; 
width: 80%;
`
const NoticeTitle = styled.div`
display: block;
padding: 5px;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NoticeContent = styled.div`
padding: 5px;
display: block;
font-size : 14px;
`
const NoticeMenuBox = styled.div`
display: inline-block;
width : 20%;
padding : 5px;
`
const CommentInputBox = styled.textarea`
display: inline-block;
width : 87.5%;
padding : 10px;
resize: none;
border : 1px solid ${props => props.theme.color.gray4};
`

function Index({match}) {
    
    const [user, setUser] = useState(JSON.parse(window.sessionStorage.userInfo));
    const [subject, setSubject] = useState({
        id: match.params.subject,
        name: match.params.name
    });
    
    const [isProfessor, setisProfessor] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isAll = String(subject.id) == "all" ? true : false;
    const [isEmpty, setisEmpty] = useState(false);
    const [isEditing, setisEditing] = useState(false);
    const [isShowing, setisShowing] = useState(false);
    
    const [noticeList, setNoticeList] = useState([]);
    const [comment, setComment] = useState();

    const getData = () => {
        const url = isAll ? '/api/notice/get/all' : '/api/notice/get/subject/' + String(subject.id);
        axios.get(url)
        .then((response)=>{
            const result = response.data.notices;
            console.log(result);
            setisEmpty(result.length == 0 ? true : false);
            setNoticeList(result);
            setIsLoading(true);            
        })
        .catch((error)=>{
            console.log(error);
        });
        console.log(noticeList);
    }

    const deleteNotice = (e, noticeID) => {
        const url = '/api/notice/delete/' + noticeID;
        axios.delete(url)
        .then((response)=>{
            const result = response.data;
            console.log(result);
            if(result.success){ 
                alert("해당 공지사항이 삭제되었습니다.");
                return window.location.href = `/main/${subject.id}/${subject.name}/notice`;}
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const updateNotice = (e, noticeID) => {
        return (window.location.href = `/main/${subject.id}/${subject.name}/notice/update/${noticeID}`);
    }

    const addEmotion = (e, id) => {
        axios.put('/api/emotion/add',{
            postType : "notice",
            postId : id,
            emotion : "heart"
        })
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            if(result){
                alert("좋아요를 눌렀습니다.");
                return window.location.href = `/main/${subject.id}/${subject.name}/notice`;                
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const onChangeComment = (e) => {
        setComment(e.target.value);
    }



    const submitComment = (e, postId, content) => {
        console.log(comment);
        axios.put('/api/comment/add',{
            postType : "notice",
            postId : postId,
            content : content
        })
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            if(result){
                setComment('');
                alert("댓글 작성을 완료했습니다.");
                return window.location.href = `/main/${subject.id}/${subject.name}/notice`;                
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const editComment = (e, postId, commenetId) => {
            axios.put('/api/comment/edit', {
                postType : "notice",
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
                    return window.location.href = `/main/${subject.id}/${subject.name}/notice`;                
                }
            })
            .catch((error)=>{
                console.log(error);
            });

    }

    const deleteComment = (e, commenetId, postId) => {
        axios.put('/api/comment/delete', {
            postType : "notice", 
            postId : postId,
            commentIndex : commenetId
        })
        .then((response)=>{
            const result = response.data;
            console.log(result);
            if(result.success){
                alert("댓글 삭제를 완료했습니다.");
                return window.location.href = `/main/${subject.id}/${subject.name}/notice`;                
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
                    <CommentInputBox onChange={onChangeComment} rows={2} style={{resize : "none"}} placeholder={value.content}/>
                    <CommentBtn onClick={(e) => editComment(e, postId, index)}>수정</CommentBtn>
                </div>:
                <div>
                    <div style={{display: "inline-block"}}>{value.user} : {value.content}</div>
                    {value.user == user._id && <div style={{float:"right"}}>
                        <SmallBtn onClick={(e) => {setisEditing(!isEditing); setComment(value.content)}}>수정</SmallBtn>
                        <SmallBtn onClick={(e) => deleteComment(e, index, postId)}>삭제</SmallBtn></div>}                               
                </div>
                }
            </div>)
        );
    }


    const displayAll = (list) => {
        console.log(list);
        return (
            <div>
                {list.map((all, index) => <>{all.notices.length != 0 && display(all.notices, all.subject.name)}</>)}                
             </div>
        );
    }


    const display = (noticeList, subjectName) => {
        return(
            <div>
                {isEmpty ? "등록된 공지 사항이 없습니다." : noticeList.map((value, index) =>
                    <Box>
                        <div style={{display: "inline-block", width: "100%"}}>
                            <NoticeBox>
                                <NoticeTitle>{value.title}</NoticeTitle>
                                <NoticeContent>
                                    {ReactHtmlParser(value.content)}
                                </NoticeContent> 
                            </NoticeBox>
                            <NoticeMenuBox>
                                {isProfessor && <div style={{display: "inline-block", top: "0px"}}>
                                    <SmallBtn onClick={(e) => updateNotice(e, value._id)}>수정</SmallBtn>
                                    <SmallBtn onClick={(e) => deleteNotice(e, value._id)}>삭제</SmallBtn></div>}
                                {isAll && <div style={{display: "block", margin: "5px 0"}}>{subjectName}</div>}
                                <div style={{margin: "5px 0"}}>{moment(value.date).format('YYYY/MM/DD HH:mm')}</div>                                    
                            </NoticeMenuBox>
                        </div>
                        <hr style={{width: "100%", margin: "10px 0px", display:"block"}}/>
                        <ReactBtn onClick={(e)=>addEmotion(e, value._id)}><LikeImg width="12px" height="12px" fill="red"/> 좋아요({value.emotions.length})</ReactBtn>
                        <ReactBtn onClick={(e) => setisShowing(!isShowing)}><CommentImg width="15px" height="15px"/> 댓글({value.comments.length})</ReactBtn>
                        <div style={{width: "100%", marginBottom: "20px", display:"block"}}>
                            {isShowing && showCommentList(value.comments, value._id)} </div>
                        <div style={{width: "100%", display:"block", margin: "0 auto"}}>
                            <CommentInputBox onChange={onChangeComment} rows={2} style={{resize : "none"}}/>
                            <CommentBtn onClick={(e) => submitComment(e, value._id, comment)}>등록</CommentBtn>
                        </div>
                    </Box>
                )}
            </div>
        );
    }

    

    useEffect(() => {
        getData();
        if(user.type === "professor"){
            setisProfessor(true);
        }

    },[])

    return(
        <div>
        <Router>
            <Switch>
                <Route path="/main/:subject/:name/notice/write" component={WritePage}/>
                <Route path="/main/:subject/:name/notice/update/:id" component={UpdatePage}/>
                <Route path="/">
                    <Container>
                    <Title>Notice</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <SubTitle>{isAll ? "종합공지사항" : `내 강의 / ${subject.name} / 공지 사항`}</SubTitle>
                        {isProfessor && !isAll && <WriteBtn href={`/main/${subject.id}/${subject.name}/notice/write`} style={{display: "inline-block", float:"right"}}>작성하기</WriteBtn>}
                    </div>
                    <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
                    <div>
                        {isLoading && (isAll ? displayAll(noticeList) : display(noticeList))}
                    </div>                    
                    </Container>
                </Route>
            </Switch>
        </Router>
        </div>                
    );
}

export default Index;