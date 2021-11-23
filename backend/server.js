require('dotenv').config();
const express = require('express');
const DBConnect = require('./Database');
const app = express();
const router = require('./routes/AuthRoute');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));
app.use('/storage', express.static('storage'));
const PORT = process.env.PORT || 5000;

DBConnect();

app.use(express.json({ limit: '50mb' }));
app.use(router);

app.get('/', (req, res) => {
    res.send("Hello from Server");
})



app.listen(PORT, () => {
    console.log(`Server running of Port ${PORT}`);
})