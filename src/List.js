import React, { Component } from 'react';
import ReplyList from './Replies';
class CommentList extends Component {
  constructor(){
    super();
    this.showReply = this.showReply.bind(this);
    this.createList = this.createList.bind(this);
    this.postReply=this.postReply.bind(this);
    this.cleanReplyText=this.cleanReplyText.bind(this);
  }
  showReply(key){
    this.props.setShowReply(key);
  }
  updateReplyText(key, eve){
    let str = eve.target.value;
    this.props.updateReplyText(key, str);
  }
  cleanReplyText(key){
    let str="";
    this.props.updateReplyText(key, str);
  }
  postReply(key){
    this.props.postReply(key);
  }
  createList(commentBlock){
    
    return (  
      <div key={`comment-${commentBlock.key}`} className="commentBlock">
        <div className="name">
          {commentBlock.name}
        </div>
        <div className="titleAndComment">
          <div className="title">
            {commentBlock.title}
          </div>
          <div className="comment">
            {commentBlock.comment}
          </div>
          <ReplyList list={commentBlock.replyList}>
          </ReplyList>
          <div className="replyCommentInputBlock">
            <div>Leave Your Comment:</div>
            <input className="replyCommentInput"
              onChange={(e)=>{this.updateReplyText(commentBlock.key,e)}}
              value={commentBlock.replyText}
              onKeyPress={
                    (e)=>{
                    let key= e.keyCode || e.which;
                    if(key===13){
                      this.postReply(commentBlock.key);
                      this.cleanReplyText(commentBlock.key);
                    }
                    }
              }
              />
          </div>
        </div>
        <div className="time">
          {commentBlock.time}
        </div>
      </div>
    )
  }

  render() {
    let listArr = this.props.list;
    var listArrRender = listArr.map(this.createList);
    return (
        <div className="commentList">
          {listArrRender}
        </div>
    );
  }
}

export default CommentList;