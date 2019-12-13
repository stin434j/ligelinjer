let navItems = [];
let splashItems = [];
let introItems = [];
let galleriesItems = [];
let testimonialItems = [];
let aboutItems = [];
let clientXBefore = 0;
const navTemp = document.querySelector(".nav_template");
const navList = document.querySelector("nav");
const galleryTemp = document.querySelector(".gallery_template");
const testimonialTemp = document.querySelector(".testimonial_template");
const aboutTemp = document.querySelector(".about_template");

window.addEventListener("DOMContentLoaded", start);

function start() {
    document.querySelector(".menu_toggle").addEventListener("click", toggleMenu);

    function toggleMenu() {
        document.querySelector("nav").classList.toggle("active");
    }

    getNavJson();
    getSplashJson();
    getIntroJson();
    getGalleriesJson();
    getAboutJson();
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


async function getSplashJson() {
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


async function getIntroJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/intro");
    introItems = await response.json();
    loadIntro();
}

function loadIntro() {
    introItems.forEach(introItem => {
        document.querySelector("#intro h1").textContent = introItem.title.rendered;
        document.querySelector("#intro p").textContent = introItem.text;
    });
}

async function getGalleriesJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/galleries");
    galleriesItems = await response.json();
    loadGalleries();
}

function loadGalleries() {
    let galleryCounter = 0;
    galleriesItems.forEach(galleriesItem => {
        galleryCounter++;
        let clone = galleryTemp.cloneNode(true).content;
        clone.querySelector("section").classList.add("gallery" + galleryCounter);
        clone.querySelector(".description h1").innerHTML = galleriesItem.title.rendered;
        clone.querySelector(".slider1_headline").innerHTML = galleriesItem.slider1name;
        clone.querySelector(".slider1_text").innerHTML = galleriesItem.slider1text;
        clone.querySelector(".slider2_headline").innerHTML = galleriesItem.slider2name;
        clone.querySelector(".slider2_text").innerHTML = galleriesItem.slider2text;
        clone.querySelector(".gallery_cta em").textContent = galleriesItem.cta;
        clone.querySelector(".tabs .active").setAttribute("data-name", galleriesItem.slider1name);
        clone.querySelector(".tabs .active h4").textContent = galleriesItem.slider1name;
        clone.querySelector(".tabs .tab:not(.active)").setAttribute("data-name", galleriesItem.slider2name);
        clone.querySelector(".tabs .tab:not(.active) h4").textContent = galleriesItem.slider2name;
        clone.querySelector(".slider.active").setAttribute("data-slides", galleriesItem.slider1imgs.length);
        clone.querySelector(".slider.active").setAttribute("data-name", galleriesItem.slider1name);
        let imageCounter = 0;
        galleriesItem.slider1imgs.forEach(image => {
            imageCounter++;
            clone.querySelector(".slider.active").innerHTML += '<div class="slide slide' + imageCounter + '"><img src="' + image.guid + '" alt="' + image.post_name + '"></div>';
        });
        clone.querySelector(".slider:not(.active)").setAttribute("data-slides", galleriesItem.slider2imgs.length);
        clone.querySelector(".slider:not(.active)").setAttribute("data-name", galleriesItem.slider2name);
        imageCounter = 0;
        galleriesItem.slider2imgs.forEach(image => {
            imageCounter++;
            clone.querySelector(".slider:not(.active)").innerHTML += '<div class="slide slide' + imageCounter + '"><img src="' + image.guid + '" alt="' + image.post_name + '"></div>';
        });
        document.querySelector(".gallery_container").appendChild(clone);
        //document.querySelector("body").insertBefore(clone, document.querySelector(".about"));
    });

    document.querySelectorAll('.slider').forEach((slider) => {
        slider.addEventListener('touchstart', (e) => {
            console.log('X koordinat ved slider bevægelses start', e.touches[0].clientX);
            clientXBefore = e.touches[0].clientX;
        });
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
        slideNext(slider);
    });

    document.querySelectorAll(".gallery").forEach((gallery) => {
        gallery.querySelectorAll(".tab").forEach((tab) => {
            tab.addEventListener("click", (e) => {
                let thisTab;
                if (e.target.firstElementChild == null) {
                    thisTab = e.target.parentElement;
                } else {
                    thisTab = e.target;
                }
                if (!thisTab.classList.contains("active")) {
                    gallery.querySelector(".tab.active").classList.remove("active");
                    console.log(e, thisTab);
                    thisTab.classList.add("active");
                    let galleryName = thisTab.getAttribute("data-name");
                    gallery.querySelector(".slider.active").classList.remove("active");
                    gallery.querySelector(".slider[data-name='" + galleryName + "']").classList.add("active");
                }
            });
        });
    });

    getTestimonialJson();
}

