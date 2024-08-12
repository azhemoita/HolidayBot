'use strict';
const { EventEmitter } = require('events');
const { Telegraf } = require('telegraf');
const cron = require('node-cron');
require('dotenv').config();

const myEmitter = new EventEmitter();
const bot = new Telegraf(process.env.BOT_TOKEN);
const date = new Date();
const chatId = process.env.CHAT_ID;

myEmitter.setMaxListeners(15);

bot.catch((err, ctx) => {
  console.log('ERROR', err);
});

const getHolidayUrl = () =>
  `https://www.calend.ru/img/export/informer_1.png?t=${Math.random()}`;

const sendHoliday = () => {
  bot.telegram.sendPhoto(chatId, getHolidayUrl());
};

bot.start((ctx) => {
  ctx.reply(`Сегодня праздник 🎉 \nСправка /help`);
  sendHoliday();
});

cron.schedule('00 01 * * *', sendHoliday);

bot.help((ctx) =>
  ctx.reply(
    'Бот каждый день присылает сообщение в 8:00 утра о том какой сегодня праздник.'
  )
);

bot
  .launch()
  .then(() => console.log('Started'))
  .catch((err) => console.log(err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
