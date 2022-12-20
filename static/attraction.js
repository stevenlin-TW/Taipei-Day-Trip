let path_name = document.location.pathname;
const id = path_name.split("/").pop();
const url = "/api/attraction/" + id;

fetch(url).then((response) => {
    return response.json();
}).then((data) => {
    let image_num = data["data"]["image"].length;
    for(let i=0; i<image_num; i++){
        let image_box = document.createElement("div");
        image_box.className = "image_box";
        image_box.id = "image" + (i+1).toString();
        document.getElementById("image").appendChild(image_box);

        let image = document.createElement("img");
        image.src = data["data"]["image"][i];
        image.className = "att_image";
        document.getElementById(image_box.id).appendChild(image);

        let dot = document.createElement("div");
        dot.className = "dot";
        document.getElementById("dot_box").appendChild(dot);
    }

    var image_index = 1;
    showImage(image_index);
    function showImage(index){
        let image_boxes = document.getElementsByClassName("image_box");
        let dots = document.getElementsByClassName("dot");
        if(index > image_boxes.length){
            image_index = 1;
        }else if(index < 1){
            image_index = image_boxes.length;
        }

        for (let i=0; i<image_boxes.length; i++){
            image_boxes[i].style.display = "none";
            dots[i].className = dots[i].className.replace(" active", "");
        }

        dots[image_index-1].className += " active";
        image_boxes[image_index-1].style.display = "block";
    }
    
    let next = document.getElementById("next");
    next.addEventListener("click", () => {showImage(image_index += 1);})

    let back = document.getElementById("back");
    back.addEventListener("click", () => {showImage(image_index -= 1);})

    let dots = document.getElementsByClassName("dot");
    for(let i=0; i<dots.length; i++){
        dots[i].addEventListener("click", () => {showImage(image_index = i+1)})
    }

    let name = document.getElementById("name");
    name.textContent = data["data"]["name"];

    let cat_mrt = document.getElementById("cat_mrt");
    cat_mrt.textContent = data["data"]["category"] + " at " + data["data"]["mrt"];

    let description = document.getElementById("description");
    description.textContent = data["data"]["description"];

    let address = document.getElementById("address");
    address.textContent = data["data"]["address"];

    let transport = document.getElementById("transport");
    transport.textContent = data["data"]["transport"];

})


let morning = document.getElementById("morning");
let afternoon = document.getElementById("afternoon");
morning.addEventListener("click", () => {
    document.getElementById("fee1").style.display = "block";
    document.getElementById("fee2").style.display = "none";
})

afternoon.addEventListener("click", () => {
    document.getElementById("fee1").style.display = "none";
    document.getElementById("fee2").style.display = "block";
})

//booking schedule
const booking_url = "/api/booking";
let booking_btn = document.querySelector(".booking_btn");
booking_btn.addEventListener("click", () => {
    // Check User Status
    let check_url = "/api/user/auth"; 
    fetch(check_url, {
        method : "GET"
    }).then(response => response.json()).then((data) => {
        if(data["data"] != null){
            let booking_date_text = document.querySelector(".date").value;
            const now = new Date();
            const booking_date = new Date(booking_date_text);
            if(booking_date.getTime() < now.getTime()){
                error_message = document.getElementById("error_message");
                error_message.textContent = "日期選擇有誤";
                error_message.style.display = "block";
            } else {
                error_message.style.display = "none";
                // get radio value
                let guide_time = "";
                let radios = document.getElementsByName("guide_time");
                for(let i=0; i<radios.length; i++) {
                    if(radios[i].checked){
                        guide_time = radios[i].value;
                    }
                };
                let booking_fee = 0;
                if(guide_time == "morning"){
                    booking_fee = 2000;
                }else{
                    booking_fee = 2500;
                }

                let headers = {
                    "Content-Type" : "application/json"
                };

                let body = {
                    "attractionId" : id,
                    "date" : booking_date_text,
                    "time" : guide_time,
                    "price" : booking_fee
                }
                if(!(Object.values(body).includes(""))){
                    fetch(booking_url, {
                        method : "POST",
                        headers : headers,
                        body : JSON.stringify(body)
                    })
                        .then(response => response.json())
                        .then((data) => {
                            if(Object.keys(data).includes("ok")){
                                location.href = "/booking"
                            }else if(Object.keys(data).includes("error")){
                                document.getElementById("error_message").style.display = "block";
                                document.getElementById("error_message").textContent = data.message;
                            };
                        })     
                }
            }
        }else{
            document.getElementById("dialog").showModal();
        }
    });
})