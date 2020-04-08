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

// Search Bands in Town API
function getBandsInTown(artist) {
    var artist = search;
    var bandQueryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandQueryUrl).then(function(response) {
        console.log("****************************");
        console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
        console.log("Venue location: " + response.data[0].venue.city + "\r\n");
        console.log("Date of the event: " + moment(response.data[0].datetime).format("MM/DD/YYYY") + "\r\n");
    })
}
