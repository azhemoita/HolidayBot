const fs = require('fs');
const { EventEmitter } = require('events');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const myEmitter = new EventEmitter();
const bot = new Telegraf(process.env.BOT_TOKEN);
const date = new Date();

myEmitter.setMaxListeners(15);

bot.catch((err, ctx) => {
    console.log('ERROR', err);
});

fs.readFile('./holidays.json', 'utf-8', (err, data) => {
    if (err) console.log(err);
    const holidayObj = JSON.parse(data);
    const today = date.toLocaleString('ru', {
        day: 'numeric',
        month: 'long',
    });
    const holiday = holidayObj[today];

    bot.start((ctx) => {
        ctx.reply(
            `Привет, ${ctx.update.message.from.first_name}!\nЭто HolidayBot!\nДля справки введите команду - /help`
        );
        ctx.reply(
            `Сегодня ${date.toLocaleString('ru', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })}\n${holiday}`
        );
        let timerId = setInterval(
            () =>
                ctx.reply(
                    `Сегодня ${date.toLocaleString('ru', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}\n${holiday}`
                ),
            86400000
        );
        myEmitter.on('timer', () => {
            clearInterval(timerId);
        });
    });
});

bot.command(['stop', 'finish'], (ctx) => {
    myEmitter.emit('timer');
    ctx.reply(
        'Бот больше не шлёт сообщения.\nДля запуска бота введите команду - /start'
    );
});

bot.help((ctx) =>
    ctx.reply(
        'Бот каждый день присылает сообщение о том какой сегодня праздник.\n Чтобы остановить бота введите любую из команд: /stop или /finish'
    )
);

bot.launch()
    .then((res) => console.log('Started'))
    .catch((err) => console.log(err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
