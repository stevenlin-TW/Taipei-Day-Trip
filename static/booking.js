const member_url = "/api/user/auth";
fetch(member_url, {
    method : "GET"
}).then(response => response.json()).then((data) => {
    document.querySelector(".headline").textContent = "您好，" + data.data.name + "，待預定的行程如下：";
    document.getElementById("input_name").defaultValue = data.data.name;
    document.getElementById("input_email").defaultValue = data.data.email;
})

const booking_url = "/api/booking";
fetch(booking_url).then(response => response.json()).then((data) => {
    if(data.data == null){
        document.getElementById("whole_box").style.display = "none";
        document.querySelector(".empty_state").style.display = "block";
        document.querySelector(".empty_state").textContent = "目前沒有任何預定的行程";
        document.getElementById("footer").style.height = "865px";
    } else {
        let image = document.createElement("img");
        image.src = data.data.attraction.image;
        document.getElementById("image").appendChild(image);


        document.querySelector(".attraction").textContent = document.querySelector(".attraction").textContent + data.data.attraction.name;
        document.getElementById("date").textContent = document.getElementById("date").textContent + data.data.date;
        if(data.data.time == "morning"){
            document.getElementById("time").textContent = document.getElementById("time").textContent + "早上9點到下午4點";
        }else{
            document.getElementById("time").textContent = document.getElementById("time").textContent + "下午2點到晚上9點";
        }
        document.getElementById("fee").textContent = "費用： 新台幣" + data.data.price + "元";
        document.getElementById("address").textContent = document.getElementById("address").textContent + data.data.attraction.address;
        document.querySelector(".payment").textContent = "總價：新台幣" + data.data.price + "元";
    }
})


// Delete
icon_delete = document.getElementById("icon_delete");
icon_delete.addEventListener("click", () => {
    fetch(booking_url, {
        method : "DELETE"
    }).then(response => response.json()).then((data) => {
        document.getElementById("whole_box").style.display = "none";
        document.querySelector(".empty_state").textContent = "目前沒有任何預定的行程";
        location.reload();
    })
})