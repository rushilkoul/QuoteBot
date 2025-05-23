const Discord = require('discord.js')
const ms = require('ms')
module.exports = {
    name: 'quote',
    description: 'Quote a message.',
    permissions: 'SEND_MESSAGES',
    category: 'Info',
    usage: '`.Quote`',
    async execute(message, args, client, db) {

        let collected;
        let time;
        let threshold;

        if(message.type == "REPLY")  {
            collected = await message.channel.messages.fetch(message.reference.messageId)
            time = args[1] ? ms(args[1]) : 30000;
            threshold = args[0] ? args[0] : 2;

        } else {
            if (!args[0]) return message.reply("Please specify a message ID.")

            try {
                collected = await message.channel.messages.fetch(args[0])
            } catch (err) {
                // nothing :D
            }
            
            // if(!collected) {
            //     message.guild.channels.cache.forEach(chnl => {
            //         if(message.guild.channels.cache.get(chnl.id).type == "GUILD_TEXT") {
            //             let l_channel = message.guild.channels.cache.get(chnl.id);
            //             findChannel(l_channel);]
            //             let l_collected;
            //             console.log(args[0])
                        
            //             l_collected = await l_channel.messages.fetch(args[0])
            //             console.log(l_collected)
            //         }
            //     })
            // }

            
            let notfoundEmbed = new Discord.MessageEmbed()
            .setAuthor("I could not find this message.")
            .setDescription("This could be due to the message being in another channel.\n**Ways to properly Use:**")
            .addField("Using Message ID", "Use `.quote <message-id>` in the same channel as the message! It will not work if the message is in another channel.")
            .addField("Using Mentions", "Simply reply to a message with `.quote` and I'll begin the voting process!")
            .setTimestamp()
            .setFooter("I plan to soon fix the message not being visible if its not in the same channel.")
            if(!collected) return message.reply({embeds: [notfoundEmbed]})

            time = args[2] ? ms(args[2]) : 30000;
            threshold = args[1] ? args[1] : 2;
        }
        
        if(!collected) return;        
        
        
        let voteEmbed = new Discord.MessageEmbed()
        .setAuthor("Vote for a quote!", collected.author.displayAvatarURL())
        .setDescription("React with 👍 to vote for this to be quoted!")
        .addField(collected.author.tag, collected.content)
        .setColor("#ffffff")
        .setTimestamp()
        .setFooter(`Quote requested by ${message.author.tag}`)
        
        console.log(time)

        let voteMsg = await message.channel.send({embeds: [voteEmbed]}).then(async function(message) {
            await message.react('👍')
            const filter = (reaction, user) => {
               return reaction.emoji.name === '👍'
            };
     
            const collector = message.createReactionCollector(filter, {
                time: 5000 
            });
     
            collector.on('collect', (reaction, reactionCollector) => {
                let reactions = collector.users.size;
                if(reactions >= threshold) {
                    message.reply("You have enough votes! Congratulations, your message will now be quoted!")
                    collector.stop();
                }
            });

            // collector.on('end', collected => {
            //     message.channel.send(`**${message.content}** was not quoted because they ran out of time.`)
            // });
         });

       
    }
}