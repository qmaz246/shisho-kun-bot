const fetch = require("node-fetch");
const accessToken = process.env.quinn_id;

exports.run = (client, message, args, config, discord) => {
  if (args.length < 2){
    message.channel.send("Please provide an anime id to mark as complete and provide a score (0-10).\nYou can find the id by using !search or !watching")
  }else if(message.author.id == 151336079553855488){
    var animeId = args.shift();
    var score = args.shift();
    var query1 = `
    mutation ($mediaId: Int, $status: MediaListStatus) {
          SaveMediaListEntry (mediaId: $mediaId, status: $status) {
              id
              status
              progress
              media {
                episodes
              }
          }
      }
    `;

    var variables = {
        "mediaId": animeId,
        "status": "CURRENT"
    };


    var url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query1,
              variables: variables
          })
    };


    fetch(url, options).then(handleResponse)
                     .then(data => {
                        var query2 = `
                        mutation ($id: Int, $status: MediaListStatus, $progress: Int, $score: Float) {
                          SaveMediaListEntry (id: $id, status: $status, progress: $progress, score: $score) {
                              id
                              status
                              progress
                              score
                          }
                        }
                        `;

                        var variables = {
                            "id": data.data.SaveMediaListEntry.id,
                            "progress": data.data.SaveMediaListEntry.media.episodes,
                            "status": "COMPLETED",
                            "score": score
                        };
                        console.log(variables.progress);

                        var url2 = 'https://graphql.anilist.co',
                        options = {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + accessToken,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                query: query2,
                                variables: variables
                            })
                        };
                        fetch(url2, options).then(handleResponse)
                                            .then(handleData)
                                            .catch(handleError); 

                    })
                     .catch(handleError); 
  }else{
    message.channel.send("Only Qmaz246 can alter his anime list")
  }
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
  
}

function handleError(error) {
    console.log('Error, check console');
    console.error(error);
}