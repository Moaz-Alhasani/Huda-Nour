// Main initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the dashboard when page loads
    initDashboard();
});


//  Initializes the dashboard functionality

function initDashboard() {
    // Load initial content based on active section in sidebar
    const activeSection = document.querySelector('.sidebar-menu li.active a').getAttribute('data-section');
    loadSection(activeSection);
    // Setup navigation event listeners
    setupNavigation();
    // Load users data if users section is active
    if (activeSection === 'users-section') {
        loadUsers();
        loadExperts();
    }
}


//   Sets up navigation event listeners for sidebar links

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            // Update active state in sidebar
            document.querySelectorAll('.sidebar-menu li').forEach(el => {
                el.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            // Load the selected section content
            const sectionId = this.getAttribute('data-section');
            loadSection(sectionId);
        });
    });
}

function loadSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
        // Load specific data if needed
        if (sectionId === 'users-section') {
            loadUsers();
        }
    }
}

// ====================== USERS MANAGEMENT ====================== //

//  
function loadUsers() {
    showLoading('#usersTable tbody');
    // Fetch users data from JSON file
    fetch('/app/js/test.json')
        .then(handleResponse)
        .then(users => {
            renderUsersTable(users);
        })
        .catch(error => {
            showError('#usersTable tbody', 'خطأ في تحميل بيانات المستخدمين');
            console.error('Error loading users:', error);
        });
}

function renderUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';
    // Show message if no users
    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    لا يوجد مستخدمين مسجلين
                </td>
            </tr>
        `;
        return;
    }
    // Populate table with user data
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || '---'}</td>
            <td>${user.email || '---'}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="btn btn-delete" data-id="${user._id}">
                    <i class="fas fa-trash"></i>
                    <span>حذف</span>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    // Add delete event listeners to all delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            deleteUser(userId);
        });
    });
}

function deleteUser(userId) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
        showLoading('#usersTable tbody');
        // Send DELETE request to server
        fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(handleResponse)
            .then(() => {
                showSuccess('تم حذف المستخدم بنجاح');
                loadUsers(); // Refresh users list
            })
            .catch(error => {
                showError('#usersTable tbody', 'فشل حذف المستخدم');
                console.error('Delete error:', error);
            });
    }
}

// Experts management
function loadExperts() {
    showLoading('#expertsTable tbody');
    fetch('/api/admin/experts')  // Matches your GET /api/admin/experts endpoint
        .then(handleResponse)
        .then(data => {
            renderExpertsTable(data.data);  // Access the 'data' property from response
        })
        .catch(error => {
            showError('#expertsTable tbody', 'خطأ في تحميل بيانات الخبراء');
            console.error('Error loading experts:', error);
        });
}

function renderExpertsTable(experts) {
    const tableBody = document.querySelector('#expertsTable tbody');
    tableBody.innerHTML = '';
    
    if (!experts || experts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    لا يوجد خبراء مسجلين
                </td>
            </tr>
        `;
        return;
    }

    experts.forEach((expert, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${expert.name || '---'}</td>
            <td>${expert.email || '---'}</td>
            <td>${formatDate(expert.createdAt)}</td>
            <td>${expert.status === 'APPROVED' ? 'مقبول' : 'قيد الانتظار'}</td>
            <td>
                ${expert.status !== 'APPROVED' ? `
                <button class="btn btn-accept" data-id="${expert.id}">
                    <i class="fas fa-check"></i>
                    <span>قبول</span>
                </button>
                ` : ''}
                <button class="btn btn-delete" data-id="${expert.id}">
                    <i class="fas fa-trash"></i>
                    <span>حذف</span>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for accept buttons
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', function() {
            const expertId = this.getAttribute('data-id');
            acceptExpert(expertId);
        });
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const expertId = this.getAttribute('data-id');
            deleteExpert(expertId);
        });
    });
}

