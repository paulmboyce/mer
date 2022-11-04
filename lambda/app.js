const https = require('https');
const convert = require('xml-js');

// Fields to extract:
const TITLE_DAILY_CO2_UPDATE = "DAILY CO2 UPDATE";
const DESC_DAILY_AVERAGE_CO2_AT_MAUNA_LOA = "DAILY AVERAGE CO2 AT MAUNA LOA";

// INIT DATA ON STARTUP
// ---------------------------------------
var objData = {rss:'data is not yet loaded. Make async'};
var dailyAvgCO2 = "Not set";
var dailyAvgCO2PubDate = "Not set";


/**
 * Pass the data to send as `event.data`, and the request options as
 * `event.options`. For more information see the HTTPS module documentation
 * at https://nodejs.org/api/https.html.
 *
 * Will succeed with the response body.
 */
const URL = "https://gml.noaa.gov/webdata/ccgg/trends/rss.xml" 

const lambdaHandler =  (event, context, callback) => {
    const req = https.request(URL, (res) => {
        let xmlData = '';
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            xmlData += chunk
        });
        res.on('end', () => {
            console.log('Successfully processed HTTPS response', res.headers['content-type']);
            // If we know it's JSON, parse it
            if (res.headers['content-type'] === 'text/xml') {

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

            }
            callback(null, {dailyAvgCO2, dailyAvgCO2PubDate});
        });
    });
    req.on('error', callback);
//    req.write(JSON.stringify(event.data));
    req.end();
};



exports.handler = lambdaHandler;