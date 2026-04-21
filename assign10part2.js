var url = require('url');
var http = require('http');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kavin:12345@cluster0.wi2yeyj.mongodb.net/?appName=Cluster0";

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var urlObj = url.parse(req.url, true);
    res.write("Testing this out");
    path = urlObj.pathname;
    if (path == '/home') {
        res.write("<h1>HOME</h1>");
        res.write("<form id='placeForm' method='get' action='/process'>");
        res.write("<label>Place</label>: <input type='text' name='userInput'><br/>");
        res.write("<input type='submit' value='Submit'>");
        res.write("</form>");
    }
    else if (path == "/process") {
        res.write("<h1>PROCESS</h1>");
        //Check to see if it will get the information back
        placeInput = urlObj.query.userInput;
        res.write("<h2>Town or Zip: " + placeInput + "</h2>");
        //Check to see if it is a city name or a zip
        testPlace = placeInput[0]*1 + 0;
        console.log("TestPlace: " + testPlace);
        var client = new MongoClient(uri);
        client.connect();
        var useDb = client.db("assign10");
        var useColl = useDb.collection("places");
        if (!isNaN(testPlace)) {
            //This is a number
            res.write("<h3>This is a Zip Code</h3>");
            //Get the town associated with the zip Code
            //Perform a regex to get the place associated with the zip code
            const results = useColl.find({zips: {$regex: placeInput}});
            results.forEach(function(item) {
                console.log("Place: " + item.place);
                console.log("Zips: " + item.zips);
            });
        }
        else {
            res.write("<h3>This is a Town Name</h3>");
            const results = useColl.find({place: placeInput});
            results.forEach(function(item) {
                console.log("Place: " + item.place);
                console.log("Zips: " + item.zips);
            });
        }
    }
    res.end();
}).listen(8080);