const Discord = require('discord.js')
const Intents = Discord.Intents
const dotenv = require('dotenv')
const fs = require('fs')
const colors = require('colors')
const db = require('quick.db');


dotenv.config()

const prefix = '.'
const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

//advanced command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
console.log("REGISTERING COMMANDS".cyan)
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  
  if(!command.name || !command.category){
    console.log('-----------------------------'.cyan)
    console.log(`${command.category} - ${prefix}${command.name} ❌️ `.bgMagenta)
    continue;
}
console.log('-----------------------------'.cyan)
console.log(` ${command.category} - ${prefix}${command.name} ✔️`.bgMagenta)
client.commands.set(command.name, command);
}
console.log('-----------------------------'.cyan)


client.on('ready', () => {
    console.log("QuoteBot is online".green)
    client.user.setPresence({ 
        activities: [{ 
            name: 'everything you type',
            type: "WATCHING"  // LISTENING, STREAMING ( requires URL ), PLAYING, WATCHING
        }] 
    });
})

client.on('messageCreate', async (message) => {
    // Embed to warn that DMs cant be used
    const dmEmbed = new Discord.MessageEmbed()
        .setAuthor("I am not available in DMs!", message.author.displayAvatarURL())
        .setDescription("You can not use QuoteBot in DMs.")

    if (message.channel.type == 'DM'){
        let dmchannel = await message.guild.members.cache.get(message.author.id).createDM()
        dmchannel.send({ embeds: [dmEmbed] })
        return;
    }
    if (message.author == client.user || !message.content.startsWith(prefix)) return;

    //if message is not a DM, the message starts with prefix
    //and the message author is not a bot, we run the command that the user sent
    handleCommand(message)
})

function handleCommand(message) {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    let botCommand = client.commands.get(command)
    if (!botCommand) return;
    botCommand.execute(message, args, client, db)

}
client.login(process.env.TOKEN)