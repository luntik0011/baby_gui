//Инициализация покетов и переменных//////////////////////
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Sequelize, Model, DataTypes } = require('sequelize');
let sequelize;
const mariadb = require('mariadb');
class timetable extends Model {};

//Инициализация SQL//////////////////////
SQLinit();
async function SQLinit(){
  sequelize = new Sequelize('',   //Подключение к mariaDB
    process.env.SQLUser, 
    process.env.SQLPass, {
      host: 'localhost',
      dialect: 'mariadb'
    });
  await sequelize.getQueryInterface().createDatabase('baby_gui_db'); //Создание БД 
  await sequelize.close()  //Отключение от mariaDB
  sequelize = new Sequelize('baby_gui_db',   //Подключение к mariaDB/baby_gui_db
  process.env.SQLUser, 
  process.env.SQLPass, {
    host: 'localhost',
    dialect: 'mariadb'
  });
  const timetable = sequelize.define( //Описание таблицы
    'timetable',
    {
    event: {
      type: Sequelize.STRING,
    },
    time: {
      type: Sequelize.DATE,
    },
  })
  await timetable.sync()//Создание таблицы
  await sequelize.close()  //Отключение от mariaDB
  .then(() => console.log('[32mИнициализация SQL прошла успешно[0m'))
  .catch((err) => console.error('[32mИнициализация SQL прошла с ошибкой: [0m', err));
}

async function OpenSQL() {
  sequelize = new Sequelize('baby_gui_db',   //Подключение к mariaDB/baby_gui_db
    process.env.SQLUser, 
    process.env.SQLPass, {
      host: 'localhost',
      dialect: 'mariadb'
    }) 
    console.log('[32mSQL is open[0m')

  timetable.init({
    event: DataTypes.STRING,
    time:  DataTypes.DATE,
  },{
    sequelize, modelName: 'timetable'
  });
};

async function CloseSQL() { //Отключение от базы
  await sequelize.close()
      .then(() => console.log('[32mSQL is close[0m'))
      .catch((err) => console.error('[32mSQL Close connection error: [0m', err));
};

async function PostSQL(event, time = Date.now()) { //Запись в таблицу
  await timetable.create({
    event: event,
    time:  time,
  });
};

async function BabyStatys(){
  let Statys = '';
  let options = {hour: 'numeric', minute: 'numeric' };
  await OpenSQL();
  RequestSQL = await timetable.findOne({where: {event: 'Eat'}});
  Statys += (`Поела ${RequestSQL.dataValues.time.toLocaleDateString('ru-RU', options)}\n`)
  RequestSQL = await timetable.findOne({where: {event: 'Shitting'}});
  Statys += (`Покакала ${RequestSQL.dataValues.time.toLocaleDateString('ru-RU', options)}\n`)
  RequestSQL = await timetable.findOne({where: {event: 'Sleep'}});
  Statys += (`Уснула ${RequestSQL.dataValues.time.toLocaleDateString('ru-RU', options)}\n`)
  RequestSQL = await timetable.findOne({where: {event: 'WakeUp'}});
  Statys += (`Проснулась ${RequestSQL.dataValues.time.toLocaleDateString('ru-RU', options)}\n`)
  CloseSQL();
  return (Statys);
}

//Старт бота//////////////////////////////////////////////
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.launch();

//Работа бота////////////////////////////////////////////////////////////
bot.command('UserID', (ctx) => ctx.reply(`UserID ` + ctx.from.id)); //Ответ на UserID - UserID
bot.start((ctx) => ctx.reply(`Я могу`,{                             //Ответ на /start - 2 кнопки
    reply_markup: {keyboard: [
      [{text:"Поела"},
       {text:"Покакала"}],
      [{text:"Уснула"},
       {text:"Проснулась"}],
  ]}
}));

bot.hears('Поела', async (ctx) => {
  await OpenSQL();
  await PostSQL('Eat');
  await CloseSQL();
});
bot.hears('Покакала', async (ctx) => {
  await OpenSQL();
  await PostSQL('Shitting');
  await CloseSQL();
});
bot.hears('Уснула', async (ctx) => {
  await OpenSQL();
  await PostSQL('Sleep');
  await CloseSQL();
});
bot.hears('Проснулась', async (ctx) => {
  await OpenSQL();
  await PostSQL('WakeUp');
  await CloseSQL();  
});

bot.command('Statys', async (ctx) => ctx.reply(await BabyStatys()));

// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
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