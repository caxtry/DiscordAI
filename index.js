require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
});

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration)

client.on('messageCreate', async(message) => {
    if(message.author.bot) return;
    if(message.channel.id !== process.env.CHANNEL_ID) return;
    if(message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: 'You are a angry chatbot. '}]

    await message.channel.sendTyping();

    let prevMessage = await message.channel.messages.fetch({ limit: 15 })
    prevMessage.reverse();

    prevMessage.forEach((msg) => {
        if(message.content.startsWith('!')) return;
        if(msg.author.id !== client.user.id && message.author.bot) return;
        if(msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: message.content,
        })
    })
    
    // Example of a custom command:
   
    // if(message.content.match(/who am i/i) {
    //    message.reply(`You are ${message.author.username}`)
    //    return;
    // }
    
    // Custom Commands Down Here ⤵

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    })

    message.reply(result.data.choices[0].message)
})

client.login(process.env.TOKEN);
