const temp = document.getElementById("temp");
    date = document.getElementById("date-time")
    currentLocation = document.getElementById("location")
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";

//Update Date Time

function getDateTime(){
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    //12 hour format
    hour = hour % 12;
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
//update time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

//function to get public ip with fetch
function getPublicIp(){
    fetch("https://geolocation-db.com/json/",{
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek );
        });
}
getPublicIp();

//function to get weather data
function getWeatherData (city , unit , hourlyorWeek){
    const apiKey = "B3E8WTPEKRH7DBRH2TB874ULD";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
        }
    )
    .then((response) => response.json())
    .then((data) => {
        let today = data.currentConditions;
        if(unit === "c"){
            temp.innerText = today.temp;
        } else {
            temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = "Perc - " + today.precip + " %";
        uvIndex.innerText = today.uvindex;
        windSpeed.innerText = today.windspeed;
        humidity.innerText = today.humidity + "%";
        visibility.innerText = today.visibility;
        airQuality.innerText = today.winddir;
        measureUvIndex(today.uvindex);
        updateHumidityStaus(today.humidity);
        updateVisibilityStatus(today.visibility);
        updateAirQualityStatus(today.winddir);
        sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
        sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
        mainIcon.src = getIcon(today.icon);
        changeBackground(today.icon);
        if( hourlyorWeek === "hourly"){
            updateForecast(data.days[0].hours , unit , "day");
        } else {
            updateForecast(data.days, unit, "week");
        }
    })
    .catch((err) => {
        alert("City not found not found in our database");
    });
}

//convert celcius to fahrenheit
function celciusToFahrenheit(temp){
    return((temp*9)/5 + 32).toFixed(1);
}

//function to get uv index status

function measureUvIndex(uvIndex){
    if(uvIndex <= 2){
        uvText.innerText = "Low"
    }else if(uvIndex <= 5){
        uvText.innerText = "Moderate";
    }
    else if(uvIndex <= 7){
        uvText.innerText = "High";
    }else if(uvIndex <= 10){
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

function updateHumidityStaus(humidity){
    if(humidity <= 30){
        humidityStatus.innerText = "Low"
    }else if(humidity <= 60){
        humidityStatus.innerText = "Moderate";
    }else {
        humidityStatus.innerText = "High";
    }
}

function updateVisibilityStatus(visibility){
    if(visibility <= 0.3){
        visibilityStatus.innerText = "Dense Fog"
    } else if( visibility <= 0.16){
        visibilityStatus.innerText = "Moderate Fog";
    } else if( visibility <= 0.35){
        visibilityStatus.innerText = "Light Fog";
    } else if( visibility <= 1.13){
        visibilityStatus.innerText = "very Light Fog";
    } else if( visibility <= 2.16){
        visibilityStatus.innerText = "Light Mist";
    } else if( visibility <= 5.4){
        visibilityStatus.innerText = "Very Light Mist";
    } else if( visibility <= 10.8){
        visibilityStatus.innerText = "Clear air";
    } else{
        visibilityStatus.innerText = "Very Clear air";
    }
}

function updateAirQualityStatus(airQuality) {
    if(airQuality <= 50){
        airQualityStatus.innerText = "Good";
    } else if(airQuality <= 100){
        airQualityStatus.innerText = "Moderate";
    } else if(airQuality <= 150){
        airQualityStatus.innerText = "Unhealthy for Sensitive Group";
    } else if(airQuality <= 200){
        airQualityStatus.innerText = "Unhealthy";
    } else if(airQuality <= 300){
        airQualityStatus.innerText = "Very Unhealthy";
    } else {
        airQualityStatus.innerText = "Hazardous";
    }
}

function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour & 12;
    hour = hour ? hour : 12; // the zero hour should be 12
    hour = hour < 10 ? "0" + hour : hour; // add prefix zero if less then 10
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":"+ minute + "" + ampm;
    return strTime;
}

function getIcon(condition){
    if(condition === "partly-cloudy-day"){
        return "partial cloud.png";
    } 
    else if(condition === "partly-cloudy-night"){
        return "night cloud moon.png";
    } 
    else if(condition === "rain"){
        return "rain.png";
    } 
    else if(condition === "clear-day"){
        return "sun.png";
    } 
    else if(condition === "clear-night"){
        return "cloudy-night.png";
    }
    else if(condition === "night"){
        return "night.png";
    } 
    else if(condition === "overcast-night"){
        return "overcast.png";
    } 
    else if(condition === "snow"){
        return "cloud snow.png";
    } 
    else {
        return "sunmoon.png";
    }
}

function getDayName(date){
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour > 12){
        hour = hour - 12;
        return `${hour}:${min} PM`
    } else {
        return `${hour}:${min} AM`
    }
}

