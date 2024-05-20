const { Server } = require('socket.io');
const { createServer } = require('node:http');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Thiết lập Socket
const server = createServer(app);
const io = new Server(server);

// Thiết lập đường dẫn tĩnh cho các thư mục
app.use(express.static(path.join(__dirname, '')));

// Đường dẫn cho các file tĩnh (css, js, fonts, assets)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Đường dẫn cho index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("Một người dùng đã kết nối");
    socket.on("send-mouseup", (jsonString) => {
        console.log("Đã nhận từ máy khách!");
        socket.broadcast.emit("receive-mouseup", jsonString);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
