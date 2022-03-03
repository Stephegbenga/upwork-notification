const express = require('express');
var axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8080
const RECEIVER_MAIL = 'redsparrowthemes@gmail.com'

// Add Your filters here in this same pattern
const filters = ['filter1', 'filter2', 'filter3', 'filter4']

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());



var Watcher = require('feed-watcher'),
    feed = 'https://www.upwork.com/ab/feed/topics/rss?securityToken=b8e5052ff4df0053792291f42acb2df19553f68e625fe0b5773e2e0270055a2043b0dcf4975ceefe37f3b7d088c29c02d4adcb5c57609fff694a8bb572210eed&userUid=1292537039223943168&orgUid=1292537039223943170'
interval = 10 // seconds
// if not interval is passed, 60s would be set as default interval.
var watcher = new Watcher(feed, interval)


watcher.on("new entries", function (entries) {
    entries.forEach(function (entry) {

        let titled = entry.title;
        let descriptioned = entry.description;


        result1 = filters.every(w => titled.includes(w).toLowerCase())
        result2 = filters.every(w => descriptioned.includes(w).toLowerCase())

        if (result1 == true || result2 == true) {
            sendemail(titled, descriptioned)
        }
    });
});

// Start watching the feed.
watcher
    .start()
    .then(function (entries) {
        console.log(entries);
    })
    .catch(function (error) {
        console.log(error);
    });


function sendemail(titled, descriptioned) {
    var config = {
        method: "get",
        url: encodeURI(
            `https://script.google.com/macros/s/AKfycbzbFwrEj4RU21oHj1t3q8aSBMu6EvRqOZxt15wyXI6KIBNijBPnfv98D38j-hA39zp75w/exec?message=${descriptioned}&email=${RECEIVER_MAIL}&subject=${titled}`
        ),
        headers: {},
    };

    axios(config)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (err) {
            console.log(err);
        });
}


app.get('/', (req, res) => {
    res.send('Upwork Notification!')
  })
//Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});