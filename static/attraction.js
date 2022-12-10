let path_name = document.location.pathname;
const id = path_name.split("/").pop();
const url = "http://127.0.0.1:3000/api/attraction/" + id;

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
