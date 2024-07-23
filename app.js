const express = require('express');
const path = require('path');

const app = express();

// Cấu hình để phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('Chào mừng đến với SVRecommend!');
});

// Khởi chạy server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
