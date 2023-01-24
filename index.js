const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-text"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
arrowBack = wrapper.querySelector("header i");

let api;

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        // if browser support geolocation
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else
     {
        alert("Your browser does not support geolaction api")
     }
});

function onSuccess(position) {
   const {latitude, longitude} = position.coords;
   api =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=YourAPIkey`;  
   fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

inputField.addEventListener("keyup", e => {
    //If user pressed eneter btn and input was not empty 
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);    
    }
})



function requestApi(city){
    api =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YourAPIkey
`;  
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details ...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a vailid city name`;

    }else {
        //Getting the property form API object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        // passing the values to html elemets

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText =  Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity} %`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=> {
    wrapper.classList.remove("active");
})