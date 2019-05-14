const get = require('simple-get')
const util = require('util')

const xml2js = require('xml2js');

const express = require('express')
const app = express()
const port = 3000

    var jsonData = {rss:"data is not yet loaded. Make async"};
    
    var parseString = xml2js.parseString;    

    get.concat('https://www.esrl.noaa.gov/gmd/webdata/ccgg/trends/rss.xml', function (err, res, xmlData) {
	if (err) throw err
	console.log(res.statusCode) // 200
	console.log(xmlData) // Buffer('this is the server response')

	parseString(xmlData, function (err, result) {
	    console.dir(result);
	    console.log(util.inspect(result, false, null))
	    jsonData = JSON.stringify(result);
//	    console.log(jsonData);
	    console.log("Parsed XML Data from https://www.esrl.noaa.gov/ feed [OK]");
	    console.log("Waiting for requests..");

	});
    })


app.get('/', (req, res) => {

//    console.log(JSON.stringify(jsonData));

    // TODO: ASYNC - because thisjsoData is not yet ready...
    console.log("1");
	jsonData = JSON.parse(JSON.stringify(jsonData));

    var parsedJson = JSON.parse(jsonData);


    var rss = parsedJson.rss;
    console.log("\n\nRSS: ==> " + JSON.stringify(rss) );

    var channel = JSON.parse(JSON.stringify(rss.channel));
    console.log("\n\nCHANNEL: ==> " + JSON.stringify(channel) );;

// Channl is the colllection...
    var title = channel[0].title;
    console.log("TITLE: ==> " + title );

    var item = channel[0];
			  
    res.send('\n\nHello World! The PPM this week is: XXX\n' + title + " ==> " + JSON.stringify( item)  );
	



})
       
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
