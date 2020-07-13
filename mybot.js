/***************************************
Discord Bot for use on the Qmaz's Emoji Laboratory Discord Server
Made by Quinn Mazzilli, qmaz246
Main function is to provide various 

Other functions included are not for primary function but are still accessable.
More may be added in the future.

***************************************/

const discord = require("discord.js");

//***Config file***//
// Contains information such as:
// Prefix for commands
// Token for bot
// Owner ID
// Role list
// config files
const config_env =
  process.env.TOKEN == undefined ? require("./.env") : process.env;
const config = require("./config.json");

const client = new discord.Client();
client
  .login(process.env.TOKEN)
  .then(console.log("Logged In to Discord API!"));
client.once("ready", () => console.log("Starting Shisho-kun-bot! ~Ara Ara~"));


// Discord Rich Presense
client.on("ready", () => {
  client.user.setActivity("Lolis", {
    type: "Lewding"
  });
});

//Message sent in chat with command prefix
client.on("message", message => {
  if(message.author.bot) {
    return;
  }
  if(message.content.charAt(0) != config.prefix){
    return;
  }
  // This is the best way to define args. Trust me.
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args, config, discord);
  } catch (err) {
    console.error(err);
  }
});

