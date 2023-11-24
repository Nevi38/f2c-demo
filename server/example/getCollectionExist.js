// https://mongoosejs.com/docs/api/connection.html#Connection.prototype.collection()
// https://mongodb.github.io/node-mongodb-native/Next/classes/Collection.html#find
const mongoose = require('mongoose');

// Kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://localhost/f2c', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Đã kết nối đến MongoDB');
    
    // Truy vấn dữ liệu từ collection 'users' đã tồn tại
    const db = mongoose.connection;
    const collection = db.collection('people');
    
    // Thực hiện truy vấn (ví dụ: lấy tất cả các documents)
    const users = await collection.find()
    .skip(1)
    .toArray();
    
    // In ra danh sách các users
    console.log(users);
    

    // Đóng kết nối sau khi truy vấn xong
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Lỗi kết nối đến MongoDB:', err);
  });
