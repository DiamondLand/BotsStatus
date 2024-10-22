import express from 'express';
import fs from 'fs';
import ini from 'ini';
import fetch from 'node-fetch';

const app = express();

// Чтение конфигурации из config.ini
const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));
const tgToken = config.SETTINGS.tg_token;
const discordToken = config.SETTINGS.discord_token;
const serverAddress = config.SETTINGS.server_address || '127.0.0.1';
const PORT = config.SETTINGS.port

app.use(express.static('public'));

app.get('/status', async (req, res) => {
    // console.log('Запрос на /status получен');

    const platform = req.query.platform || config.SETTINGS.platform; // Получаем платформу из запроса

    if ((platform === 'telegram' && !tgToken) || (platform === 'discord' && !discordToken)) {
        return res.status(400).json({ status: 'error', message: 'Токен не указан для выбранной платформы.' });
    }

    try {
        let response;
        if (platform === 'telegram') {
            response = await fetch(`https://api.telegram.org/bot${tgToken}/getMe`);
        } else if (platform === 'discord') {
            response = await fetch(`https://discord.com/api/v10/users/@me`, {
                headers: {
                    'Authorization': `Bot ${discordToken}`
                }
            });
        }

        if (response.ok) {
            const data = await response.json();
            const status = platform === 'telegram' ? `@${data.result.username}` : `${data.username}`;
            res.json({ status: 'working', message: status });
        } else {
            console.error('Ошибка при получении данных:', response.statusText);
            res.status(response.status).json({ status: 'error', message: response.statusText });
        }
    } catch (error) {
        console.error('Ошибка:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, serverAddress, () => {
    console.log(`Сервер запущен на http://${serverAddress}:${PORT}`);
});
