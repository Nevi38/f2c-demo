import axios from 'axios'

const PORT = process.env.REACT_APP_PORT
const PATH = process.env.REACT_APP_API_POST
const URL = `${process.env.REACT_APP_SEVER_IP}:${PORT}${PATH}`

const sendImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Hình ảnh đã được tải lên thành công.', response.data);
    } catch (error) {
      console.error('Lỗi khi tải lên hình ảnh:', error);
    }
  };

export default sendImageToServer;
