const axios = require('axios');

const moment = require('moment');

const Spotify = require('node-spotify-api');

const fs = require('fs');

const dotenv = require('dotenv');

const keys = dotenv.config()

if (keys.error) {
  throw result.error
}

const action = process.argv[2];
const arg = process.argv.slice(3).join(" ");

const spotify = new Spotify({
  id: keys.parsed.SPOTIFY_ID,
  secret: keys.parsed.SPOTIFY_SECRET
});

const omdb = 'http://www.omdbapi.com/?apikey='+keys.parsed.OMDB_KEY+'&t='

// console.log(arg);

switch (action) {
case "spotify-this-song":
  spot(arg);
  break;

case "concert-this":
  conc(arg);
  break;

case "movie-this":
  mov(arg);
  break;

case "do-what-it-says":
  doWhat();
  break;

case 'help':
  console.log('Please enter a command, the following commands are available:\n'+'spotify-this-song\n'+'concert-this\n'+'movie-this\n'+'do-what-it-says');
  break;
}

function spot(x){
  if (x == '') {
    spotify.search({type: "track", query: 'Ace of Base The Sign', limit:1}, function(err, data){
      if (err) {
          return console.error(err);
      }
      for (var i = 0; i < data.tracks.items.length; i++) {
        console.log('Artist: ' + JSON.stringify(data.tracks.items[i].artists[0].name, null, 2));
        console.log('Album: ' + JSON.stringify(data.tracks.items[i].album.name, null, 2));
        console.log('Track Name: ' + JSON.stringify(data.tracks.items[i].name, null, 2));
        console.log('Preview: ' + JSON.stringify(data.tracks.items[i].preview_url, null, 2) + '\n');
      }
    });
  }else {
      spotify.search({type: "track", query: x, limit:5}, function(err, data){
        if (err) {
            return console.error(err);
        }
        // console.log(JSON.stringify(data.tracks.items[0], null, 2));
        for (var i = 0; i < data.tracks.items.length; i++) {
          console.log('Artist: ' + JSON.stringify(data.tracks.items[i].artists[0].name, null, 2));
          console.log('Album: ' + JSON.stringify(data.tracks.items[i].album.name, null, 2));
          console.log('Track Name: ' + JSON.stringify(data.tracks.items[i].name, null, 2));
          console.log('Preview: ' + JSON.stringify(data.tracks.items[i].preview_url, null, 2) + '\n');
        }
      });
    }
  }

function mov(y){
  if (y == '') {
    axios.get(omdb + "Mr. Nobody").then(
      function(res){
        console.log(res.data.Title);
        console.log('Released: ' + res.data.Year);
        console.log('imdb Rating: ' + res.data.imdbRating);
        console.log('Rotten Tomatoes Rating: ' + res.data.Ratings[1].Value);
        console.log('Country: ' + res.data.Country);
        console.log('Languages: ' + res.data.Language);
        console.log('Movie Plot: ' + res.data.Plot);
        console.log('Actors: ' + res.data.Actors +'\n');
      });
  }else {
    axios.get(omdb + y).then(
      function (res) {
        console.log(res.data.Title);
        console.log('Released: ' + res.data.Year);
        console.log('imdb Rating: ' + res.data.imdbRating);
        console.log('Rotten Tomatoes Rating: ' + res.data.Ratings[1].Value);
        console.log('Country: ' + res.data.Country);
        console.log('Languages: ' + res.data.Language);
        console.log('Movie Plot: ' + res.data.Plot);
        console.log('Actors: ' + res.data.Actors +'\n');
    });
  }
}

function conc(z){
  let bandsIn;

  if (z == '') {
    console.log("Please enter an artist");
  }else {
    axios.get(bandsIn = 'https://rest.bandsintown.com/artists/'+ z +'/events?app_id='+keys.parsed.BANDSIN_KEY).then(
      function(res,err) {
        if (err) {
          console.error(err);
        }else{
          for (var i = 0; i < 5; i++) {
            console.log(z + ' at The:');
            console.log(res.data[i].venue.name);
            console.log(res.data[i].venue.city);
            console.log(res.data[i].venue.country);
            console.log(moment(res.data[i].datetime).format('MM-DD-YY') + '\n');
          }
        }
    });
  }
}

function doWhat(){
  fs.readFile('random.txt', 'utf8', function(err,data) {
      if (err) {
        return console.error(err);
      }else {
      // console.log(data);
      let dataArr = data.split(',');
      // console.log(dataArr);

      for (var i = 0; i < dataArr.length; i++) {
        if (dataArr[i] == 'spotify-this-song') {
          console.log(dataArr[i+1]);
          spot(dataArr[i+1]);
        }else if (dataArr[i] == 'movie-this') {
          console.log(dataArr[i+1]);
          mov(dataArr[i+1]);
        }else if (dataArr[i] == 'concert-this') {
          console.log(dataArr[i+1]);
          conc(dataArr[i+1]);
        }
      }
    }
  });
}
