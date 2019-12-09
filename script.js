let navItems = [];
let splashItems = [];
let introItems = [];
const navTemp = document.querySelector(".nav_template");
const navList = document.querySelector("nav");

window.addEventListener("DOMContentLoaded", start);

function start() {
    document.querySelector(".menu_toggle").addEventListener("click", toggleMenu);

    function toggleMenu() {
        document.querySelector("nav").classList.toggle("active");
    }

    getNavJson();
    getSplash();
    getIntro();
}

async function getNavJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/menu");
    navItems = await response.json();
    loadNav();
}

function loadNav() {
    navItems.forEach(navItem => {
        let clone = navTemp.cloneNode(true).content;
        clone.querySelector("a").textContent = navItem.title.rendered;
        clone.querySelector("a").href = navItem.href;
        navList.appendChild(clone);
    });
    document.querySelectorAll("nav a").forEach((navLink) => {
        navLink.addEventListener('click', () => {
            document.querySelector("nav").classList.remove("active");
        });
    });
}


async function getSplash() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/splash");
    splashItems = await response.json();
    loadSplash();
}

function loadSplash() {
    splashItems.forEach(splashItem => {
        document.querySelector("#splash video source").src = splashItem.background.guid;
        document.querySelector("#splash h1").textContent = splashItem.headline;
        document.querySelector("#splash p").textContent = splashItem.subheadline;
        document.querySelector("#splash button").textContent = splashItem.button;
    });
}


async function getIntro() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/intro");
    introItems = await response.json();
    loadIntro();
}

function loadIntro() {
    introItems.forEach(introItem => {
        document.querySelector("#intro h2").textContent = introItem.title.rendered;
        document.querySelector("#intro p").textContent = introItem.text;
    });
}


//let kategori = [];
//let urlParams = new URLSearchParams(window.location.search);
//let kategoriID = urlParams.get("id");
//let kategoriUrl = "https://oscarbagger.dk/kea/Gruppe5_Koga_CMS/wordpress/wp-json/wp/v2/kategori?include[]=" + kategoriID;
//let kategoriIndhold = document.querySelector(".kategoriIndhold");
//
//
//let cykler = [];
//const url = "https://oscarbagger.dk/kea/Gruppe5_Koga_CMS/wordpress/wp-json/wp/v2/cykel/?&per_page=99";
//const temp = document.querySelector("template");
//const list = document.querySelector(".list");
//
//
//let myCategory = urlParams.get("kategori");
//console.log(myCategory);
//
//function Start() {
//    kategoriGetJson();
//}
