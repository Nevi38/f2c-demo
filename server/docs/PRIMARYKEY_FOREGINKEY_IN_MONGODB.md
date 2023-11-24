Trong MongoDb không có khái niệm khóa chính và khóa ngoại, thay vào đó người ta sẽ dùng id và DBRef

## Để tham chiếu tới 1 document, xem xét ví dụ sau:
[authors.json]
{
    "_id": ObjectId("5f3e9acls2a7b9c3e1e485ccf6c"),
    "title": "My Post",
    "author": "John Doe"
}
[book.json]
{
    "_id": ObjectId("5f3e9a2a7b9c3e1e485ccf6d"),
    "title": "My Post",
    "author": 
    {
        "$ref": "authors" (name-collection),
        "$id": "5f3e9a2a7b9c3e1e485ccf6c" (ObjectId-document),
        "$db": "f2c" (name-database)
    }
}


## Để truy được giá trị của tham chiếu, vui lòng search từ khóa "Mongoose population"
## hoặc đường link sau: https://mongoosejs.com/docs/populate.html
Thư mục chứa code mẫu ./example/populate_mongoose.js