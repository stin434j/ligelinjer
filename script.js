let navItems = [];
let splashItems = [];
let introItems = [];
let categoryItems = [];
let galleriesItems = [];
let testimonialItems = [];
let aboutItems = [];
let clientXBefore = 0;
const navTemp = document.querySelector(".nav_template");
const navList = document.querySelector("nav");
const categoryTemp = document.querySelector(".category_template");
const galleryTemp = document.querySelector(".gallery_template");
const testimonialTemp = document.querySelector(".testimonial_template");
const aboutTemp = document.querySelector(".about_template");
const facebookTemp = document.querySelector(".facebook_template");
const instagramTemp = document.querySelector(".instagram_template");
const linkedinTemp = document.querySelector(".linkedin_template");

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
    getInterviewJson();
    getEventsJson();
    getDirectionsJson();
    getFooterJson();
    getHoursJson();
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
        document.querySelector("#splash .button").textContent = splashItem.button;
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
        // Tilføj galleri punkt til #intro sektionen
        let categoryClone = categoryTemp.cloneNode(true).content;
        categoryClone.querySelector("a.category").href = "#gallery" + galleryCounter;
        categoryClone.querySelector(".img").innerHTML = '<img src="' + galleriesItem.slider1imgs[0].guid + '" alt="' + galleriesItem.slider1imgs[0].post_name + '">';
        categoryClone.querySelector(".headline").innerHTML = galleriesItem.title.rendered;
        document.querySelector("#intro .categories").appendChild(categoryClone);
        // Indlæs galleri sektioner
        let clone = galleryTemp.cloneNode(true).content;
        clone.querySelector("section").id = "gallery" + galleryCounter;
        clone.querySelector("section").classList.add("gallery" + galleryCounter);
        clone.querySelector(".description h1").innerHTML = galleriesItem.title.rendered;
        clone.querySelector(".slider1_headline").innerHTML = galleriesItem.slider1name;
        clone.querySelector(".slider1_text").innerHTML = galleriesItem.slider1text;
        clone.querySelector(".slider2_headline").innerHTML = galleriesItem.slider2name;
        clone.querySelector(".slider2_text").innerHTML = galleriesItem.slider2text;
        clone.querySelector(".gallery_cta em").textContent = galleriesItem.cta;
        clone.querySelector(".button").textContent = galleriesItem.button;
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
        document.querySelector("#gallery_container").appendChild(clone);
    });

    initSliders();
    initTabs();
    getTestimonialJson();
}

function initSliders() {
    document.querySelectorAll('.slider').forEach((slider) => {
        slider.querySelector(".slider_next").addEventListener('click', () => {
            slideNext(slider);
        });
        slider.querySelector(".slider_prev").addEventListener('click', () => {
            slidePrev(slider);
        });
        slider.addEventListener('touchstart', (event) => {
            console.log('X koordinat ved slider bevægelses start', event.touches[0].clientX);
            clientXBefore = event.touches[0].clientX;
        }, {
            passive: true
        });
        slider.addEventListener('touchend', (event) => {
            console.log('X koordinat ved slider bevægelses slutning', event.changedTouches[0].clientX);
            if (clientXBefore > (event.changedTouches[0].clientX + 50)) {
                console.log('Da X ved start var større end ved slut, blev slideren bevæget mod venstre');
                slideNext(slider);
            } else if (clientXBefore < (event.changedTouches[0].clientX - 50)) {
                console.log('Da X ved start var mindre end ved slut, blev slideren bevæget mod højre');
                slidePrev(slider);
            }
        }, {
            passive: true
        });

        slideNext(slider);
    });
}

function initTabs() {
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
        if (testimonialCounter <= maxTestimonials) {
            let clone = testimonialTemp.cloneNode(true).content;
            clone.querySelector(".author").textContent = "- " + testimonialItem.title.rendered;
            clone.querySelector(".quote em").textContent = testimonialItem.testimonial;
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
        document.querySelector("#about_container").appendChild(clone);
        //document.querySelector("body").insertBefore(clone, document.querySelector(".about"));
    });
}

