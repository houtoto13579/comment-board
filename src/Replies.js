import React, { Component } from 'react';
class ReplyList extends Component {
  constructor(){
    super();
    this.createList=this.createList.bind(this);
  }
  createList(replyBlock){
    return (  
      <div key={`reply-${replyBlock.under}-${replyBlock.id}`} className="replyBlock">
        <div className="replyNameAndComment">
          <span className="replyName">
            {replyBlock.name+': '}
          </span>
          <span className="replyComment">
            {replyBlock.comment}
          </span>
        </div>
        <div className="replyTime">
          {replyBlock.time}
        </div>
      </div>
    )
  }

  render() {
    let listArr = this.props.list;
    var listArrRender = listArr.map(this.createList);
    return (
        <div className="replyList">
          {listArrRender}
        </div>
    );
  }
}

export default ReplyList;