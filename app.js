const get = require('simple-get')
const util = require('util')

const xml2js = require('xml2js');

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {

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
	    console.log(jsonData);

	    jsonData = JSON.parse(jsonData);


	});
    })


    // TODO: ASYNC - because thisjsoData is not yet ready...
    res.send('Hello World! The PPM this week is: XXX\n' + jsonData["rss"]);


})
       
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
