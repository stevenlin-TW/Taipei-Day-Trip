const member_url = "/api/user/auth";
fetch(member_url, {
    method : "GET"
}).then(response => response.json()).then((data) => {
    if(data["data"] == null){
        location.href = "/";
    }
})

let headline = document.querySelector(".headline");
if(window.location.search != ""){
    let params = new URLSearchParams(window.location.search);
    let order_no = params.get("number");
    headline.textContent = "訂購完成！訂單編號：" + order_no;
} else {
    let pre_page = document.createElement("span");
    pre_page.id = "pre_page";
    pre_page.className = pre_page.id;
    pre_page.textContent = "回到上一頁。";
    headline.textContent = "付款失敗！請確認付款資訊是否正確，";
    headline.appendChild(pre_page);
    let notes = document.querySelectorAll(".note");
    notes.forEach(note => {
        note.style.display = "none";
    })

    document.getElementById("pre_page").addEventListener("click", () => {
        document.getElementById("pre_page").style.color = "rgb(226, 15, 219)"
        history.back();
    });
}


