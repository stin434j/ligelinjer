// Her definerer vi de variabler som vi skal bruge til at opbevare vores fetchede items
let navItems = [];
let splashItems = [];
let introItems = [];
let categoryItems = [];
let galleriesItems = [];
let testimonialItems = [];
let aboutItems = [];
// Her definere vi en variabel til at gemme x koordinatet for touch punktet, til brug i galleri sliderne
let clientXBefore = 0;

// Her definere vi de konstanter der bruges, til at gemme vores templates i, inden de skal klones
const navTemp = document.querySelector(".nav_template");
const categoryTemp = document.querySelector(".category_template");
const galleryTemp = document.querySelector(".gallery_template");
const testimonialTemp = document.querySelector(".testimonial_template");
const aboutTemp = document.querySelector(".about_template");
const facebookTemp = document.querySelector(".facebook_template");
const instagramTemp = document.querySelector(".instagram_template");
const linkedinTemp = document.querySelector(".linkedin_template");

// Vi laver en eventListener der lytter på om at content er loaded, og i så fald kalder vi funktionen start
window.addEventListener("DOMContentLoaded", start);


function start() {
    console.log("start");

    // Vi laver en eventListener der lytter på om der bliver klikket på burgermenuen, og i så fald kalder vi funktionen toggleMenu
    document.querySelector(".menu_toggle").addEventListener("click", toggleMenu);

    // Her kalder vi mange af de funktioner der skal fetche indholdet til vores side
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

function toggleMenu() {
    // Vi toggler (dvs. fjerner eller tilføjer) class'en active på vores menu (nav)
    document.querySelector("nav").classList.toggle("active");
}

async function getNavJson() {
    console.log("getNavJson");
    // Vi fetcher indholdet til menu'en
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/menu");
    // Vi ligger json resultatet ind i variablen navItems
    navItems = await response.json();
    // og kalder funktionen loadNav
    loadNav();
}

function loadNav() {
    console.log("loadNav");
    // Vi gennemløber alle navItems en ad gangen
    navItems.forEach((navItem) => {
        // Vi opretter en klon af vores navTemp template
        let clone = navTemp.cloneNode(true).content;
        // Og udfyldeer klonen med data fra den fetchede json i navItem
        clone.querySelector("a").textContent = navItem.title.rendered;
        clone.querySelector("a").href = navItem.href;
        // Vi indsætter klonen i nav med appendChild funktionen.
        document.querySelector("nav").appendChild(clone);
    });
    // Når vi er færdige med at indsætte alle menu punkterne, så gennemløber vi den alle en ad gangen og tilføjer en eventListener
    document.querySelectorAll("nav a").forEach((navLink) => {
        navLink.addEventListener("click", () => {
            // Hvis man klikker på et menupunkt, så skal menuen skjules (hvis man er på mobil), og det gør vi ved at fjerne class'en active fra vores menu (nav)
            document.querySelector("nav").classList.remove("active");
        });
    });
}

async function getSplashJson() {
    console.log("getSplashJson");
    // Vi fetcher indholdet til splash'en
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/splash");
    // Vi ligger json resultatet ind i variablen splashItems
    splashItems = await response.json();
    // og kalder funktionen loadSplash
    loadSplash();
}

function loadSplash() {
    console.log("loadSplash");
    // Vi gennemløber alle splashItems en ad gangen
    splashItems.forEach(splashItem => {
        // Og udfyldeer splash'en med data fra den fetchede json i splashItem
        document.querySelector("#splash video source").src = splashItem.background.guid;
        document.querySelector("#splash h1").textContent = splashItem.headline;
        document.querySelector("#splash p").textContent = splashItem.subheadline;
        document.querySelector("#splash .button").textContent = splashItem.button;
    });
}

async function getIntroJson() {
    console.log("getIntroJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/intro");
    introItems = await response.json();
    loadIntro();
}

function loadIntro() {
    console.log("loadIntro");
    // Vi gennemløber alle introItems en ad gangen
    introItems.forEach(introItem => {
        // Og udfyldeer intro'en med data fra den fetchede json i introItem
        document.querySelector("#intro h1").textContent = introItem.title.rendered;
        document.querySelector("#intro p").textContent = introItem.text;
    });
}

async function getGalleriesJson() {
    console.log("getGalleriesJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/galleries");
    galleriesItems = await response.json();
    loadGalleries();
}

function loadGalleries() {
    console.log("loadGalleries");
    // Vi definerer en variabel til at tælle hvad nummer galleri vi er nåeet til
    let galleryCounter = 0;
    // Vi gennemløber alle galleriesItems en ad gangen
    galleriesItems.forEach((galleriesItem) => {
        // Vi tæller vores variabel én op, så den den har samme værdi som det nummer galleri vi arbejder med er
        galleryCounter++;

        // Først tilføjer vi et galleri punkt til #intro sektionen
        // Det gør vi ved at lave en klon af vores categoryTemp template
        let categoryClone = categoryTemp.cloneNode(true).content;
        // Og udfyldeer klonen med data fra den fetchede json i galleriesItem
        // Vi sætter a-taggets href attribut til #gallery1, #gallery2 etc. for hver galleri, så den linker ned til den rigtige sektion på siden
        categoryClone.querySelector("a.category").href = "#gallery" + galleryCounter;
        categoryClone.querySelector(".img").innerHTML = '<img src="' + galleriesItem.slider1imgs[0].guid + '" alt="' + galleriesItem.slider1imgs[0].post_name + '">';
        categoryClone.querySelector(".headline").innerHTML = galleriesItem.title.rendered;;
        // Vi indsætter klonen i #intro sektionens .categories div med appendChild funktionen.
        document.querySelector("#intro .categories").appendChild(categoryClone);

        // Efter at vi har tilføjet punktet til oversigten i #intro sektionen, så skal vi have lavet selve galleri sektionen
        // Det gør vi ved at lave en klon af vores galleryTemp template
        let clone = galleryTemp.cloneNode(true).content;
        // Vi sætter id'et til gallery1, gallery2 etc. så linket oppe fra #intro sektionen kan gå ned til den rigtige sektion
        clone.querySelector("section").id = "gallery" + galleryCounter;
        // Så tilføjer vi titlen fra json i h1-tagget
        clone.querySelector(".description h1").innerHTML = galleriesItem.title.rendered;
        // Så tilføjer vi slider1name fra json i .slider1_headline som er navnet på den første slider i denne galleri sektion
        clone.querySelector(".slider1_headline").innerHTML = galleriesItem.slider1name;
        // Så tilføjer vi slider1text fra json i .slider1_text som er beskrivelsen på den første slider i denne galleri sektion
        clone.querySelector(".slider1_text").innerHTML = galleriesItem.slider1text;
        // Så tilføjer vi slider2name fra json i .slider2_headline som er navnet på den anden slider i denne galleri sektion
        clone.querySelector(".slider2_headline").innerHTML = galleriesItem.slider2name;
        // Så tilføjer vi slider2text fra json i .slider2_text som er beskrivelsen på den anden slider i denne galleri sektion
        clone.querySelector(".slider2_text").innerHTML = galleriesItem.slider2text;
        // Vi tilføjer også en call-to-action tekst fra vores json fetch
        clone.querySelector(".gallery_cta em").textContent = galleriesItem.cta;
        // Og en tekst til knappen
        clone.querySelector(".button").textContent = galleriesItem.button;
        // For at få de to tabs til at virke, så sætter vi en data attribut (data-name) med navnet på den første slider i den aktive (.active) tab
        clone.querySelector(".tabs .active").setAttribute("data-name", galleriesItem.slider1name);
        // Og skriver også navnet i selve tab'en
        clone.querySelector(".tabs .active h4").textContent = galleriesItem.slider1name;
        // For at få de to tabs til at virke, så sætter vi en data attribut (data-name) med navnet på den anden slider i den inaktive (:not(.active)) tab
        clone.querySelector(".tabs .tab:not(.active)").setAttribute("data-name", galleriesItem.slider2name);
        // Og skriver også navnet i selve tab'en
        clone.querySelector(".tabs .tab:not(.active) h4").textContent = galleriesItem.slider2name;
        // For at gøre slideren klar, så skal den vide hvor mange slides der er, det sætter vi ind i data attibuten data-slides ved at tage .length på array'et med billeder (galleriesItem.slider1imgs)
        clone.querySelector(".slider.active").setAttribute("data-slides", galleriesItem.slider1imgs.length);
        // Vi sætter også data-name attributen, så vi har en fælles reference mellem tab'en og slideren
        clone.querySelector(".slider.active").setAttribute("data-name", galleriesItem.slider1name);
        // Vi definerer en variabel til at tælle hvad billede nummer vi er i gang med at indsætte
        let imageCounter = 0;
        // Vi gennemløber alle billederne i galleriesItem.slider1imgs en ad gangen
        galleriesItem.slider1imgs.forEach((image) => {
            // Vi tæller vores imageCounter én op, så vi har det rigtige nummer
            imageCounter++;
            // Vi indsætter en .slide div med billedet
            clone.querySelector(".slider.active").innerHTML += '<div class="slide slide' + imageCounter + '"><img src="' + image.guid + '" alt="' + image.post_name + '"></div>';
        });
        // For at gøre slideren klar, så skal den vide hvor mange slides der er, det sætter vi ind i data attibuten data-slides ved at tage .length på array'et med billeder (galleriesItem.slider2imgs)
        clone.querySelector(".slider:not(.active)").setAttribute("data-slides", galleriesItem.slider2imgs.length);
        // Vi sætter også data-name attributen, så vi har en fælles reference mellem tab'en og slideren
        clone.querySelector(".slider:not(.active)").setAttribute("data-name", galleriesItem.slider2name);
        // Vi dnulstiller variabel til at tælle hvad billede nummer vi er i gang med at indsætte
        imageCounter = 0;
        galleriesItem.slider2imgs.forEach((image) => {
            // Vi tæller vores imageCounter én op, så vi har det rigtige nummer
            imageCounter++;
            // Vi indsætter en .slide div med billedet
            clone.querySelector(".slider:not(.active)").innerHTML += '<div class="slide slide' + imageCounter + '"><img src="' + image.guid + '" alt="' + image.post_name + '"></div>';
        });
        // Når vi er færdige med at indsætte alt inholdet til galleri sektionen og de to slidere, så indsætter vi klonen i #gallery_container med appendChild funktionen.
        document.querySelector("#gallery_container").appendChild(clone);
    });

    // Når gallerierne er loaded, så kalder vi funktionerne initSliders og initTabs, for at klargøre begge dele så der kan interageres med dem
    initSliders();
    initTabs();
    // Når der er helt styr på gallerierne, så kalder vi funktionen getTestimonialJson, da disse er afhængige af at gallerierne er indsat
    getTestimonialJson();
}

function initSliders() {
    console.log("initSliders");
    // For at gøre vore slidere klar gennemløber vi dem alle en ad gangen
    document.querySelectorAll(".slider").forEach((slider) => {
        // Vi tilføjer en eventListener på knappen .slider_next, der kalder funktionen slideNext som har slideren med som parameter, så den ved hvilken slider det er den skal skifte til næste slide
        slider.querySelector(".slider_next").addEventListener("click", () => {
            slideNext(slider);
        });
        // Vi tilføjer en eventListener på knappen .slider_prev, der kalder funktionen slidePrev som har slideren med som parameter, så den ved hvilken slider det er den skal skifte til forrige slide
        slider.querySelector(".slider_prev").addEventListener("click", () => {
            slidePrev(slider);
        });
        // Vi tilføjer eventListener til slideren for touchstart. Dette var ny viden som vi læste om på https://developer.mozilla.org/en-US/docs/Web/API/Touch/clientX og https://www.w3schools.com/jsref/event_touch_touches.asp som vi har forsøgt at bygge en touch slider funktion ud fra
        slider.addEventListener("touchstart", (event) => {
            console.log("X koordinat ved slider bevægelses start", event.touches[0].clientX);
            // Vi gemmer x koordinatet fra starten af berøringen i vores variabel clientXBefore. Vi bruger touches[0] hvilket betyder at vi kun får koordinatet fra én finger (den første der rør skærmen i denne bevægelse).
            clientXBefore = event.touches[0].clientX;
        }, {
            // Vi gør eventListeneren passive, hvilket betyder at vi fortæller at vi ikke kalder preventDefault funktionen, dette gør vi for at give en bedre scroll oplevelse på siden. Dette kommer fra et forslag fra Google Lighthouse: https://developers.google.com/web/tools/lighthouse/audits/passive-event-listeners
            passive: true
        });
        slider.addEventListener("touchend", (event) => {
            console.log("X koordinat ved slider bevægelses slutning", event.changedTouches[0].clientX);
            // Vi sammenligner den tidligere gemte x koordinat fra begyndelsen af touch bevægelsen med slutpunktet.
            // Hvis startpunktet er større end det nuværrende punkt + 50px, så er der bevæget mod venstre
            if (clientXBefore > (event.changedTouches[0].clientX + 50)) {
                console.log("Da X ved start var større end ved slut, blev slideren bevæget mod venstre");
                // Og derfor kalder vi funktionen slideNext
                slideNext(slider);
                // Hvis startpunktet er mindre end det nuværrende punkt - 50px, så er der bevæget mod højre
            } else if (clientXBefore < (event.changedTouches[0].clientX - 50)) {
                console.log("Da X ved start var mindre end ved slut, blev slideren bevæget mod højre");
                // Og derfor kalder vi funktionen slidePrev
                slidePrev(slider);
            }
        }, {
            // Vi gør eventListeneren passive, hvilket betyder at vi fortæller at vi ikke kalder preventDefault funktionen, dette gør vi for at give en bedre scroll oplevelse på siden. Dette kommer fra et forslag fra Google Lighthouse: https://developers.google.com/web/tools/lighthouse/audits/passive-event-listeners
            passive: true
        });

        // Vi kalder funktionen slideNext, for at få startet slideren, da denne starter på slide 0 (som ikke findes), så kører vi slideNext som skifter til slide nummer 1
        slideNext(slider);
    });
}

function slideNext(slider) {
    console.log("slideNext");

    // Vi starter med at definere to variabler
    // Den første er antallet af slides i denne slider, som vi henter fra data attributen data-slides
    let slides = slider.getAttribute("data-slides");
    // Den næste er hvilkeen af slidesne i denne slider som er aktiv, som vi henter fra data attributen data-active
    let active = slider.getAttribute("data-active");

    // Vi tjekker om der er nogle af billederene der har en af de tre class'er prev, next eller active og i så fald fjerner vi dem
    if (slider.querySelectorAll(".prev").length) {
        slider.querySelector(".prev").classList.remove("prev");
    }
    if (slider.querySelectorAll(".next").length) {
        slider.querySelector(".next").classList.remove("next");
    }
    if (slider.querySelectorAll(".active").length) {
        slider.querySelector(".active").classList.remove("active");
    }

    // Hvis der ikke er flere slides end den aktive, så skal den aktive sættes til første slide, for at lave en slider der kan køre uendeligt
    if (active >= slides) {
        active = 1;
    } else {
        // Ellers hvis der er flere slides, så lægger vi én til active for at få den til at skifte slide til næste
        active++;
    }

    // Vi ser om active er mindre end eller lig med 1, i så fald skal .prev slide være den sidste slide i slideren derfor bruger vi variablen slides som indeholde antallet af slides
    if (active <= 1) {
        slider.querySelector(".slide" + slides).classList.add("prev");
    } else {
        // Ellers sætter vi active-1 til at være .prev da denne i så fald er sliden der skal gåes til hvis man går tilbage i slideren
        slider.querySelector(".slide" + (active - 1)).classList.add("prev");
    }

    // Så giver vi class'en active til den slide vi før fandt ud af skal være den nye aktive slide
    slider.querySelector(".slide" + active).classList.add("active");

    // Vi ser om active er større end eller lig med antallet af slides, i så fald skal .next slide være den første slide i slideren
    if (active >= slides) {
        slider.querySelector(".slide1").classList.add("next");
    } else {
        // Ellers sætter vi active+1 til at være .next da denne i så fald er sliden der skal gåes til hvis man går frem i slideren
        slider.querySelector(".slide" + (active + 1)).classList.add("next");
    }

    // Til sidst opdatere vi data attributen data-active (på slideren) med nummeret på den nye aktive slide
    slider.setAttribute("data-active", active);
}

function slidePrev(slider) {
    console.log("slidePrev");

    // Vi starter med at definere to variabler
    // Den første er antallet af slides i denne slider, som vi henter fra data attributen data-slides
    let slides = slider.getAttribute("data-slides");
    // Den næste er hvilkeen af slidesne i denne slider som er aktiv, som vi henter fra data attributen data-active
    let active = slider.getAttribute("data-active");

    // Vi tjekker om der er nogle af billederene der har en af de tre class'er prev, next eller active og i så fald fjerner vi dem
    if (slider.querySelectorAll(".prev").length) {
        slider.querySelector(".prev").classList.remove("prev");
    }
    if (slider.querySelectorAll(".next").length) {
        slider.querySelector(".next").classList.remove("next");
    }
    if (slider.querySelectorAll(".active").length) {
        slider.querySelector(".active").classList.remove("active");
    }

    // Hvis den aktive slide er den første slide, så skal den aktive sættes til sidste slide, for at lave en slider der kan køre uendeligt
    if (active <= 1) {
        active = slides;
    } else {
        // Ellers hvis der er flere slides, så trækker vi én fra active for at få den til at skifte slide til den forrige
        active--;
    }

    // Vi ser om active er mindre end eller lig med 1, i så fald skal .prev slide være den sidste slide i slideren derfor bruger vi variablen slides som indeholde antallet af slides
    if (active <= 1) {
        slider.querySelector(".slide" + slides).classList.add("prev");
    } else {
        slider.querySelector(".slide" + (active - 1)).classList.add("prev");
    }

    // Så giver vi class'en active til den slide vi før fandt ud af skal være den nye aktive slide
    slider.querySelector(".slide" + active).classList.add("active");

    // Vi ser om active er større end eller lig med antallet af slides, i så fald skal .next slide være den første slide i slideren
    if (active >= slides) {
        slider.querySelector(".slide1").classList.add("next");
    } else {
        // Ellers sætter vi active+1 til at være .next da denne i så fald er sliden der skal gåes til hvis man går frem i slideren
        slider.querySelector(".slide" + (active + 1)).classList.add("next");
    }

    // Til sidst opdatere vi data attributen data-active (på slideren) med nummeret på den nye aktive slide
    slider.setAttribute("data-active", active);
}

function initTabs() {
    console.log("initTabs");
    // For at gøre de to tabs i gallerierne brugbare, så skal de gøres klar
    // Dette gør vi ved at gennemløbe alle .gallery'erne en ad gangen
    document.querySelectorAll(".gallery").forEach((gallery) => {
        // og også gennemløbe alle .tab'ne i hvert galleri en ad gangen
        gallery.querySelectorAll(".tab").forEach((tab) => {
            // Her tilføjer vi så en eventListener ved klik på tab'en
            tab.addEventListener("click", (event) => {
                // Vi definere en variabel thisTab, som skal gemme en reference til den tab der er trykket på
                let thisTab;
                // Vi starter med at kigge på om elementet der er klikket på har et child, hvis ikke
                if (e.target.firstElementChild == null) {
                    // så skal vi have fat dette elements forælder, da der så er trykket på h2 tagget inde i tab'en og ikke selve tab'en
                    thisTab = event.target.parentElement;
                } else {
                    // ellers er der trykket på selve tab'en og vi gemmer den som referenece i vores variabel
                    thisTab = event.target;
                }
                // Så ser vi på om denne tab har class'en active
                if (!thisTab.classList.contains("active")) {
                    // I så fald den ikkee har, så skal vi fjernee class'en active fra den der er aktiv
                    gallery.querySelector(".tab.active").classList.remove("active");
                    // Og tilføje den til den klikkede tab i stedet.
                    thisTab.classList.add("active");
                    // Vi laver en variabel som skal holde navnet på det galleri der hører til tab'en, så vi kan skifte galleriets synlighed
                    let galleryName = thisTab.getAttribute("data-name");
                    // Vi fjerner class'en active fra det galleri der havde den før
                    gallery.querySelector(".slider.active").classList.remove("active");
                    // Og tilføjer den derefter til det galleri der hører sammen med den tab der er klikket på
                    gallery.querySelector(".slider[data-name='" + galleryName + "']").classList.add("active");
                }
            });
        });
    });
}

async function getTestimonialJson() {
    console.log("getTestimonialJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/testimonials");
    testimonialItems = await response.json();
    loadTestimonials();
}

function loadTestimonials() {
    console.log("loadTestimonials");
    // Vi definerer en variabel til at tælle hvad nummer testimonial vi er nåeet til, denne skal vi bruge senere til at indsætte testimonialen efter den tilsvarende gallery section
    let testimonialCounter = 0;
    // Da vi ikke vil have flere testimonials end vi har gallerier (da der skal være ét efter hvert galleri), så skal vi gemme hvor mange gallery sections der er, dette gemmer vi i variablen maxTestimonials
    let maxTestimonials = document.querySelectorAll(".gallery").length;
    // Så gennemløber vi alle de fetchede testimonials en ad gangen
    testimonialItems.forEach((testimonialItem) => {
        // Vi tæller vores counter én op, så tallet passer
        testimonialCounter++;
        // Så længe vi ikke ikke er nået over maxTestimonials så fortsætter vi
        if (testimonialCounter <= maxTestimonials) {
            // Vi laver en klon af vores testimonialTemp template
            let clone = testimonialTemp.cloneNode(true).content;
            // Og udfyldeer klonen med data fra den fetchede json i testimonialItem
            clone.querySelector(".author").textContent = "- " + testimonialItem.title.rendered;
            clone.querySelector(".quote em").textContent = testimonialItem.testimonial;
            // Da vi skal indsætte testimonialen efter det tilsvarende gallery, så finder vi galleriet og lægger det i variablen galleryNode
            let galleryNode = document.querySelector("#gallery" + testimonialCounter);
            // Her bliver det lidt kringlet, da der ikke er en funktion til at indsætte efter, så har vi fundet følgende med hjælp fra https://stackoverflow.com/a/4793630
            // Så derfor finder vi forældren til galleriet, og på denne kalder vi insertBefore, men da vi ikke skal indsætte før galleriet men efter, så skriver vi at vi skal indsætte den før galleryNode.nextSibling, som er elementet efter vores galleri.
            galleryNode.parentNode.insertBefore(clone, galleryNode.nextSibling);
        }
    });
}

async function getAboutJson() {
    console.log("getAboutJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/about");
    aboutItems = await response.json();
    loadAbout();
}

function loadAbout() {
    console.log("loadAbout");
    // Vi gennemløber alle aboutItems en ad gangen
    aboutItems.forEach((aboutItem) => {
        // Vi laver en klon fra aboutTemp
        let clone = aboutTemp.cloneNode(true).content;
        // Og udfylder klonen med det data vi har fetched
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
        // Vi indsætter klonen i #about_container'en
        document.querySelector("#about_container").appendChild(clone);
    });
}

async function getInterviewJson() {
    console.log("getInterviewJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/interview");
    interviewItems = await response.json();
    loadInterview();
}

function loadInterview() {
    console.log("loadInterview");
    // Vi gennemløber alle interviewitems en ad gangen
    interviewItems.forEach(interviewItem => {
        // Og udfylder elementerne i #interview med den data vi har fetched
        document.querySelector("#interview h1").textContent = interviewItem.title.rendered;
        document.querySelector("#interview video source").src = interviewItem.video.guid;
        document.querySelector("#interview .quote em").textContent = interviewItem.text;
        document.querySelector("#interview .author").textContent = "- " + interviewItem.by;
        // Vi kører funktionen load på vores video for at gøre den klar til afspilning
        document.querySelector("#interview video").load();
    });
}

async function getEventsJson() {
    console.log("getEventsJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/events");
    eventItems = await response.json();
    loadEvents();
}

function loadEvents() {
    console.log("loadEvents");
    // Vi gennemløber alle eventItems en ad gangen
    eventItems.forEach(eventItem => {
        // Og udfylder data'en vi har fetched i elementerne i #event
        document.querySelector("#events h1").textContent = eventItem.title.rendered;
        document.querySelector("#events .text").textContent = eventItem.text;
        console.log(eventItem);
        document.querySelector("#events img").src = eventItem.img.guid;
        document.querySelector("#events img").alt = eventItem.img.post_name;
        // Vi kigger i den fetchede data om nogle af de tre sociale medie ikoner er valgt til at skulle vises
        if (eventItem.facebook == 1 || eventItem.instagram == 1 || eventItem.linkedin == 1) {
            // Hvis facebook er valgt laver vi en klon af facebookTemp og indsætter denne
            if (eventItem.facebook == 1) {
                let clone = facebookTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("black");
                document.querySelector("#events .some_icons").appendChild(clone);
            }
            // Hvis instagram er valgt laver vi en klon af instagramTemp og indsætter denne
            if (eventItem.instagram == 1) {
                let clone = instagramTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("black");
                document.querySelector("#events .some_icons").appendChild(clone);
            }
            // Hvis linkedin er valgt laver vi en klon af linkedinTemp og indsætter denne
            if (eventItem.linkedin == 1) {
                let clone = linkedinTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("black");
                document.querySelector("#events .some_icons").appendChild(clone);
            }
        } else {
            // Hvis ingen af de sociale medie ikoner er valgt skjuler vi denne del ved at tilføje class'en hidden
            document.querySelector("#events .follow").classList.add("hidden");
            document.querySelector("#events .some_icons").classList.add("hidden");
        }
    });
}

async function getDirectionsJson() {
    console.log("getDirectionsJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/directions");
    directionsItems = await response.json();
    loadDirections();
}

function loadDirections() {
    console.log("loadDirections");
    // Vi gennemløber alle directionsItems en ad gangen
    directionsItems.forEach(directionsItem => {
        // Og udfylder den fetchede data i #directions
        document.querySelector("#directions h1").textContent = directionsItem.title.rendered;
        document.querySelector("#directions .text1").textContent = directionsItem.text1;
        document.querySelector("#directions .text2").textContent = directionsItem.text2;
        document.querySelector("#directions .button").textContent = directionsItem.button;

    });
}

async function getFooterJson() {
    console.log("getFooterJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/footer");
    footerItems = await response.json();
    loadFooter();
}

function loadFooter() {
    console.log("loadFooter");
    // Vi gennemløber alle footerItems
    footerItems.forEach(footerItem => {
        // Og udfylder den fetchede data i footer'en
        document.querySelector("footer .column1 h1").textContent = footerItem.title.rendered;
        // Vi laver et link til Google Maps som åbner når man trykker på adressen
        document.querySelector("footer .column1 .address p").innerHTML = '<a href="https://maps.google.com/?q=' + footerItem.address + '" target="_blank" rel="noopener noreferrer">' + footerItem.address + '</a>';
        // Vi laver et tel: link som gør at man kan ringe op ved at trykke på telefon nummeret
        document.querySelector("footer .column1 .phone p").innerHTML = '<a href="tel:' + footerItem.phone + '">' + footerItem.phone + '</a>';
        // Vi tilføjer et mailto: link som gør at man kan sende en mail ved at klikke på email adressen
        document.querySelector("footer .column1 .mail p").innerHTML = '<a href="mailto:' + footerItem.mail + '">' + footerItem.mail + '</a>';
        document.querySelector("footer .column1 .cvr p").textContent = footerItem.cvr;
        // Vi kigger i den fetchede data om nogle af de tre sociale medie ikoner er valgt til at skulle vises
        if (footerItem.facebook == 1 || footerItem.instagram == 1 || footerItem.linkedin == 1) {
            // Hvis facebook er valgt laver vi en klon af facebookTemp og indsætter denne
            if (footerItem.facebook == 1) {
                let clone = facebookTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("white");
                document.querySelector("footer .column3 .some_icons").appendChild(clone);
            }
            // Hvis instagram er valgt laver vi en klon af instagramTemp og indsætter denne
            if (footerItem.instagram == 1) {
                let clone = instagramTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("white");
                document.querySelector("footer .column3 .some_icons").appendChild(clone);
            }
            // Hvis linkedin er valgt laver vi en klon af linkedinTemp og indsætter denne
            if (footerItem.linkedin == 1) {
                let clone = linkedinTemp.cloneNode(true).content;
                clone.querySelector(".some_icon").classList.add("white");
                document.querySelector("footer .column3 .some_icons").appendChild(clone);
            }
        } else {
            // Hvis ingen af de sociale medie ikoner er valgt skjuler vi tredje kolonne som alligevel kun bliver brugt til sociale medier
            document.querySelector("footer .column3").classList.add("hidden");
        }
    });
}

async function getHoursJson() {
    console.log("getHoursJson");
    const response = await fetch("https://www.pindbodesign.dk/ligelinjer/wordpress/wp-json/wp/v2/hours");
    hoursItems = await response.json();
    loadHours();
}

function loadHours() {
    console.log("loadHours");
    // Vi gennemløber alle hoursItems en ad gangen
    hoursItems.forEach(hoursItem => {
        // Hvis der ikke er angivet et åbningstidspunkt så skriver vi lukket
        if (hoursItem.open == "") {
            document.querySelector("footer .hours ." + hoursItem.slug).textContent = "Lukket";
            // ellers skriver vi åbningstiderne
        } else {
            document.querySelector("footer .hours ." + hoursItem.slug).textContent = hoursItem.open + "-" + hoursItem.close;
        }

    });
}
