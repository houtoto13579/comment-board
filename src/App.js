import React, { Component } from 'react';
import CommentList from './List.js';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state={
      commentList: [],
      idCount: 0,
      inputTitle: "",
      inputText: "",
      inputName: "Tomska",
      nameEditable: false,
    }
    this.updateText = this.updateText.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.postText = this.postText.bind(this);
    this.setShowReply=this.setShowReply.bind(this);
    this.updateReplyText=this.updateReplyText.bind(this);
    this.postReply=this.postReply.bind(this);
  }
  findTarget(array, key){
    for (let i = 0, l = array.length; i < l; i++) {
      if (array[i].key === key) {
          return i;
      }
    }
  }
  componentDidMount(){
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }
    fetch('http://127.0.0.1:3001/comments')
      .then(checkStatus)
      .then(response=>response.json())
      .then(resObj=>{
        let commentListArr = [];
        let data = resObj.data;
        
        // "name": "Andy Liu",
        // "title": "WTF UN airline...",
        // "comment": "no one should be treated like this :(",
        // "like": 0,
        // "under": 0,
        // "time": '00:00:00'
        let idCount = resObj.idCount;
        for (let i = 0, l = data.length; i < l; i++){
          commentListArr.push(
            {
              'key': data[i].id,
              'name': data[i].name,
              'title': data[i].title,
              'comment': data[i].comment,
              'time': data[i].time,
              'showReply': false,
              'replyList': data[i].reply,
              'replyText': "",
            }
          )
        }
        this.setState({
          commentList: commentListArr,
          idCount: idCount,
        })
      })
      .catch(error=>{
        console.log('load fail...')
        console.log(error);
      })
  }
  updateText(event){
    this.setState({inputText: event.target.value})
  }
  updateTitle(event){
    this.setState({inputTitle: event.target.value})
  }
  updateReplyText(key, str){
    let commentList = this.state.commentList;
    let index = this.findTarget(commentList, key);
    commentList[index].replyText = str;
    this.setState({
      commentList: commentList}
    );
  }
  setShowReply(key){
    let commentList = this.state.commentList;
    let index = this.findTarget(commentList, key);
    commentList[index].showReply = !commentList[index].showReply;
    this.setState({
      commentList: commentList}
      );
  }
  postText(event){
    let currentTime = new Date().toLocaleString();
    let commentList = this.state.commentList;
    commentList.push(
      {
        'key': this.state.idCount,
        'name': this.state.inputName,
        'title': this.state.inputTitle,
        'comment': this.state.inputText,
        'time': currentTime,
        'showReply': false,
        'replyList': [],
        'replyText': "",
      }
    )
    fetch('http://127.0.0.1:3001/comments', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.inputName,
        title: this.state.inputTitle,
        comment: this.state.inputText,
        like: 0,
        under: 0,
        time: currentTime
      }),
    });

    this.setState({
      commentList:commentList,
      idCount:this.state.idCount+1,
      inputTitle: "",
      inputText: "",
    })
  }
  postReply(key){
    let targetIndex = this.findTarget(this.state.commentList, key)
    let commentList = this.state.commentList;
    let str = this.state.commentList[targetIndex].replyText;
    let currentTime = new Date().toLocaleString();
    // this is for user seeing their reply
    commentList[targetIndex].replyList.push({
      'id': this.state.idCount,
      'name': this.state.inputName,
      'comment': str,
      'like': 0,
      'under': key,
      'time': currentTime,
    })
    this.setState({
      commentList:commentList,
      idCount:this.state.idCount+1
    })

    // actual post
    fetch('http://127.0.0.1:3001/comments', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.inputName,
        comment: str,
        like: 0,
        under: key,
        time: currentTime
      }),
    });
  }
  render() {
    let isEditable;
    if(this.state.nameEditable==true)
      isEditable='editable'
    else
      isEditable='readonly';
    let inputNameClasses = `inputName ${isEditable}`;
    return(
      <div className="App">
        <div className="header">
          <div>You are: </div>
          <input className={inputNameClasses}
            value={this.state.inputName}
            onChange={
              (e)=>{this.setState({inputName: e.target.value})
            }}
            onKeyPress={
                  (e)=>{
                  let key= e.keyCode || e.which;
                  if(key===13){
                    this.setState({nameEditable: !this.state.nameEditable})
                  }}
            }
            disabled = {(this.state.nameEditable)? "" : "disabled"}
          ></input>
          <div className="changeName"
            onClick={()=>{
              this.setState({nameEditable: !this.state.nameEditable})
            }}
          >(change)</div>
        </div>
        <h1>Message Board</h1>
        <div className='inputBlock'>
          <span>Title:</span>
          <input 
            onChange={this.updateTitle} 
            value={this.state.inputTitle}
            className='inputTitle'
          />
          <textarea 
            rows = "20"
            onChange={this.updateText} 
            value={this.state.inputText}
            className='inputText'
          />
          <button className='sendButton' onClick={this.postText}>Post Comment</button>
        </div>
        
        <CommentList
          list={this.state.commentList}
          setShowReply={this.setShowReply}
          updateReplyText={this.updateReplyText}
          postReply={this.postReply}
        ></CommentList>
        <div className='footer'>

        </div>
      </div>
    )
  }
}

export default App;
