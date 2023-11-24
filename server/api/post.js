import postDb from '../DAO/post.js'
import express from 'express';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

const app = express();
dotenv.config()

const uri = process.env.REACT_APP_API_POST
const deletePostURL = process.env.REACT_APP_API_DELETE_POST

/* NHẬN HÌNH ẢNH TỪ CLIENT CHUYỂN SANG */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single('content[image]');

app.post(uri, (req, res) => {
  console.log(req.body)
  upload(req, res, (err) => {
    if (err) {
      console.error('Lỗi khi tải lên bài đăng:', err);
      return res.status(400).json({ message: 'Invalid data sent.' });
    }

    const { sender, content, creationTime, displayMode } = req.body;
    const { text } = content;

    // Add Database
    let image = ""
    
    if (req.file)
      image = req.file.filename

    const post = {
      'sender': sender,
      'content': {
        'text': text,
        'image': image
      },
      'creationTime': creationTime,
      'displayMode': displayMode
    }

    postDb.addPost(post)

    res.json(true)
  });
});


/* TRUYỀN THÔNG TIN BÀI VIẾT SANG CLIENT */
app.get(uri, async function (req, res) {
  const post = await postDb.getAllPost()
  res.json(post);
})
/*************************************************/

/* NHẬN YÊU CẦU XÓA BÀI VIẾT */
app.post(deletePostURL, function (req, res) {
  const postID = req.body.postID; // Truy cập postID từ req.body
  
  postDb.deletePost(postID)
})
/*************************************************/

app.get('/limit-post', async function (req, res) {
  // Lấy tham số truy vấn từ URL
  const fromPost = req.query.fromPost;
  const toPost = req.query.toPost;
  const ownerID = req.query.ownerID
 
  const post = await postDb.getPosts(fromPost, toPost, ownerID)

  res.send(post);
});

app.get('/numberPost', async function (req, res) {

  const numberPost = await postDb.getNumberPost()
  
  res.send({numberPost});
});

app.get('/get-post-by-userID', async function(req, res) {

  const fromPost = req.query.fromPost;
  const toPost = req.query.toPost;
  const senderID = req.query.senderID

  const post = await postDb.getPostsByID(fromPost, toPost, senderID)

  console.log("/get-post-by-userID")
  console.log(fromPost, toPost, senderID)
  res.send(post);
})

export default app