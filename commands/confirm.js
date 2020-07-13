var request = require('request');

exports.run = (client, message, args, config, discord) => {
  console.log(args[0])
  let code = args.shift();
  var options = {
    uri: 'https://anilist.co/api/v2/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    json: {
      'grant_type': 'authorization_code',
      'client_id': '1911',
      'client_secret': 'DnilDYLvoomLCOgbFk2oET3YfggjvUBwuLW39fHi',
      'redirect_uri': 'https://anilist.co/api/v2/oauth/pin', // http://example.com/callback
      'code': code, // The Authorization Code received previously
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.access_token);
    }else{
      console.log(response.statusCode);
      console.log(error);
    }
  });
  
}