async function getInterviewJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/interview");
    interviewItems = await response.json();
    loadInterview();
}

function loadInterview() {
    interviewItems.forEach(interviewItem => {
        document.querySelector("#interview h1").textContent = interviewItem.title.rendered;
        document.querySelector("#interview video source").src = interviewItem.video.guid;
        document.querySelector("#interview .quote em").textContent = interviewItem.text;
        document.querySelector("#interview .author").textContent = "- " + interviewItem.by;
        document.querySelector("#interview video").load();
    });
}


async function getEventsJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/events");
    eventItems = await response.json();
    loadEvents();
}

function loadEvents() {
    eventItems.forEach(eventItem => {
        document.querySelector("#events h1").textContent = eventItem.title.rendered;
        document.querySelector("#events .text").textContent = eventItem.text;
        console.log(eventItem);
        document.querySelector("#events img").src = eventItem.img.guid;
        document.querySelector("#events img").alt = eventItem.img.post_name;
        if (eventItem.facebook == 1 || eventItem.instagram == 1 || eventItem.linkedin == 1) {
            if (eventItem.facebook == 1) {
                let clone = facebookTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("black");
                document.querySelector("#events .some_icons").appendChild(clone);
            }
            if (eventItem.instagram == 1) {
                let clone = instagramTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("black");
                document.querySelector("#events .some_icons").appendChild(clone);
            }
            if (eventItem.linkedin == 1) {
                let clone = linkedinTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("black");
                document.querySelector("#events .some_icons").appendChild(clone);
            }
        } else {
            document.querySelector("#events .follow").classList.add("hidden");
            document.querySelector("#events .some_icons").classList.add("hidden");
        }
    });
}

async function getDirectionsJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/directions");
    directionsItems = await response.json();
    loadDirections();
}

function loadDirections() {
    directionsItems.forEach(directionsItem => {
        document.querySelector("#directions h1").textContent = directionsItem.title.rendered;
        document.querySelector("#directions .text1").textContent = directionsItem.text1;
        document.querySelector("#directions .text2").textContent = directionsItem.text2;
        document.querySelector("#directions .button").textContent = directionsItem.button;

    });
}

async function getFooterJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/footer");
    footerItems = await response.json();
    loadFooter();
}

function loadFooter() {
    footerItems.forEach(footerItem => {
        document.querySelector("footer .column1 h1").textContent = footerItem.title.rendered;
        document.querySelector("footer .column1 .address p").innerHTML = '<a href="https://maps.google.com/?q=' + footerItem.address + '" target="_blank" rel="noopener noreferrer">' + footerItem.address + '</a>';
        document.querySelector("footer .column1 .phone p").innerHTML = '<a href="tel:' + footerItem.phone + '">' + footerItem.phone + '</a>';
        document.querySelector("footer .column1 .mail p").innerHTML = '<a href="mailto:' + footerItem.mail + '">' + footerItem.mail + '</a>';
        document.querySelector("footer .column1 .cvr p").textContent = footerItem.cvr;
        if (footerItem.facebook == 1 || footerItem.instagram == 1 || footerItem.linkedin == 1) {
            if (footerItem.facebook == 1) {
                let clone = facebookTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("white");
                document.querySelector("footer .column3 .some_icons").appendChild(clone);
            }
            if (footerItem.instagram == 1) {
                let clone = instagramTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("white");
                document.querySelector("footer .column3 .some_icons").appendChild(clone);
            }
            if (footerItem.linkedin == 1) {
                let clone = linkedinTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("white");
                document.querySelector("footer .column3 .some_icons").appendChild(clone);
            }
        } else {
            document.querySelector("footer .column3").classList.add("hidden");
        }
    });
}

async function getHoursJson() {
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/hours");
    hoursItems = await response.json();
    loadHours();
}

function loadHours() {
    hoursItems.forEach(hoursItem => {
        if (hoursItem.open == "") {
            document.querySelector("footer .hours ." + hoursItem.slug).textContent = "Lukket";
        } else {
            document.querySelector("footer .hours ." + hoursItem.slug).textContent = hoursItem.open + "-" + hoursItem.close;
        }

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
