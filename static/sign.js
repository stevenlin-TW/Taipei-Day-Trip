// Check User Status
let check_url = "http://127.0.0.1:3000/api/user/auth"; 
fetch(check_url, {
    method : "GET"
}).then(response => response.json()).then((data) => {
    if(data["data"] != null){
        document.getElementById("sign_in_up").style.display = "none";
        document.getElementById("sign_out").style.display = "block";
    }else{
        document.getElementById("sign_in_up").style.display = "block";
        document.getElementById("sign_out").style.display = "none";
    }
});
//

let sign_in_up = document.getElementById("sign_in_up");
let dialog = document.getElementById("dialog");
sign_in_up.addEventListener("click", () => {
    dialog.showModal();
})

document.addEventListener("click", (event) => {
    if(event.target === dialog){
        dialog.close()
        document.getElementById("sign_in_response_text").style.display = "none";
        document.getElementById("sign_up_response_text").style.display = "none";
    }
})

let icon_closes = document.querySelectorAll(".icon_close");
icon_closes.forEach( icon_close => {
    icon_close.addEventListener("click", () => {
        dialog.close();
    })
})


let sign_in = document.getElementById("sign_in");
let sign_up = document.getElementById("sign_up");
let click_to_changes = document.getElementsByClassName("click_to");
for(let i=0; i<click_to_changes.length; i++){
    click_to_changes[i].addEventListener("click", () => {
        if(sign_in.style.display == "none"){
            sign_up.style.display = "none";
            sign_in.style.display = "grid";
            document.getElementById("sign_in_response_text").style.display = "none";
        }else{
            sign_in.style.display = "none";
            sign_up.style.display = "grid";
            document.getElementById("sign_up_response_text").style.display = "none";
        }
    })
}

let dialog_inputs = document.querySelectorAll(".dialog_input")
dialog_inputs.forEach( dialog_input => {
    dialog_input.addEventListener("input", () => {
        if(dialog_input.checkValidity()){
            dialog_input.classList.remove("invalid");
        }else{
            dialog_input.classList.add("invalid");
        }
    })
})

// Sign Up
let sign_up_btn = document.getElementById("sign_up_btn");
sign_up_btn.addEventListener("click", () => {
    let new_name = document.getElementById("new_name").value;
    let new_email = document.getElementById("new_email").value;
    let new_password = document.getElementById("new_password").value;
    let headers = {
        "Content-Type" : "application/json"
    };

    let body = {
        "name" : new_name,
        "email" : new_email,
        "password" : new_password
    };

    let url = "http://127.0.0.1:3000/api/user";

    fetch(url, {
        method : "POST",
        headers : headers,
        body : JSON.stringify(body)
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            console.log(Object.keys(data).includes("ok"));
            if(Object.keys(data).includes("ok")){
                document.getElementById("sign_up_response_text").style.display = "block";
                document.getElementById("sign_up_response_text").textContent = "註冊成功";
            }else if(Object.keys(data).includes("error")){
                document.getElementById("sign_up_response_text").style.display = "block";
                document.getElementById("sign_up_response_text").textContent = data.message;
                return false;
            };
        })
    
    document.getElementById("new_name").value = "";
    document.getElementById("new_email").value = "";
    document.getElementById("new_password").value = "";
})

// Sign In
let sign_in_btn = document.getElementById("sign_in_btn");
sign_in_btn.addEventListener("click", () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    
    let url = "http://127.0.0.1:3000/api/user/auth";

    let headers = {
        "Content-Type" : "application/json"
    };

    let body = {
        "email" : email,
        "password" : password
    };

    fetch(url, {
        method : "PUT",
        headers : headers,
        body : JSON.stringify(body)
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            if(Object.keys(data).includes("ok")){
                location.reload();
            }else if(Object.keys(data).includes("error")){
                document.getElementById("sign_in_response_text").style.display = "block";
                document.getElementById("sign_in_response_text").textContent = data.message;
            };
        })
})

// Sign Out
let sign_out = document.getElementById("sign_out");
sign_out.addEventListener("click", () => {
    fetch(check_url, {method : "DELETE"}).then(response => response.json())
    .then((data) => {
        if(Object.keys(data).includes("ok")){
            location.reload();
        }
    })
})

// To Index
document.querySelector(".title").addEventListener("click", () => {
    location.href = "http://127.0.0.1:3000/"
})
