require('dotenv').config();
const express = require('express');
const _ = require('lodash');
const ejs = require('ejs');
const https = require('https');
const { log } = require('console');

const app = express();

app.set('view engine', 'ejs');

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const today = new Date();
const option = {
    weekday: "short",
    day: "numeric",
    month: "long",
}

app.get("/", (req, res) => {
    
    const url = "https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=" +process.env.pass + "&units=metric";


    https.get(url, (response) => {

        if (response.statusCode === 200) {
            response.on("data", (data) => {
                let a = JSON.parse(data);

                const cast = a.weather[0].description;
                const cityName = a.name;
                const country = a.sys.country;
                const day = today.toLocaleDateString("en-in", option);
                const k = a.main.temp;

                const temp = a.main.temp+ " °C";
                const min = a.main.temp_min+ " °C";
                const max = a.main.temp_max+ " °C";
                const code = a.weather[0].icon
                const img = "http://openweathermap.org/img/wn/"+code+"@2x.png"

                res.render("index", {over: cast, code: img, city: cityName, country: country, date: day, temprature: temp, mini: min, max: max })
            })
        }
        else {
            res.redirect("/");
        }
    });
});

app.post("/post", (req, res) => {
    const query = _.capitalize(req.body.city);
    
    const queryurl = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid=" +process.env.pass + "&units=metric";

    
    https.get(queryurl, (response) => {
        if (response.statusCode === 200) {
            response.on("data", (data) => {
                let a = JSON.parse(data);

                const cast = a.weather[0].description;
                const cityName = a.name;
                const country = a.sys.country;
                const day = today.toLocaleDateString("en-in", option);
                const temp = a.main.temp + " °C";
                const min = a.main.temp_min + " °C";
                const max = a.main.temp_max + " °C";
                const code = a.weather[0].icon
                const img = "http://openweathermap.org/img/wn/"+code+"@2x.png"

                res.render("index", {over: cast, code: img, city: cityName, country: country, date: day, temprature: temp, mini: min, max: max })
            })
        }
        else {
            res.redirect("/");
        }
    });
})

app.listen(process.env.PORT ||3000, () => {
    console.log("app started at port 3000");
})
