const fetch = require("node-fetch");

exports.run = (client, message, args, config, discord) => {
  
  var query = `
  query ($userId: Int, $type: MediaType, $status: MediaListStatus) {
    MediaListCollection (userId: $userId, type: $type, status: $status){
      lists {
        entries{
          progress
          media{
            id
            title{
              romaji
            }
            nextAiringEpisode{
              timeUntilAiring
            }
            episodes
          }
        }
        name
      }
    }
  }
  `;

    // Define our query variables and values that will be used in the query request
    var variables = {
      userId: process.env.qmaz246_id,
      type: "ANIME",
      status: "CURRENT"
    };

    // Define the config we'll need for our Api request
    var url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      };

    // Make the HTTP Api request
    fetch(url, options).then(handleResponse)
                       .then(data => {
                        let list = data.data.MediaListCollection.lists[0].entries;
                        
                        var watchingEmbed = new discord.MessageEmbed()
                            //	39423
                          .setColor("0099ff")
                          .setTitle("Currently Watching")
                        var eps = "-";
                        var seconds = 0;
                        var nextep = "";
                        for (var i = 0; i < list.length; i++){
                          if (list[i].media.episodes != null){
                            eps = list[i].media.episodes
                          }else {
                            eps = "-"
                          }
                          if (list[i].media.nextAiringEpisode != null){
                            seconds = list[i].media.nextAiringEpisode.timeUntilAiring
                            var d = Math.floor(seconds / (3600*24));
                            var h = Math.floor(seconds % (3600*24) / 3600);
                            var m = Math.floor(seconds % 3600 / 60);
                            nextep = d + "d " + h + "h " + m + "m";
                          
                            watchingEmbed.addField(list[i].media.title.romaji, 
                            "Ep " + list[i].progress + "/" + eps + "\nid: " + list[i].media.id + "\nNext Episode: " + nextep)
                          }else{
                            watchingEmbed.addField(list[i].media.title.romaji, 
                            "Ep " + list[i].progress + "/" + eps + "\nid: " + list[i].media.id)
                          }
                        }
                        message.channel.send(watchingEmbed);
                      })
                       .catch(handleError);

}

function timeUntil(seconds){
  
  return new Date(seconds.timeUntilAiring * 1000).toISOString().substr(11, 8)
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });

}

function handleError(error) {
    console.log('Error, check console');
    console.error(error); 
    console.error(error.errors[0]);
}