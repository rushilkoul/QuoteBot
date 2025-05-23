const Discord = require('discord.js')
module.exports = {
  name: 'ping',
  description: 'Get the bot\'s ping.',
  permissions: 'SEND_MESSAGES',
  category: 'Info',
  usage: '`.ping`',
  execute(message, args, client) {
    message.channel.send('🏓 Pong! `' + client.ws.ping + 'ms`.')
  }
}