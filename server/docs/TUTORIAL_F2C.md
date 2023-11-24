# Hướng Dẫn Sử Dụng Ứng Dụng React và Node.js để Gửi Dữ Liệu

Trong hướng dẫn này, chúng ta sẽ tạo một ứng dụng React cho phép gửi dữ liệu và một máy chủ Node.js để nhận dữ liệu. React sẽ chạy trên cổng 3000 và máy chủ Node.js cũng sẽ chạy trên cổng 3000.

## ▶️ Bước 1: Tạo Dự Án React

Trước tiên, chúng ta cần tạo một dự án React. Bạn có thể sử dụng Create React App hoặc tạo dự án React theo cách thủ công. Dưới đây là cách sử dụng Create React App:

```bash
npx create-react-app react-app
cd react-app
▶️ Bước 2: Tạo Giao Diện React
Chúng ta sẽ tạo một giao diện React cho việc nhập dữ liệu và gửi nó đến máy chủ Node.js. Dưới đây là ví dụ mã trong src/App.js.

jsx
Copy code
// Trong src/App.js

import React, { useState } from 'react';

function App() {
  const [data, setData] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gửi dữ liệu đến máy chủ Node.js
    const response = await fetch('http://localhost:3000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (response.ok) {
      console.log('Dữ liệu đã được gửi thành công.');
    }
  };

  return (
    <div>
      <h1>Gửi Dữ Liệu từ React tới Node.js</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập dữ liệu"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
}

export default App;
▶️ Bước 3: Tạo Máy Chủ Node.js để Nhận Dữ Liệu
Chúng ta cần tạo một máy chủ Node.js để nhận dữ liệu từ ứng dụng React. Sử dụng Express.js là một cách phổ biến để tạo máy chủ Node.js. Dưới đây là hướng dẫn tạo máy chủ Node.js.

// server.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Sử dụng body-parser để phân tích dữ liệu JSON
app.use(bodyParser.json());

// Xử lý yêu cầu POST từ ứng dụng React
app.post('/api/data', (req, res) => {
  const { data } = req.body;
  console.log('Dữ liệu đã nhận được:', data);
  res.status(200).json({ message: 'Dữ liệu đã được nhận thành công.' });
});

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Máy chủ Node.js đang lắng nghe tại http://localhost:${port}`);
});
.