function acceptExpert(expertId) {
    if (confirm('هل أنت متأكد من رغبتك في قبول هذا الخبير؟')) {
        showLoading('#expertsTable tbody');
        fetch(`/api/admin/experts/${expertId}/accept`, {
            method: 'POST',  // or patch 
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(handleResponse)
        .then(() => {
            showSuccess('تم قبول الخبير بنجاح وسيتم إرسال بريد التأكيد');
            loadExperts();  // Refresh the table
        })
        .catch(error => {
            showError('#expertsTable tbody', 'فشل في قبول الخبير');
            console.error('Accept error:', error);
        });
    }
}

function deleteExpert(expertId) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الخبير؟')) {
        showLoading('#expertsTable tbody');
        fetch(`/api/admin/experts/${expertId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(handleResponse)
        .then(() => {
            showSuccess('تم حذف الخبير بنجاح');
            loadExperts();  // Refresh the table
        })
        .catch(error => {
            showError('#expertsTable tbody', 'فشل حذف الخبير');
            console.error('Delete error:', error);
        });
    }
}

// Helper function to handle API responses
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(err => {
            throw new Error(err.message || 'حدث خطأ في الخادم');
        });
    }
    return response.json();
}
// ====================== UTILITY FUNCTIONS (Consolidated) ====================== //
/**
 * Handles API response
 */
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(err => {
            throw new Error(err.message || 'حدث خطأ في الخادم');
        });
    }
    return response.json();
}

/**
 * Formats a date string
 */
function formatDate(dateString) {
    if (!dateString) return '---';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

/**
 * Shows loading indicator 
 */
function showLoading(selectorOrElement, message = "جاري التحميل...") {
    const element = typeof selectorOrElement === 'string' ?
        document.querySelector(selectorOrElement) : selectorOrElement;

    if (element) {
        if (element.tagName === 'TBODY') {
            element.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="fas fa-spinner fa-spin"></i> ${message}
                    </td>
                </tr>
            `;
        } else if (element.classList.contains('quiz-questions-container') ||
            element.classList.contains('islamic-content-cards')) {
            element.innerHTML = '<div class="loading-spinner"></div>';
        } else {
            element.innerHTML = `<div class="spinner">${message}</div>`;
        }
    }
}

/**
 * Shows success message
 */
function showSuccess(message) {
    // Create a toast notification
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

/**
 * Shows error message
 */
function showError(selectorOrElement, message) {
    let element;

    if (selectorOrElement === null) {
        alert(message);
        return;
    }

    element = typeof selectorOrElement === 'string' ?
        document.querySelector(selectorOrElement) : selectorOrElement;

    if (element) {
        if (element.tagName === 'TBODY') {
            element.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-danger">
                        <i class="fas fa-exclamation-circle"></i> ${message}
                    </td>
                </tr>
            `;
        } else if (element.classList.contains('quiz-questions-container') ||
            element.classList.contains('islamic-content-cards')) {
            element.innerHTML = `<div class="error-message">${message}</div>`;
        } else {
            const alert = document.createElement('div');
            alert.className = 'alert error';
            alert.textContent = message;
            element.appendChild(alert);
            setTimeout(() => alert.remove(), 3000);
        }
    }
}

// ====================== SCROLLING AND NAVIGATION ====================== //
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.sidebar-menu .nav-link');

    function scrollToSection(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            updateActiveLink(this);
        }
    }

    function updateActiveLink(clickedLink) {
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        clickedLink.parentElement.classList.add('active');
    }

    function checkActiveSection() {
        const scrollPosition = window.scrollY + 100;

        document.querySelectorAll('.content-section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = '#' + section.id;
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === sectionId) {
                        updateActiveLink(link);
                    }
                });
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', scrollToSection);
    });

    window.addEventListener('scroll', checkActiveSection);
    checkActiveSection();
});

// ====================== ISLAMIC CONTENT MANAGEMENT ====================== //
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('contentModal');
    const addBtn = document.getElementById('addIslamicContent');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('contentForm');
    const contentContainer = document.querySelector('.islamic-content-cards');

    loadIslamicContent();

    addBtn.addEventListener('click', function () {
        document.getElementById('modalTitle').textContent = 'إضافة محتوى جديد';
        form.reset();
        document.getElementById('contentId').value = '';
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', handleFormSubmit);

    window.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    async function loadIslamicContent() {
        try {
            showLoading(contentContainer);
            const response = await fetch('/api/islamic-content');
            const data = await handleResponse(response);
            renderContentCards(data);
        } catch (error) {
            showError(contentContainer, 'فشل تحميل المحتوى');
            console.error('Loading error:', error);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('contentId').value;
        const title = document.getElementById('contentTitle').value.trim();
        const content = document.getElementById('contentText').value.trim();

        if (!title || !content) {
            alert('الرجاء إدخال جميع البيانات المطلوبة');
            return;
        }

        const contentData = {
            title: title,
            content: content.split('\n').filter(item => item.trim() !== '')
        };

        try {
            showLoading(contentContainer);
            if (id) {
                await updateIslamicContent(id, contentData);
                showSuccess('تم تحديث المحتوى بنجاح');
            } else {
                await createIslamicContent(contentData);
                showSuccess('تم إضافة المحتوى بنجاح');
            }
            await loadIslamicContent();
            closeModal();
        } catch (error) {
            showError(contentContainer, id ? 'فشل تحديث المحتوى' : 'فشل إضافة المحتوى');
            console.error('Submission error:', error);
        }
    }

    // CRUD operations
    async function createIslamicContent(contentData) {
        const response = await fetch('/api/islamic-content', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(contentData)
        });
        return handleResponse(response);
    }

    async function updateIslamicContent(id, contentData) {
        const response = await fetch(`/api/islamic-content/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(contentData)
        });
        return handleResponse(response);
    }

    async function deleteIslamicContent(id) {
        const response = await fetch(`/api/islamic-content/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    }

    // UI functions
    function renderContentCards(contents) {
        contentContainer.innerHTML = '';

        if (!contents || contents.length === 0) {
            contentContainer.innerHTML = `
                <div class="empty-message">
                    لا يوجد محتوى متاح
                </div>
            `;
            return;
        }

        contents.forEach(content => {
            const contentItems = content.content
                .map((item, index) => `<p><span>${index + 1}.</span> ${item}</p>`)
                .join('');

            const card = document.createElement('div');
            card.className = 'content-card';
            card.dataset.id = content._id;
            card.innerHTML = `
                <div class="card-header">
                    <h3>${content.title}</h3>
                    <div class="card-actions">
                        <button class="btn-edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="card-content">${contentItems}</div>
            `;

            card.querySelector('.btn-edit').addEventListener('click', () => openEditModal(content));
            card.querySelector('.btn-delete').addEventListener('click', () => handleDelete(content._id));
            contentContainer.appendChild(card);
        });
    }

    function openEditModal(content) {
        document.getElementById('modalTitle').textContent = 'تعديل المحتوى';
        document.getElementById('contentId').value = content._id;
        document.getElementById('contentTitle').value = content.title;
        document.getElementById('contentText').value = content.content.join('\n');
        modal.style.display = 'block';
    }

    async function handleDelete(id) {
        if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;
        try {
            showLoading(contentContainer);
            await deleteIslamicContent(id);
            showSuccess('تم حذف المحتوى بنجاح');
            await loadIslamicContent();
        } catch (error) {
            showError(contentContainer, 'فشل حذف المحتوى');
            console.error('Deletion error:', error);
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function getHeaders() {
        return {
            'Content-Type': 'application/json',
        };
    }
});

// ====================== posts MANAGEMENT ====================== //

document.addEventListener('DOMContentLoaded', function () {
    // Load posts when posts section is accessed
    document.querySelector('[data-section="posts-section"]').addEventListener('click', loadPosts);

    // Add post button
    document.getElementById('addPostBtn').addEventListener('click', function () {
        openPostModal();
    });

    // Post form submission
    document.getElementById('postForm').addEventListener('submit', handlePostSubmit);

    // Modal close buttons
    document.querySelector('#postModal .close').addEventListener('click', closePostModal);
    document.getElementById('cancelPost').addEventListener('click', closePostModal);
});

function loadPosts() {
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل المنشورات...</div>';

    // Fetch posts from API
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            renderPosts(posts);
        })
        .catch(error => {
            console.error('Error loading posts:', error);
            postsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    حدث خطأ أثناء تحميل المنشورات. يرجى المحاولة مرة أخرى.
                </div>
            `;
        });
}

