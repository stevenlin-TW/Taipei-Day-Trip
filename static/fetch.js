var page = 0;
let keyword = document.getElementById("search_bar").value;
let isLoading = false;
// if keyword != "":
//    url = "http://127.0.0.1:3000/api/attractions?page=" + page + "&keyword=" + keyword;
async function getData(page){
    let url = "http://127.0.0.1:3000/api/attractions?page=" + page.toString();
    console.log(url);
    isLoading = true;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let attraction_group = document.getElementById("attraction_group");
    for(let i=0; i<data["data"].length; i++){
        let id = data["data"][i]["id"];
        //console.log(id)
        let item = document.createElement("div");
        item.className = "item";
        item.id = "item" + id.toString();
        //console.log(item.id);
        attraction_group.appendChild(item);

        // detail1
        let detail1 = document.createElement("div");
        detail1.className = "detail1";
        detail1.id = "item" + id.toString() + "_detail1";
        //console.log(detail1.id);
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
    var nextPage = data["nextPage"];
    console.log(nextPage);
    isLoading = false;
}

const callback = (entries, observer) => {
    if (nextPage == null){
        observer.unobserve(footer);
    }else{
        if(!isLoading){
            console.log(nextPage);
            getData(nextPage);
        }
    }
}

//observe footer
const footer = document.getElementById("footer");
const observer = new IntersectionObserver(callback, {threshold: 1});
observer.observe(footer);

//initial load
getData(page);