const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')


const app = express();
const data = {
  "idCount": 6,
  "data": [{
    "id": "1",
    "name": "Andy Liu",
    "title": "WTF UN airline...",
    "comment": "no one should be treated like this :(",
    "like": 0,
    "under": 0,
    "time": '2017/4/27 下午1:16:47',
    "reply":[{
      "id": "2",
      "name": "Rosa Chen",
      "comment": "I agree...",
      "time": '2017/4/28 下午2:55:40',
      "like": 0,
      "under": 1
    },
    {
      "id": "3",
      "name": "Romeo",
      "comment": "QQ",
      "time": '2017/4/29 上午3:12:11',
      "like": 0,
      "under": 1
    }]
  }]
};
var idCount = 4

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
// routing
app.get('/comments', function (req, res) {
  res.json(data);
});

// routing
app.post('/comments', function (req, res) {

  /*

  */
  var reqBody = (req.body);
  var newObj = {}
  if(reqBody.under==0){
    newObj['id'] = idCount;
    newObj['name'] = reqBody.name;
    newObj['title'] = reqBody.title;
    newObj['comment'] = reqBody.comment;
    newObj['like'] = reqBody.like;
    newObj['under'] = reqBody.under;
    newObj['time'] = reqBody.time;
    newObj['reply'] = [];  
    data['data'].push(newObj);
    idCount++;
    data['idCount'] = idCount;
  }else{
    newObj['id'] = idCount;
    newObj['name'] = reqBody.name;
    // no title//
    newObj['comment'] = reqBody.comment;
    newObj['like'] = reqBody.like;
    newObj['under'] = reqBody.under;
    newObj['time'] = reqBody.time;
    idCount++;
    data['idCount'] = idCount;
    let targetId = reqBody.under;
    for (let i = 0, l = data.data.length; i < l; i++) {
      if (data.data[i].id === targetId) {
        data['data'][i].reply.push(newObj)
      }
    }
  }
  res.json({ text: 'POST SUCCESS!' });
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
