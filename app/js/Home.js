// // Select elements using BEM class names
// const hamburgerIcon = document.querySelector(".header__icon--hamburger");
// const closeIcon = document.querySelector(".header__icon--close");
// const navList = document.querySelector(".nav__list__mobile");
// const navItems = document.querySelectorAll(".nav__item");

// // Since overlay is now always visible, we don't need to toggle its visibility
// hamburgerIcon.addEventListener("click", () => {
//     // Toggle hamburger visibility
//     hamburgerIcon.classList.remove("visible");
//     hamburgerIcon.classList.add("hidden");

//     closeIcon.classList.add("visible");
//     closeIcon.classList.remove("hidden");


//     // Show the navigation list
//     navList.classList.add("visible");
//     navList.classList.remove("hidden");

// });

// closeIcon.addEventListener("click", () => {
//     // Toggle close icon visibility
//     closeIcon.classList.remove("visible");
//     closeIcon.classList.add("hidden");

//     hamburgerIcon.classList.add("visible");
//     hamburgerIcon.classList.remove("hidden");


//     // Hide the navigation list
//     navList.classList.add("hidden");
//     navList.classList.remove("visible");

// });



// if (window.innerWidth > 1023) {
//     console.log("hello");
//     navList.classList.remove("hidden");
// }

const btnHamburger = document.querySelector("#btnHamburger");
const header = document.querySelector(".header");
const overlay = document.querySelector(".overlay");
const fadeElems = document.querySelectorAll(".has-fade"); // overlay and menu
const body = document.querySelector("body");

btnHamburger.addEventListener("click", function () { // open
    if (header.classList.contains("open")) {
        header.classList.remove("open");
        fadeElems.forEach(function (e) {
            e.classList.add("fade-out");
            e.classList.remove("fade-in");
        })

    } else {                                  // close 
        header.classList.add("open");
        fadeElems.forEach(function (e) {
            e.classList.remove("fade-out");
            e.classList.add("fade-in")
        })


    }
})
// don't forget to do this if you want 
// // Handle nav item clicks
// navItems.forEach((clickedItem) => {
//     clickedItem.addEventListener("click", () => {
//         // Remove active class from all items
//         navItems.forEach((item) => {
//             item.classList.remove("active");
//         });

//         // Add active class to clicked item
//         clickedItem.classList.add("active");

//     });
// });

