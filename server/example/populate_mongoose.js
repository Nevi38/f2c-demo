const mongoose = require('mongoose');
const { Schema } = mongoose;

// Thiết lập kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://localhost/f2c', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Kiểm tra kết nối
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  // Định nghĩa schema cho Person và Story
  const personSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    age: Number,
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
  });

  const storySchema = Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Person' },
    title: String,
    fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  });

  const Story = mongoose.model('Story', storySchema);
  const Person = mongoose.model('Person', personSchema);

  // Sử dụng một hàm async IIFE (Immediately Invoked Function Expression)
  (async () => {
    // Tạo một tác giả và một câu chuyện mới
    const author = new Person({
      _id: new mongoose.Types.ObjectId(),
      name: 'Ian Fleming',
      age: 50,
    });

    await author.save();

    const story1 = new Story({
      title: 'Casino Royale',
      author: author._id, // assign the _id from the person
    });

    await story1.save();

    // Tạo một vài người hâm mộ (fans)
    const fan1 = new Person({
      _id: new mongoose.Types.ObjectId(),
      name: 'Fan 1',
      age: 30,
    });

    const fan2 = new Person({
      _id: new mongoose.Types.ObjectId(),
      name: 'Fan 2',
      age: 25,
    });

    await fan1.save();
    await fan2.save();

    // Thêm fan cho câu chuyện (story)
    story1.fans.push(fan1._id);
    story1.fans.push(fan2._id);
    await story1.save();

    // Sử dụng populate để lấy danh sách các fans của câu chuyện
    const populatedStory = await Story.findOne({ title: 'Casino Royale' })
      .populate('author')
      .populate('fans')
      .exec();

    // In ra danh sách các fans của câu chuyện
    console.log('Title:', populatedStory.title);
    console.log('Author:', populatedStory.author.name);
    console.log('Fans:');
    for (const fan of populatedStory.fans) {
      console.log(fan.name);
    }

    // Đóng kết nối mongoose sau khi hoàn thành công việc
    mongoose.connection.close();
  })();
});
