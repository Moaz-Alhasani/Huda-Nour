document.addEventListener('DOMContentLoaded', function() {
    fetchIslamicInfo();
    
    // You can keep your existing header functionality here
    const hamburger = document.getElementById('btnHamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            document.querySelector('.header__menu').classList.toggle('has-fade');
            document.querySelector('.overlay').classList.toggle('hide-for-desktop');
        });
    }
});

async function fetchIslamicInfo() {
    try {
        const response = await fetch('/api/islamic-info');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderIslamicInfo(data);
    } catch (error) {
        console.error('Error fetching Islamic information:', error);
        displayError();
    }
}

function renderIslamicInfo(data) {
    const infoBox = document.querySelector('.info__box');
    infoBox.innerHTML = ''; // Clear existing content
    
    // Convert object to array and sort by importance if needed
    const infoCategories = Object.values(data);
    
    infoCategories.forEach((category, index) => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info__item appear';
        
        const delay = index * 100; // For staggered appearance
        
        infoItem.innerHTML = `
            <h3>${category.title}</h3>
            <div class="info__list">
                ${category.items.map((item, i) => 
                    `<p><span>${i+1}-</span>${item}</p>`
                ).join('')}
            </div>
        `;
        
        infoItem.style.animationDelay = `${delay}ms`;
        infoBox.appendChild(infoItem);
    });
}

function displayError() {
    const infoBox = document.querySelector('.info__box');
    infoBox.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>حدث خطأ في تحميل المعلومات. يرجى المحاولة مرة أخرى لاحقًا.</p>
        </div>
    `;
}