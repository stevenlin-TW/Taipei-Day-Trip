let top_box = document.createElement("div");
top_box.className = "top_box";
top_box.id = "top_box";
document.querySelector("nav").appendChild(top_box);

let title = document.createElement("div");
title.className = "title";
title.textContent = "台北一日遊";
document.getElementById(top_box.id).appendChild(title);

let option_list = document.createElement("div");
option_list.className = "option_list";
option_list.id = option_list.className;
document.getElementById(top_box.id).appendChild(option_list);

let option1 = document.createElement("div");
option1.className = "option";
option1.id = "booking";
option1.textContent = "預定行程";

let option2 = document.createElement("div");
option2.className = "option";
option2.id = "sign_in_up";
option2.textContent = "登入/註冊";

let option3 = document.createElement("div");
option3.className = "option";
option3.id = "sign_out";
option3.textContent = "登出系統";
option3.style.display = "none";

document.getElementById(option_list.id).appendChild(option1);
document.getElementById(option_list.id).appendChild(option2);
document.getElementById(option_list.id).appendChild(option3);