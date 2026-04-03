const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const https = require('https');

// Берем токен из переменных окружения
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
const PORT = process.env.PORT || 3000;

// Render автоматически подставляет сюда твою текущую ссылку хостинга
const RENDER_URL = process.env.RENDER_EXTERNAL_URL; 

app.get('/', (req, res) => {
    res.send('Bio Bot is running.');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    
    // Авто-пинг, чтобы бесплатный тариф не засыпал
    if (RENDER_URL) {
        console.log(`Ping target set to: ${RENDER_URL}`);
        setInterval(() => {
            https.get(RENDER_URL).on('error', (err) => {
                console.error("Ping failed:", err.message);
            });
        }, 14 * 60 * 1000); // 14 минут
    } else {
        console.log("URL не найден, авто-пинг не работает.");
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
