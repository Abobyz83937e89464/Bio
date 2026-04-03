const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const https = require('https');

// Берем токен из переменных окружения Render
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Поднимаем Express сервер (Render требует, чтобы проект слушал порт)
const app = express();
const PORT = process.env.PORT || 3000;

// Ссылка на твой сервис в Render (нужно добавить в Env Variables)
// Пример: https://bio-bot-xyz.onrender.com
const RENDER_URL = process.env.RENDER_URL; 

app.get('/', (req, res) => {
    res.send('Bio Bot is running.');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    
    // Тот самый Cron Job (интервал). Пингуем сами себя каждые 14 минут
    if (RENDER_URL) {
        setInterval(() => {
            https.get(RENDER_URL).on('error', (err) => {
                console.error("Ping failed:", err.message);
            });
        }, 14 * 60 * 1000); // 14 минут в миллисекундах
    } else {
        console.log("RENDER_URL не указан, авто-пинг отключен.");
    }
});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const text = "Привет. Нажмите кнопку ниже, чтобы открыть био Morpheusov.qmor.";
    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: "Открыть Био", 
                        web_app: { url: "https://abobyz83937e89464.github.io/Bio/" } 
                    }
                ]
            ]
        }
    };
    
    bot.sendMessage(chatId, text, options);
});