function renderPosts(posts) {
    const postsContainer = document.querySelector('.posts-container');

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <p>لا توجد منشورات متاحة حالياً</p>
            </div>
        `;
        return;
    }

    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.dataset.id = post.id;

        postElement.innerHTML = `
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-actions">
                    <button class="btn-edit" data-id="${post.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${post.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            ${post.imageUrl ? `
            <div class="post-image-container">
                <img src="${post.imageUrl}" alt="${post.title}" class="post-image">
            </div>
            ` : ''}
            <div class="post-content">
                <p>${post.content}</p>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });

    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function () {
            const postId = this.dataset.id;
            editPost(postId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function () {
            const postId = this.dataset.id;
            deletePost(postId);
        });
    });
}

function openPostModal(post = null) {
    const modal = document.getElementById('postModal');
    const form = document.getElementById('postForm');

    if (post) {
        document.getElementById('postModalTitle').textContent = 'تعديل المنشور';
        document.getElementById('postId').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postImage').value = post.imageUrl || '';
        document.getElementById('postContent').value = post.content;
    } else {
        document.getElementById('postModalTitle').textContent = 'إضافة منشور جديد';
        form.reset();
    }

    modal.style.display = 'block';
}

function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
}

function handlePostSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const postId = form.postId.value;
    const postData = {
        title: form.postTitle.value,
        imageUrl: form.postImage.value,
        content: form.postContent.value
    };

    const method = postId ? 'PUT' : 'POST';
    const url = postId ? `/api/posts/${postId}` : '/api/posts';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(() => {
            closePostModal();
            loadPosts();
        })
        .catch(error => {
            console.error('Error saving post:', error);
            alert('حدث خطأ أثناء حفظ المنشور');
        });
}

function editPost(postId) {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            openPostModal(post);
        })
        .catch(error => {
            console.error('Error fetching post:', error);
            alert('حدث خطأ أثناء تحميل المنشور للتعديل');
        });
}

function deletePost(postId) {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
        fetch(`/api/posts/${postId}`, {
            method: 'DELETE'
        })
            .then(() => {
                loadPosts();
            })
            .catch(error => {
                console.error('Error deleting post:', error);
                alert('حدث خطأ أثناء حذف المنشور');
            });
    }
}


// ====================== QUIZ MANAGEMENT ====================== //

document.addEventListener('DOMContentLoaded', function () {
    const quizModal = document.getElementById('quizModal');
    const quizForm = document.getElementById('quizForm');
    const quizContainer = document.querySelector('.quiz-questions-container');

    loadQuizQuestions();

    document.getElementById('addQuizBtn').addEventListener('click', openAddModal);
    quizModal.querySelector('.close').addEventListener('click', closeModal);
    quizForm.addEventListener('submit', handleSubmit);
    window.addEventListener('click', (e) => e.target === quizModal && closeModal());

    async function loadQuizQuestions() {
        try {
            showLoading(quizContainer);
            const res = await fetch('/api/quizzes');
            const data = await handleResponse(res);
            renderQuestions(data);
        } catch (err) {
            showError(quizContainer, 'Failed to load questions');
            console.error('Load Error:', err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = {
            _id: document.getElementById('quizId').value || undefined,
            question: document.getElementById('quizQuestion').value.trim(),
            options: [
                document.getElementById('answer0').value.trim(),
                document.getElementById('answer1').value.trim(),
                document.getElementById('answer2').value.trim(),
                document.getElementById('answer3').value.trim()
            ],
            correctAnswer: parseInt(document.getElementById('correctAnswer').value)
        };

        if (!formData.question || formData.options.some(opt => !opt) ||
            isNaN(formData.correctAnswer)) {
            return alert('Please fill all fields');
        }

        try {
            showLoading(quizContainer);
            const url = formData._id ? `/api/quizzes/${formData._id}` : '/api/quizzes';
            const method = formData._id ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            await handleResponse(res);
            await loadQuizQuestions();
            closeModal();
            showSuccess(formData._id ? 'Question updated!' : 'Question added!');
        } catch (err) {
            showError(quizContainer, 'Operation failed');
            console.error('Submit Error:', err);
        }
    }

    async function deleteQuestion(id) {
        if (!confirm('Delete this question?')) return;
        try {
            showLoading(quizContainer);
            const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
            await handleResponse(res);
            await loadQuizQuestions();
            showSuccess('Question deleted!');
        } catch (err) {
            showError(quizContainer, 'Deletion failed');
            console.error('Delete Error:', err);
        }
    }

    function renderQuestions(questions) {
        quizContainer.innerHTML = questions.length ? '' : `
            <div class="empty">No questions found</div>
        `;

        questions.forEach((q, i) => {
            const card = document.createElement('div');
            card.className = 'quiz-card';
            card.dataset.id = q._id;
            card.innerHTML = `
                <div class="quiz-header">
                    <h3>Question #${i + 1}</h3>
                    <div class="quiz-actions">
                        <button class="btn-edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="quiz-content">
                    <div class="quiz-question">
                        <strong>Question:</strong>
                        <p>${q.question}</p>
                    </div>
                    <div class="quiz-answers">
                        ${q.options.map((opt, j) => `
                            <div class="answer-option ${j === q.correctAnswer ? 'correct' : ''}">
                                <strong>Option ${j + 1}:</strong>
                                <p>${opt}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            card.querySelector('.btn-edit').addEventListener('click', () => openEditModal(q));
            card.querySelector('.btn-delete').addEventListener('click', () => deleteQuestion(q._id));
            quizContainer.appendChild(card);
        });
    }

    function openAddModal() {
        document.getElementById('quizModalTitle').textContent = 'Add New Question';
        quizForm.reset();
        document.getElementById('quizId').value = '';
        quizModal.style.display = 'block';
    }

    function openEditModal(question) {
        document.getElementById('quizModalTitle').textContent = 'Edit Question';
        document.getElementById('quizId').value = question._id;
        document.getElementById('quizQuestion').value = question.question;
        question.options.forEach((opt, i) => {
            document.getElementById(`answer${i}`).value = opt;
        });
        document.getElementById('correctAnswer').value = question.correctAnswer;
        quizModal.style.display = 'block';
    }

    function closeModal() {
        quizModal.style.display = 'none';
    }
});