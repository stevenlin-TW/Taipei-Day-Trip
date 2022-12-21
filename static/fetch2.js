var page = 0;
let keyword = document.getElementById("search_bar").value;
let isLoading = false;
let url = "/api/attractions?page=" + page.toString();
isLoading = true;
fetch(url).then((response) => {
    return response.json();
}).then((data) => {
    let attraction_group = document.getElementById("attraction_group");
    for(let i=0; i<data["data"].length; i++){
        let id = data["data"][i]["id"];
        let item = document.createElement("div");
        item.className = "item";
        item.id = id.toString();
        attraction_group.appendChild(item);

        // detail1
        let detail1 = document.createElement("div");
        detail1.className = "detail1";
        detail1.id = "item" + id.toString() + "_detail1";
        document.getElementById(item.id).appendChild(detail1);
        let pic_url = data["data"][i]["image"][0];
        let pic = document.createElement("img");
        pic.src = pic_url;
        document.getElementById(detail1.id).appendChild(pic);
        let name = document.createElement("div");
        name.className = "name";
        name.textContent = data["data"][i]["name"];
        document.getElementById(detail1.id).appendChild(name);

        // detail2
        let detail2 = document.createElement("div");
        detail2.className = "detail2";
        detail2.id = item.id + "_detail2"
        document.getElementById(item.id).appendChild(detail2);
        let mrt = document.createElement("div");
        mrt.className = "mrt";
        mrt.textContent = data["data"][i]["mrt"];
        document.getElementById(detail2.id).appendChild(mrt)
        let cat = document.createElement("div");
        cat.className = "category";
        cat.textContent = data["data"][i]["category"];
        document.getElementById(detail2.id).appendChild(cat);
    };

    let attractions = document.getElementsByClassName("item");
    for(let i=0; i<attractions.length; i++){
        attractions[i].addEventListener("click", () => {
            window.location.href = "/attraction/" + attractions[i].id;
        })
    }
    page = data["nextPage"];
    isLoading = false;
});

const callback = (entries, observer) => {
    if (page == null){
        observer.unobserve(footer);
    }else{
        if(!isLoading){
            if (keyword != ""){
                url = "/api/attractions?page=" + page.toString() + "&keyword=" + keyword;
            }else{
                url = "/api/attractions?page=" + page.toString();
            }
            isLoading = true;
            fetch(url).then((response) => {
                return response.json();
            }).then((data) => {
                let attraction_group = document.getElementById("attraction_group");
                for(let i=0; i<data["data"].length; i++){
                    let id = data["data"][i]["id"];
                    let item = document.createElement("div");
                    item.className = "item";
                    item.id = id.toString();
                    attraction_group.appendChild(item);

                    // detail1
                    let detail1 = document.createElement("div");
                    detail1.className = "detail1";
                    detail1.id = "item" + id.toString() + "_detail1";
                    document.getElementById(item.id).appendChild(detail1);
                    let pic_url = data["data"][i]["image"][0];
                    let pic = document.createElement("img");
                    pic.src = pic_url;
                    document.getElementById(detail1.id).appendChild(pic);
                    let name = document.createElement("div");
                    name.className = "name";
                    name.textContent = data["data"][i]["name"];
                    document.getElementById(detail1.id).appendChild(name);

                    // detail2
                    let detail2 = document.createElement("div");
                    detail2.className = "detail2";
                    detail2.id = item.id + "_detail2"
                    document.getElementById(item.id).appendChild(detail2);
                    let mrt = document.createElement("div");
                    mrt.className = "mrt";
                    mrt.textContent = data["data"][i]["mrt"];
                    document.getElementById(detail2.id).appendChild(mrt)
                    let cat = document.createElement("div");
                    cat.className = "category";
                    cat.textContent = data["data"][i]["category"];
                    document.getElementById(detail2.id).appendChild(cat);
                };

                let attractions = document.getElementsByClassName("item");
                for(let i=0; i<attractions.length; i++){
                    attractions[i].addEventListener("click", () => {
                        window.location.href = "/attraction/" + attractions[i].id;
                    })
                }
                page = data["nextPage"];
                isLoading = false;


            })
        };
    };
}

