// This is module for Tweet Translation
// const translatte = require("translatte");
const TJO = require("translate-json-object")();

// Init translation API
TJO.init({
  yandexApiKey: "trnsl.1.1.20181102T040612Z.1bfec7a9ed2a527e.3d201aa8a9b149bdf71d2e770e4328d26cbfb532"
});

exports.run = (client, message, args, config, discord) => {
    let tweet = args.join(" ");
    // for(var i = 0; i < args.length; i++){
    //     tweet = tweet + args[i];
    // }
    
    if (tweet.indexOf("@here") >= 0 || tweet.indexOf("@everyone") >= 0)
    {
      message.channel.send("Somebody thinks they're smart.")
    }
    else{
      TJO.translate({
        message: tweet
      }, "en").then(res => {
        message.channel.send("", {
          embed: {
            description: `${res.message}\n\n[Powered by Yandex.Translate](https://translate.yandex.com/)` // Is this necessary? The 'Powered by Yandex'?
          }
        });
      }).catch(err => {
        console.error(err);
        message.channel.send("An error has occurred with the translation API.");
      });
    }
  message.delete();
}