const get = require('simple-get')
const util = require('util')

var convert = require('xml-js');

const express = require('express')
const app = express()
const port = 3000


// INIT DATA ON STARTUP
// TODO: Refactor to daily.
// ---------------------------------------

var objData = {rss:'data is not yet loaded. Make async'};

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
	console.log("Item [%s] Description: [%s] \n\n", item.title.value, item.description.value); 
    }
    
})


app.get('/', (req, res) => {


    res.send('\n\nHello World! The PPM this week is: XXX\n  ==> ' + JSON.stringify(objData.rss.channel.title)  );
	
})
       
app.listen(port, () => console.log('Example app listening on port ${port}!'));
