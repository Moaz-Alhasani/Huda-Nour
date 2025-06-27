// Function to fetch posts from backend
async function fetchNewsPosts() {
    try {
        const response = await fetch('/api/news'); // Your API endpoint
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching news posts:', error);
        throw error;
    }
}

// Function to create a single post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'posts__post appear';
    
    postElement.innerHTML = `
        <h2 class="posts__title">${post.title}</h2>
        <div class="posts__img-container">
            <img class="posts__img" src="${post.imageUrl}" alt="${post.title}">
        </div>
        <p class="posts__content">${post.content}</p>
    `;
    
    return postElement;
}

// Function to render all posts
function renderPosts(posts) {
    const postsContainer = document.querySelector('.posts');
    
    // Clear existing posts (if any)
    postsContainer.innerHTML = '';
    
    // Create and append each post
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Main function to load and display posts
async function loadNewsPosts() {
    try {
        const posts = await fetchNewsPosts();
        renderPosts(posts);
    } catch (error) {
        // Display error message to user
        const postsContainer = document.querySelector('.posts');
        postsContainer.innerHTML = `
            <div class="error-message">
                حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة مرة أخرى لاحقًا.
            </div>
        `;
    }
}

// Load posts when page is ready
document.addEventListener('DOMContentLoaded', loadNewsPosts);



//

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
