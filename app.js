//Инициализация покетов и переменных//////////////////////
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Sequelize, Model, DataTypes } = require('sequelize');
let sequelize;
const mariadb = require('mariadb');
// OpenSQL();
async function OpenSQL() {
  await User.sync({ force: true });
  console.log("The table for the User model was just (re)created!");

  sequelize = new Sequelize('my-childs-daily-routine_db', process.env.SQLUser, process.env.SQLPass, {
      host: 'localhost',
      dialect: 'mariadb'
  });

  timetable.init({                    // подключение к таблице timetable
    event:   DataTypes.STRING,
    time:    DataTypes.DATE,
  }, {
      sequelize, modelName: 'timetable', timestamps: false
  });
  console.log('[32m\nSQL is open[0m')
};

function CloseSQL() {
  sequelize.close()
      .then(() => console.log('[32m\nSQL is close[0m'))
      .catch((err) => console.error('SQL Close connection error: ', err));
};

// // Testing the connection
// try {
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

//Старт бота//////////////////////////////////////////////
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.launch();

//Работа бота////////////////////////////////////////////////////////////
bot.command('UserID', (ctx) => ctx.reply(`UserID ` + ctx.from.id)); //Ответ на UserID - UserID
bot.start((ctx) => ctx.reply(`Я могу`,{                             //Ответ на /start - 2 кнопки
    reply_markup: {keyboard: [
      [{text:"Дочь покушала", callback_data: "callback1"},
       {text:"Дочь покакала", callback_data: "callback2"}],
  ]}
}));

bot.action("callback1",(ctx) => {
  OpenSQL();
});
bot.action("callback2",(ctx) => {
  CloseSQL();
});


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