function updateForecast (data , unit , type){
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    // 24 cards if hourly weather and 7 for weekly
    if(type === "day"){
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++){
        let card = document.createElement("div");
        card.classList.add("card");
        // hour if hourly time and day name if weekly
        let dayName = getHour(data[day].datetime);  
        if(type === "week"){
            dayName = getDayName(data[day].datetime);  
        }
        let dayTemp = data[day].temp;
        if(unit === "f"){
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if(unit === "f"){
            tempUnit = "°F";
        }
        card.innerHTML = `
        
            <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
                <img src="${iconSrc}" alt=""/>
            </div>
            <div class="day-temp">
                <h2 class="temp">${dayTemp}</h2>
                <span class="temp-unit">${tempUnit}</span>
            </div>
        
        `;
        weatherCards.appendChild(card);
        day++;
    }
}

function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if(condition === "partly-cloudy-day"){
        bg =  "cloudy.jpg";
    } 
    else if(condition === "partly-cloudy-night"){
        bg = "night.jpeg";
    } 
    else if(condition === "Rain"){
        bg = "rain.jpg";
    } 
    else if(condition === "clear-day"){
        bg = "clear day.jpg";
    } 
    else if(condition === "clear-night"){
        bg = "cloudy night.jpg";
    } 
    else {
        bg = "clear day.jpg";
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`;
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

function changeUnit(unit){
    if(currentUnit !== unit ){
        currentUnit = unit; 
        {
            //change unit on document
            tempUnit.forEach((elem)=>{
                elem.innerText = `°${unit.toUpperCase()}`;
            });
            if(unit === "c"){
                celciusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            } else{
                celciusBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }
            // call to get weather after change unit
            getWeatherData(currentCity, currentUnit, hourlyorWeek);
        }
    }
}

hourlyBtn.addEventListener("click", () =>{
    changeTimeSpan ("hourly");
});
weekBtn.addEventListener("click", () =>{
    changeTimeSpan ("week");
});

function changeTimeSpan(unit) {
    if(hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if( unit === "hourly"){
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        // update weather on time change 
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

searchForm.addEventListener("click", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}); 

//lets create a cities array which we want to suggest or we can use any api for this

cities = [
    "Delhi",
    "Goa",
    "Noida",
    "Meerut",
    "Jodhpur",
    "kashmir",
    "Kolkata",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kerala",
    "Udaipur",
    "Jaipur",
];

var currentFocus;
//adding eventlistner on search input
search.addEventListener("input", function (e) {
    removeSuggestions();
    var a, 
    b, 
    i, 
    val = this.value;
    //if there is nothing search input do nothing
    if( !val) {
        return false;
    }
    currentFocus = -1;

    //creating a ul with a id suggestions
    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");
    // append the ul to its parent which is search form
    this.parentNode.appendChild(a);
    //adding li's with matching search suggestions
    for(i=0; i<cities.length; i++){
        //check if items start with some letters which are in input
        if(cities[i].substr(0, val.length).toUpperCase()== val.toUpperCase()){
            // if any suggestion matching then create li
            b = document.createElement("li");
            // adding content in li
            //strong to make the maching letters bold
            b.innerHTML ="<strong>" + cities[i].substr(0,val.length)+ "</strong>"
            b.innerHTML += cities[i].substr(val.length);
            //input field to hold the suggestionn value
            b.innerHTML += "<input type= 'hidden' value= '" + cities[i] + "'>";
        
            //adding eventlistner on suggetion
            b.addEventListener("click", function(e){
                //on click set the search input value with th clicked suggestion value
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            //append suggestion li to ul
            a.appendChild(b);
        }
    }
});

//its working but every new suggestion is coming over prev
//lets remove prev suggestion then add new ones


function removeSuggestions() {
    //select the ul which is being adding on search input
    var x = document.getElementById("suggestions");
    //if x exists remove it
    if(x) x.parentNode.removeChild(x);
}

//lets add up and down key functionality to select a suggestion
search.addEventListener("keydown", function(e){
    var x = document.getElementById("suggestions");
    // select the li elements of suggestion ul
    if(x) x = x.getElementsByTagName("li");

    if(e.keyCode == 40){
        // if key code is down button

        currentFocus++;
        // lets create a function to add active suggestion
        addActive(x);
    } else if(e.keyCode == 38) {
        //if key code is up button
        currentFocus--;
    }
    if(e.keyCode == 14){
        //if enter is pressed add the current select suggestion in input field

        e.preventDefault();
        if(currentFocus > -1){
            //if any suggestion is selected click it
            if(x) x[currentFocus].click();
        }
    }
}); 

function addActive(x){
    //if there is no suggestion return as it is 

    if(!x) return false;
    removeActive(x);
    // if currrent focus is more than the length of suggestion arrays make it 0
    if(currentFocus >= x.length) currentFocus = 0;
    //if it's less than 0 make it last suggestion equals
    if(currentFocus < 0 ) currentFocus = x.length - 1;

    //adding active class on focused li
    x[currentFocus].classList.add("active");

}

    // its working but we need to remove previously activated suggestions

    function removeActive(x){
        for (var i =0; i<x.length; i++){
            x[i].classList.remove("active");
        }
    }
