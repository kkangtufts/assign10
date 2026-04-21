var url = require('url');
var http = require('http');
var port = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kavin:12345@cluster0.wi2yeyj.mongodb.net/?appName=Cluster0";

//This will be used to display the town and zip codes on the page
var printPlace = "NOTHING";
var printZips = "NOTHING";

http.createServer(async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var urlObj = url.parse(req.url, true);
    res.write("<h1>Kavin Kang Assignment 10 Part 2</h1>");
    path = urlObj.pathname;
    if (path == '/home') {
        res.write("<h2>Home</h2>");
        res.write("<form id='placeForm' method='get' action='/process'>");
        res.write("<label>Place</label>: <input type='text' name='userInput'><br/>");
        res.write("<input type='submit' value='Submit'>");
        res.write("</form>");
    }
    else if (path == "/process") {
        res.write("<h2>Process</h2>");
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
            validRes = false;
            await results.forEach(function(item) {
                console.log("Place: " + item.place);
                console.log("Zips: " + item.zips);
                printPlace = item.place;
                printZips = item.zips;
                validRes = true;
            });
            if (!validRes) {
                printPlace = "INVALID";
                printZips = "INVALID";
            }
            res.write("<h3>Place: " + printPlace + "</h3>");
            res.write("<h3>Zips: " + printZips + "</h3>");
        }
        else {
            res.write("<h3>This is a Town Name</h3>");
            const results = useColl.find({place: placeInput});
            
            validRes = false;
            await results.forEach(function(item) {
                console.log("Place: " + item.place);
                console.log("Zips: " + item.zips);
                printPlace = item.place;
                printZips = item.zips;
                validRes = true;
            });
            if (!validRes) {
                printPlace = "INVALID";
                printZips = "INVALID";
            }
            res.write("<h3>Place: " + printPlace + "</h3>");
            res.write("<h3>Zips: " + printZips + "</h3>");
        }
    }
    res.end();
}).listen(port);