const get = require('simple-get')
const util = require('util')

var convert = require('xml-js');

const express = require('express')
const app = express()
const port = 3000



// Fiels to extract:
const TITLE_DAILY_CO2_UPDATE = "DAILY CO2 UPDATE";
const DESC_DAILY_AVERAGE_CO2_AT_MAUNA_LOA = "DAILY AVERAGE CO2 AT MAUNA LOA";

// INIT DATA ON STARTUP
// TODO: Refactor to refresh hourly.
// ---------------------------------------
var objData = {rss:'data is not yet loaded. Make async'};
var dailyAvgCO2 = "Not set";
var dailyAvgCO2PubDate = "Not set";


get.concat('https://www.esrl.noaa.gov/gmd/webdata/ccgg/trends/rss.xml', function (err, res, xmlData) {
    if (err) throw err
    console.log(res.statusCode) // 200
    console.log(xmlData) // Buffer('this is the server response')

    // Print as JSON data (for info only)
    var jsonData = convert.xml2json(xmlData, {compact: false, spaces: 4});
    console.log ("jsonData ==> %s", jsonData);


    var options = {ignoreComment: true, alwaysChildren: true, compact:true, textKey: 'value', textFn: function(val) {return val.toUpperCase();}};
    objData = convert.xml2js(xmlData, options);
    console.log ("objData ==> %s", objData);
    console.log ("objData.rss ==> %s", objData.rss);

    console.log(Object.keys(objData.rss.channel));
    
    var rss = objData.rss;
    console.log("\n\nRSS: ==> " + JSON.stringify(rss) );


    var channel = rss.channel;
    console.log("\n\nCHANNEL: ==> " + JSON.stringify(channel) );;

    var title = channel.title;
    console.log("TITLE: ==> %s \n\n" ,title );

    console.log("About to print channel.item... \n");
    console.log(channel.item);

    console.log("About to print channel.item KEYs.. \n");
    console.log(Object.keys(objData.rss.channel.item));

    console.log("About to print channel.items.. \n");
    var items= channel.item;


    
    var i, item;
    for (i = 0; i < items.length; i++) {
	item = items[i];
	//	console.log("Item KEYS ==> [%s]", Object.keys(item));
	//	console.log(item);

	if (item.title.value.includes(TITLE_DAILY_CO2_UPDATE)  ) {
	    var description = item.description.value;
	    console.log("\nFOUND DAILY_AVERAGE_CO2_AT_MAUNA_LOA  [%s] \n\n", description);
	    var idx = description.indexOf ("PPM");
	    
	    
	    dailyAvgCO2PubDate = item.pubDate.value;
	    dailyAvgCO2 = description.slice (idx -8 , idx -1).trim();
	}
	console.log("\nTitle ==> [%s] \nDescription ==> [%s] \n\n", item.title.value, item.description.value);
	
    }
    console.log('\n\nThe latest daily PPM is:  ==> %s ppm [Published %s] \n\n',  dailyAvgCO2, dailyAvgCO2PubDate );
    
})


app.get('/', (req, res) => {


    res.send('\n\nThe latest daily CO2 PPM is:  ==>  ' +  dailyAvgCO2 + ' ppm \n\n'  );
	
})
       
app.listen(port, () => console.log('Example app listening on port ${port}!'));
