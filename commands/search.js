const fetch = require("node-fetch");

const dict = {
  0: ":one:",
  1: ":two:",
  2: ":three:",
  3: ":four:",
  4: ":five:"}
/* !search num [search content] */

exports.run = (client, message, args, config, discord) => {
  var num = args.shift();
  var searqry = ""
  for (var words in args) {
    searqry += args[words]
    searqry += " "
  }
  
  // Here we define our query as a multi-line string
  // Storing it in a separate .graphql/.gql file is also possible
  var query = `
  query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (id: $id, type: $type, search: $search) {
        id
        title {
          romaji
        }
        genres
        format
        popularity
        averageScore
      }
    }
  }
  `;
  
  // Define our query variables and values that will be used in the query request
  var variables = {
    search: searqry,
    page: 1,
    perPage: num,
    type: "ANIME"
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
                      if (num > data.data.Page.pageInfo.total){
                        num = data.data.Page.pageInfo.total
                      }
                     
                      const searchEmbed = new discord.MessageEmbed()
                            //	39423
                            .setColor("0099ff")
                            .setTitle("Search Results")
                      for (var i = 0; i < num; i++){
                        searchEmbed.addField(dict[i], 
                                data.data.Page.media[i].id
                                + " | " +             
                                data.data.Page.media[i].title.romaji
                                + " | " +
                                data.data.Page.media[i].format 
                                + " | " +
                                data.data.Page.media[i].popularity + " watchers"
                                + " | " +
                                data.data.Page.media[i].averageScore + "%")
                      }
                      message.channel.send(searchEmbed);
                    })
                     .catch(handleError);
  
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
  
}

function handleError(error) {
    console.log('Error, check console');
    console.error(error);
}