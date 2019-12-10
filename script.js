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

let clientXBefore = 0;
document.querySelectorAll('.slider').forEach((slider) => {
    slider.addEventListener('touchstart', (e) => {
        console.log('X koordinat ved slider bevægelses start', e.touches[0].clientX);
        clientXBefore = e.touches[0].clientX;
    });
});

document.querySelectorAll('.slider').forEach((slider) => {
    slider.addEventListener('touchend', (e) => {
        console.log('X koordinat ved slider bevægelses slutning', e.changedTouches[0].clientX);
        if (clientXBefore > (e.changedTouches[0].clientX + 50)) {
            console.log('Da X ved start var større end ved slut, blev slideren bevæget mod venstre');
            slideNext(slider);
        } else if (clientXBefore < (e.changedTouches[0].clientX - 50)) {
            console.log('Da X ved start var mindre end ved slut, blev slideren bevæget mod højre');
            slidePrev(slider);
        }
    });
});

function slideNext(slider) {
    let slides = slider.getAttribute('data-slides');
    let active = slider.getAttribute('data-active');

    if (active >= slides) {
        active = 1;
    } else {
        active++;
    }
    slider.setAttribute('data-active', active);

    if (slider.querySelector('.next').nextElementSibling !== null) {
        slider.querySelector('.next').nextElementSibling.classList.add('next');
    } else {
        slider.firstElementChild.classList.add('next');
    }

    slider.querySelector('.prev').classList.add('prev_removeafter');

    if (slider.querySelector('.prev_removeafter').nextElementSibling !== null) {
        slider.querySelector('.prev_removeafter').nextElementSibling.classList.add('prev');
    } else {
        slider.firstElementChild.classList.add('prev');
    }

    slider.querySelector('.active').classList.add('active_removeafter');

    if (slider.querySelector('.active_removeafter').nextElementSibling !== null) {
        slider.querySelector('.active_removeafter').nextElementSibling.classList.remove('next');
        slider.querySelector('.active_removeafter').nextElementSibling.classList.add('active');
    } else {
        slider.firstElementChild.classList.remove('next');
        slider.firstElementChild.classList.add('active');
    }

    slider.querySelector('.active_removeafter').classList.remove('active');
    slider.querySelector('.active_removeafter').classList.remove('active_removeafter');
    slider.querySelector('.prev_removeafter').classList.remove('prev');
    slider.querySelector('.prev_removeafter').classList.remove('prev_removeafter');
}

function slidePrev(slider) {
    let slides = slider.getAttribute('data-slides');
    let active = slider.getAttribute('data-active');

    if (active <= 1) {
        active = slides;
    } else {
        active--;
    }
    slider.setAttribute('data-active', active);


    if (slider.querySelector('.prev').previousElementSibling !== null) {
        slider.querySelector('.prev').previousElementSibling.classList.add('prev');
    } else {
        slider.lastElementChild.classList.add('prev');
    }

    slider.querySelector('.next').classList.add('next_removeafter');

    if (slider.querySelector('.next_removeafter').previousElementSibling !== null) {
        slider.querySelector('.next_removeafter').previousElementSibling.classList.add('next');
    } else {
        slider.lastElementChild.classList.add('next');
    }

    slider.querySelector('.active').classList.add('active_removeafter');

    if (slider.querySelector('.active_removeafter').previousElementSibling !== null) {
        slider.querySelector('.active_removeafter').previousElementSibling.classList.remove('prev');
        slider.querySelector('.active_removeafter').previousElementSibling.classList.add('active');
    } else {
        slider.lastElementChild.classList.remove('prev');
        slider.lastElementChild.classList.add('active');
    }

    slider.querySelector('.active_removeafter').classList.remove('active');
    slider.querySelector('.active_removeafter').classList.remove('active_removeafter');
    slider.querySelector('.next_removeafter').classList.remove('next');
    slider.querySelector('.next_removeafter').classList.remove('next_removeafter');
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
