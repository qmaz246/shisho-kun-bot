exports.run = (client, message, args, config, discord) => {
  message.channel.send('https://anilist.co/api/v2/oauth/authorize?client_id=1911&redirect_uri=https://anilist.co/api/v2/oauth/pin&response_type=code').then(msg => {msg.delete({ timeout: 3000 });});
}