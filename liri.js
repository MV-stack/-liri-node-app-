require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
moment().format();
var axios = require("axios");
var fs = require("fs");

// Get arguments for liri
var command = process.argv[2];
var search = process.argv.splice(3).join(" ");


//Switch statement for liri commands
function liriBot(command, search) {
    switch(command){
        case "concert-this":
            getBandsInTown(search);
            break;
        case "spotify-this-song":
            getSpotify(search);
            break;
        case "movie-this":
            getOMDB(search);
            break;
        case "do-what-it-says":
            getRandom();
            break;
        default:
            console.log("Please enter one of the following commands:\"concert-this\", \"spotify-this-song\", \"movie-this\", \"do-what-it-says\"");    
    }
};

// Bands in Town API
function getBandsInTown(artist) {
    var artist = search;
    var bandQueryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandQueryUrl).then(function(response) {
        console.log("****************************");
        console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
        console.log("Venue location: " + response.data[0].venue.city + "\r\n");
        console.log("Date of the event: " + moment(response.data[0].datetime).format("MM/DD/YYYY") + "\r\n");

        // Append concert info to log.txt
        var concerts = "************Concert************" + "\nArtist name: " + artist + "\nName of the venue: " + response.data[0].venue.name;
        fs.appendFile("log.txt", concerts, function(err) {
            if (err) throw err;
        });
    });
};

// Spotify API
function getSpotify(songName) {
    if (!songName) {
        songName = "\"The Sign\" by Ace of Base";
    };
    spotify.search({ type: "track", query: songName }, function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        };
        console.log("****************************");
        console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        console.log("Preview Link: " + data.tracks.items[0].href + "\r\n");
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");
        // Apppend song info to log.txt
        var songs = "************Song************" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\r\n" ;
        fs.appendFile("log.txt", songs, function(err) {
            if (err) throw err;
        });
    });
};

//OMDB API
function getOMDB(movie) {
    if (!movie) {
        movie = "Mr. Nobody";
    };
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.request(movieQueryUrl).then(function(response){
        console.log("****************************");
        console.log("Title: " + response.data.Title + "\r\n");
        console.log("Year: " + response.data.Year + "\r\n");
        console.log("IMDB Rating: " + response.data.imbdRating + "\r\n"); 
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
        console.log("Country: " + response.data.Country + "\r\n");
        console.log("Language: " + response.data.Language + "\r\n");
        console.log("Plot: " + response.data.Plot + "\r\n");
        console.log("Actors: " + response.data.Actors + "\r\n");
        // Append movie info to log.txt
        var movies = "************Movie*************" + "\nMovie: " + response.data.Title + "\nYear: " + response.data.Year + "\nIMDB Rating: " + response.data.imbdRating +
        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + 
        response.data.Plot + "\nActors: " + response.data.Actors;
        fs.appendFile("log.txt", movies, function(err) {
            if (err) throw err;
        });
    });
};

//Random function
function getRandom() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if (error) {
            return console.log(error);
        } else {
            console.log(data);
            var randomData = data.split(",");
            liriBot(randomData[0], randomData[1]);
        }
    });
};

//Log everything
function logResults(data) {
    fs.appendFile("log.txt", data, function(err) {
        if (err) throw err;
    });
};

//Initialize and run liriBot
liriBot(command, search);

        