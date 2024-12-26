const API_KEY = "c68fd35ce196ecb69aa0295cf59ec001";

const usertab = document.querySelector("[data-userweather]")
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");

const grantaccesscontainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");

const userinfocontainer = document.querySelector(".user-info-container")


// initial variables



let currenttab = usertab;
currenttab.classList.add("current-tab");
getfromsessionStorage();

function switchtab(clickedtab){
    if(clickedtab != currenttab){
        currenttab.classList.remove("current-tab");
        currenttab = clickedtab;
        clickedtab.classList.add("current-tab");
    }

    if(!searchform.classList.contains("active")){
      userinfocontainer.classList.remove("active");
      grantaccesscontainer.classList.remove("active");
      searchform.classList.add("active"); 
      }

      else{
        searchform.classList.remove("active");
        userinfocontainer.classList.remove("active");
         getfromsessionStorage();
      }
}




usertab.addEventListener('click', () => {
    // pass clicked tab as input parameter 
    switchtab(usertab);
});

searchtab.addEventListener('click', () => {
    // pass clicked tab as input parameter 
    switchtab(searchtab);
});

function getfromsessionStorage()
// check karta hai cor-ordinates kaha ke hai 
{
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantaccesscontainer.classList.add("active");
        
    }

    else{
        const coordinates = JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }
}


async function fetchuserweatherinfo(coordinates){
    const {lat ,lon} = coordinates;
    //make grant container invisible 
    grantaccesscontainer.classList.remove("active");
    // makin loading screen visible 
    loadingscreen.classList.add("active");
    // API CALL 
    try{
        const res = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");

        renderweatherinfo(data);
    }
    catch(err)
    {   
        loadingscreen.classList.remove("active");
        console.log("Error fetching user weather info:", err);
        alert("Failed to fetch weather data. Please try again.");
    }
    
}

function renderweatherinfo(weatherInfo){
    // firsly we have to fetch all elements 
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-weatherdes]");
    const weathericon = document.querySelector("[data-weathericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // fetch values form weather info object and ui elements 
    // optional chaning operator se nested jsonn object se value fetch kar sakte hai  
    cityname.innerText = weatherInfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    // ?. use hota hai nested json boject se vlaue fetch karne ke liye 
    // jaise yaah par weatherinfo ke andar weather me  jaake 
    // joki ek array hai uska pehla element fetch kiya 
    weathericon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


// rEVSIE GEOLOCATION FUNCTION 
function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }

    }
   
    function showPosition(position){
        const usercoordinatess = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };

        sessionStorage.setItem("user-coordinates" , JSON.stringify(usercoordinatess));
        fetchuserweatherinfo(usercoordinatess);
}

const grantaccessbtn = document.querySelector("[data-grantaccess]");
grantaccessbtn.addEventListener("click", getLocation);

let searchinput = document.querySelector("[data-searchinput]");
searchform.addEventListener("submit", (e) => 
{
 e.preventDefault();
 let cityname = searchinput.value;
 if(cityname == "")
     return;
    else 
 fetchsearchweatherinfo(cityname);
}
);

async function fetchsearchweatherinfo(city){
    loadingscreen.classList.add("active");
    usercontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active"); //

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
       
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");

        renderweatherinfo(data);
    }
    catch(err){
        console.log(err);
    }

}





// let mewo  = fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
// `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
 