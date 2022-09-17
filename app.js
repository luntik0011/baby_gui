//Инициализация покетов и переменных//////////////////////
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Sequelize, Model, DataTypes } = require('sequelize');
let sequelize;
const mariadb = require('mariadb');

//Старт бота//////////////////////////////////////////////
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.launch();

//Работа бота////////////////////////////////////////////////////////////
bot.command('UserID', (ctx) => ctx.reply(`UserID ` + ctx.from.id)); //Ответ на UserID - UserID
bot.start((ctx) => ctx.reply(`Я могу`,{                             //Ответ на /start - 2 кнопки
    reply_markup: {keyboard: [
      [{text:"Дочь покушала", callback_data: "SayYes"},
       {text:"Дочь покакала", callback_data: "SayNo"}],
  ]}
}));


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//////////////////////////////////////////////////////////////
// bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));



//////////////////////////////////////////////////////////////
/* const http = require('http');

const hostname = '192.168.128.170';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}); */