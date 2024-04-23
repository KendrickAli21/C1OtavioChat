const dotenv = require('dotenv').config();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, {polling: true});



bot.on('message', async (msg) => {
  const dataAtual = new Date();
  const horaAtual = dataAtual.getHours();
  const horarioComercial = horaAtual >= 9 && horaAtual < 18;

  if (horarioComercial) {
    bot.sendMessage(msg.chat.id, 'Estamos Em horário comercial, favor visitar https://faesa.br');
  } else {
    bot.sendMessage(
      msg.chat.id,
      `Não estamos em horário comercial (09:00 às 18:00).\n` +
        `Insira seu email, para entrarmos em contato.`
    );

    bot.once('message', async (nextMsg) => {
      const userEmail = nextMsg.text;

      async function cadastrarEmail(EmailU : string, ChatId : string){
        // Salvar o e-mail no banco de dados
        await prisma.user.create({
          data: {
            email: userEmail,
          },
        });

        bot.sendMessage(
          msg.chat.id,
          `Obrigado! Seu e-mail ${userEmail} foi registrado. Entraremos em contato durante o horário comercial.`
        );
      } 
    });
  }
});