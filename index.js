const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

// Đặt token của Facebook Page và Verify Token của bạn ở đây
const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN';
const VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN';

// Thiết lập webhook
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          sendMessage(event.sender.id, 'Hello! You sent: ' + event.message.text);
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Gửi tin nhắn
function sendMessage(senderId, text) {
  const messageData = {
    recipient: { id: senderId },
    message: { text: text }
  };

  request({
    uri: 'https://graph.facebook.com/v12.0/me/messages',
    qs: { access_token: EAAG3vlfHZC2IBO82AW0fZBNrrDoKG8ijg9cLnPTCzqUMGRMgLDkkDBgq3j1c4S5bRNOYBUBe0n0Wc12tMo66iClHdNv7qwgrJtxT8wT7UHUKE0H0YaqMcoxb9m4IDOND1KPVIJB35aJh9L26PNDgVwQ1qcenK2VeNkmtaj7ZAnJLYZAWUNWPd5g6UIZC2FCS3ZAQZDZD },
    method: 'POST',
    json: messageData
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
    } else {
      console.error('Unable to send message:' + err);
    }
  });
}

// Nhận dữ liệu từ Google Apps Script và gửi tin nhắn vào nhóm
app.post('/receive-form', (req, res) => {
  const responses = req.body.responses;
  const message = 'New Google Form response:\n' + responses.join('\n');

  // ID của nhóm chat
  const groupId = 'GROUP_CHAT_ID'; // Thay GROUP_CHAT_ID bằng ID của nhóm chat của bạn

  sendMessage(groupId, message);
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