//observe footer
const footer = document.getElementById("footer");
const observer = new IntersectionObserver(callback, {threshold: 1});
observer.observe(footer);


search = document.getElementById("search");
search.addEventListener("click", () => {
    keyword = document.getElementById("search_bar").value;
    document.getElementById("search_bar").value = "";
    if (keyword != ""){
        page = 0;
        document.getElementById("attraction_group").innerHTML = "";
        url = "/api/attractions?page=" + page.toString() + "&keyword=" + keyword;
        isLoading = true;
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            //console.log(data["data"]);
            if (data["data"]!=""){
                let attraction_group = document.getElementById("attraction_group");
                for(let i=0; i<data["data"].length; i++){
                    let id = data["data"][i]["id"];
                    let item = document.createElement("div");
                    item.className = "item";
                    item.id = id.toString();
                    attraction_group.appendChild(item);

                    // detail1
                    let detail1 = document.createElement("div");
                    detail1.className = "detail1";
                    detail1.id = "item" + id.toString() + "_detail1";
                    document.getElementById(item.id).appendChild(detail1);
                    let pic_url = data["data"][i]["image"][0];
                    let pic = document.createElement("img");
                    pic.src = pic_url;
                    document.getElementById(detail1.id).appendChild(pic);
                    let name = document.createElement("div");
                    name.className = "name";
                    name.textContent = data["data"][i]["name"];
                    document.getElementById(detail1.id).appendChild(name);

                    // detail2
                    let detail2 = document.createElement("div");
                    detail2.className = "detail2";
                    detail2.id = item.id + "_detail2"
                    document.getElementById(item.id).appendChild(detail2);
                    let mrt = document.createElement("div");
                    mrt.className = "mrt";
                    mrt.textContent = data["data"][i]["mrt"];
                    document.getElementById(detail2.id).appendChild(mrt)
                    let cat = document.createElement("div");
                    cat.className = "category";
                    cat.textContent = data["data"][i]["category"];
                    document.getElementById(detail2.id).appendChild(cat);
                };

                let attractions = document.getElementsByClassName("item");
                for(let i=0; i<attractions.length; i++){
                    attractions[i].addEventListener("click", () => {
                        window.location.href = "/attraction/" + attractions[i].id;
                    })
                };
                page = data["nextPage"];
                isLoading = false;
                observer.observe(footer);
            }else{
                console.log("No result");
                let attraction_group = document.getElementById("attraction_group");
                attraction_group.textContent = "No Result";
            };
        })
    }
})

document.addEventListener("click", (e) => {
    if(!cat_list.contains(e.target) & !search_bar.contains(e.target)){
        cat_list.style.display = "none";
    }
})

let cat_list = document.getElementById("cat_list");
let cat_url = "/api/categories";
fetch(cat_url).then((response) => {
    return response.json();
}).then((categories) => {
    for(let i=0; i<categories["data"].length; i++){
        let category_item = document.createElement("div");
        category_item.textContent = categories["data"][i];
        category_item.className = "category_item";
        cat_list.appendChild(category_item);
    }

    let category = document.querySelectorAll(".category_item");
    for(let i=0; i<category.length; i++){
        category[i].addEventListener("mouseover", () => {
            category[i].style.backgroundColor = "#E8E8E8"
        })

        category[i].addEventListener("mouseout", () => {
            category[i].style.backgroundColor = "white"
        })

        category[i].addEventListener("click", () => {
            document.getElementById("search_bar").value = category[i].innerText;
            cat_list.style.display = "none";
        })
    }
})

let search_bar = document.getElementById("search_bar");
search_bar.addEventListener("click", () =>{
    cat_list.style.display = "grid";
    cat_list.style.gridTemplateColumns = "repeat(3, 1fr)";
    cat_list.style.fontSize = "14px";
    
})