async function getTestimonialJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/testimonials");
    testimonialItems = await response.json();
    loadTestimonials();
}

function loadTestimonials() {
    let testimonialCounter = 0;
    let maxTestimonials = document.querySelectorAll(".gallery").length;
    testimonialItems.forEach(testimonialItem => {
        testimonialCounter++;
        if (testimonialCounter < maxTestimonials) {
            let clone = testimonialTemp.cloneNode(true).content;
            clone.querySelector(".author").textContent = testimonialItem.title.rendered;
            clone.querySelector(".quote").textContent = testimonialItem.testimonial;
            let galleryNode = document.querySelector(".gallery" + testimonialCounter);
            galleryNode.parentNode.insertBefore(clone, galleryNode.nextSibling);
        }
    });
}


async function getAboutJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/about");
    aboutItems = await response.json();
    loadAbout();
}

function loadAbout() {
    aboutItems.forEach(aboutItem => {
        let clone = aboutTemp.cloneNode(true).content;
        clone.querySelector("h1").textContent = aboutItem.title.rendered;
        clone.querySelector("p.text1").innerHTML = aboutItem.text1;
        if (aboutItem.text2 != "") {
            clone.querySelector("p.text2").innerHTML = aboutItem.text2;
        }
        if (aboutItem.text3 != "") {
            clone.querySelector("p.text3").innerHTML = aboutItem.text3;
        }
        if (aboutItem.text4 != "") {
            clone.querySelector("p.text4").innerHTML = aboutItem.text4;
        }
        if (aboutItem.text5 != "") {
            clone.querySelector("p.text5").innerHTML = aboutItem.text5;
        }
        clone.querySelector("img").src = aboutItem.img.guid;
        clone.querySelector("img").alt = aboutItem.img.post_name;
        document.querySelector(".about_container").appendChild(clone);
        //document.querySelector("body").insertBefore(clone, document.querySelector(".about"));
    });
}


function slideNext(slider) {
    console.log('slideNext');

    let slides = slider.getAttribute('data-slides');
    let active = slider.getAttribute('data-active');

    if (slider.querySelectorAll('.prev').length) {
        slider.querySelector('.prev').classList.remove('prev');
    }
    if (slider.querySelectorAll('.next').length) {
        slider.querySelector('.next').classList.remove('next');
    }
    if (slider.querySelectorAll('.active').length) {
        slider.querySelector('.active').classList.remove('active');
    }

    if (active >= slides) {
        active = 1;
    } else {
        active++;
    }

    if (active <= 1) {
        slider.querySelector('.slide' + slides).classList.add('prev');
    } else {
        slider.querySelector('.slide' + (active - 1)).classList.add('prev');
    }

    slider.querySelector('.slide' + active).classList.add('active');

    if (active >= slides) {
        slider.querySelector('.slide1').classList.add('next');
    } else {
        slider.querySelector('.slide' + (active + 1)).classList.add('next');
    }

    slider.setAttribute('data-active', active);
}

function slidePrev(slider) {
    console.log('slidePrev');

    let slides = slider.getAttribute('data-slides');
    let active = slider.getAttribute('data-active');

    slider.querySelector('.prev').classList.remove('prev');
    slider.querySelector('.next').classList.remove('next');
    slider.querySelector('.active').classList.remove('active');

    if (active <= 1) {
        active = slides;
    } else {
        active--;
    }

    if (active <= 1) {
        slider.querySelector('.slide' + slides).classList.add('prev');
    } else {
        slider.querySelector('.slide' + (active - 1)).classList.add('prev');
    }

    slider.querySelector('.slide' + active).classList.add('active');

    if (active >= slides) {
        slider.querySelector('.slide1').classList.add('next');
    } else {
        slider.querySelector('.slide' + (active + 1)).classList.add('next');
    }

    slider.setAttribute('data-active', active);
}
