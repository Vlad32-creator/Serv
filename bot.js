import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();
const app = express()


const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 5000;
const PASS = process.env.PASS;


app.get('/', (req, res) => {
    res.status(200).send({ success: true })
})

function checkThePass(req, res, next) {
    try {
        console.log(req.body);
        
        const { pass } = req.body;
        if (pass === PASS) {
            next();
        } else {
            return res.status(300).send({ success: false })
        }
    } catch (err) {
        console.log('Som thing went wrong',err);
        return res.status(500).send({success: false})
    }
}

app.use(express.json({limit: '5mb'}))
app.use(checkThePass)
app.post('/photo', (req, res) => {
    try {
        const { photo } = req.body;
        const BufferPhoto = Buffer.from(photo, 'base64');
        bot.sendPhoto(CHAT_ID, BufferPhoto);
        return res.send({ success: true });
    } catch (er) {
        console.log('Went som thing wrong');
        return res.status(500).send({ success: false })
    }
})
app.post('/', (req, res) => {
    try {
        const body = req.body;
        return res.send(body);
    } catch (err) {
        console.log('Went som thing wrong', err);
        return res.status(500).send({ success: false });
    }
})
app.post('/text', (req, res) => {
    try {
        console.log(req.body);
        const { message } = req.body;
        console.log(message);
        bot.sendMessage(CHAT_ID, message);
        return res.send({ success: true });
    } catch (err) {
        console.log('Went som thing wrong', err);
        return res.status(500).send({ success: false });
    }
})
app.listen(PORT, () => console.log(`Server start on http://localhost:${PORT}`));