//
// DOM MANIPULATION and elements
//
const bodyElement = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const showBookList = document.querySelector('.logo');
const bookList = document.querySelector('.bookList');
const addBook = document.getElementById('add-book-form');
const editBook = document.getElementById('edit-book-form');
const loginForm = document.getElementById('logInForm');
const registerForm = document.getElementById('registerForm');

// state variable
let cachedBooks = []
// =========================================
// AUTHENTICATION logic: register/login with jwt
// =========================================

// store token
const getToken = () => localStorage.getItem('shelfBuddyToken');
const setToken = (token) => localStorage.setItem('shelfBuddyToken', token);
const clearToken = () => localStorage.removeItem('shelfBuddyToken');

// jwt header gen
const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// Login
const loginUser = async (identifier, password) => {
    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                identifier: document.getElementById('loginIdentifier').value,
                password: document.getElementById('loginPassword').value
            })
        });
        const data = await res.json();

        if(!res.ok) {
            console.log('Login failed:', data.msg || data.error);
            alert('Failed to login: ', data.msg || data.error);
            return;
        }
        setToken(data.token); // saves jwt
        alert('Login successful!');
        fetchBooks();
    } catch (err) {
        console.error('Login error:', err);
    }
};

// register 
const registerUser = async (username, email, password) => {
    try {
        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({username, email, password})
        });
        const data = await res.json();

        if (!res.ok) {
            console.log('Failed registration');
            alert('Registration failed', data.error);
            return;
        }
        alert('Welcome! Please log in');
    } catch (err) {
        console.error('Registration error:', err);
    }
};
    
// logout
const logoutUser = () => {
    clearToken();
    cachedBooks = [];
    bookList.innerHTML = '';
    alert('Come back soon!')
}

// =========================================
// CRUD logic
// =========================================

// ===GET=== fetch books from API (GET all and store them in cachedBooks), auth
const fetchBooks = async () => {
    if (!getToken()) {
        console.log('User not logged in. Unable to retrieve books');
    }
    try { 
        const res = await fetch('/api/books', {
            headers: { 'Authorization': `Bearer ${getToken()}`}
        });
        const books = await res.json();
        
        if (res.status === 401) {
            clearToken();
            alert('Session expired. Sign in again!');
            return;
        }

        if (books.length === 0) {
            console.log('No books added to database yet!');
            cachedBooks = books;
        } else {
            console.log('Books from DB:', books);
            cachedBooks = books;   // saves booklist on variable
        }
    } catch (err) {
        console.log("Error fetching books:", err);
        bookList.innerHTML = `<p class="text-danger text-center">Failed to load library.</p>`;
    }
};

// ===POST=== Form submission 
addBook.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const status = document.getElementById('status').value;

    try {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({title, author, status})
        });
        const data = await res.json();

        if (!res.ok) {    
            alert(data.error || (data.errors ? data.errors[0].msg: 'Failed to save the book'));
            return;
        }
        addBook.reset();

        // to close form modal if open
        const formModal = document.getElementById('addBookModal');
        if (formModal) {
            const modalInstance = bootstrap.Modal.getInstance(formModal);
            if (modalInstance) modalInstance.hide();
        }
        await fetchBooks(); // refresh catalog 
        renderBooks(cachedBooks);
    } catch (err) {
        console.error('Error adding book:', err);
    }
});

// ===PUT=== edit a book by id 
let currentEditId = null;
/// 1. open modal and populate book info
const openEditModal = (id) => {
    const book = cachedBooks.find(b => b.id === id);
    if (!book) return;

    const currentEditId = id;    // saves id for the submission

    document.getElementById('edit-title').value = book.title;
    document.getElementById('edit-author').value = book.author;
    document.getElementById('edit-status').value = book.status;

    const editModal = new bootstrap.Modal(document.getElementById('editBookModal'));
    editModal.show();
};
/// 2. submit corrected book data -auth
editBook.addEventListener('submit', async(e) => {
    e.preventDefault();
    if(!currentEditId) return;

    const updatedInfo = {
        title: document.getElementById('edit-title').value,
        author: document.getElementById('edit-author').value,
        status: document.getElementById('edit-status').value
    };
    try {
        const res = await fetch(`/api/book/${currentEditId}`,{
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedInfo)
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'Failed to update book details');
            return;
        }
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editBookModal'));
        if (editModal) editBook.hide();
        await fetchBooks();
        renderBooks(cachedBooks);
    } catch (err) {
        console.error('Error updating book:', err);
    }
});

// ===DELETE=== by id
const deleteBook = async (id) => {
    if (!confirm('Are you sure you want to delete this book?'))
        return;
    try {
        const res = await fetch(`/api/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}`}
        });
        if (res.ok) {
            alert('Book succesfully deleted');
            await fetchBooks();
            renderBooks(cachedBooks);
        } 
    } catch (err) {
        console.error('Error deleting book:', err);
    }
};

// =========================================
// UI logic
// =========================================

// dark/ligth mode toggler
themeToggleBtn.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    if (bodyElement.classList.contains('dark-mode')) {
        themeToggleBtn.innerText = '☀️ Light mode';
        themeToggleBtn.classList.replace('btn-outline-secondary', 'btn-outline-light');
    } else {
        themeToggleBtn.innerText = '🌙 Dark mode';
        themeToggleBtn.classList.replace('btn-outline-light', 'btn-outline-secondary');
    }
});

// render books into dom (to be displayed on demand)
const renderBooks = (books) => {
    bookList.innerHTML = ''; 
    if (!books || books.length === 0) {
        bookList.innerHTML = `
            <div class="text-center text-muted py-5 w-100">
                <p class="fs-4">No books found in your library. Add one to get started!</p>
            </div>
        `;
        return;
    } else books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4';
        const statusBadgeColor =
            book.status === 'Finished' ? 'text-success' :
            book.status === 'To read' ? 'text-warning' :
            book.status === 'Reading' ? 'text-primary' : 'bg-warning text-dark';
        card.innerHTML = `
            <div class="card h-100 shadow-sm border-0 p-3">
                <div class="card-body d-flex flex-wrap flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div class="flex-grow-1">
                        <span class=" ${statusBadgeColor} fw-medium fs-6">${book.status}</span>
                        <h4 class="card-title w-75 fw-bold mb-1 fs-4" title="${book.title}">
                            ${book.title}
                        </h4>
                        <p class="card-subtitle text-muted mb-0 fs-5">
                            by <span class="fw-medium text-dark">${book.author}</span>
                        </p>
                    </div>

                    <div class="ms-md-auto gap-2 d-flex align-items-center">
                    <button class="btn btn-outline-info" onclick="openEditModal('${book._id}')">
                            Edit
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteBook('${book._id}')">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            `;
            bookList.appendChild(card);
    });
};

// click logo to display whole book list
showBookList.addEventListener('click', () => {
    if (!getToken()) {
        bookList.innerHTML = `
            <div class="text-center text-muted py-5 w-100">
                <p class="fs-4">Please sign in to check your library!</p>
            </div>
        `;
        return;
    }
    if (cachedBooks.length > 0) {
        renderBooks(cachedBooks);
    } else {
        bookList.innerHTML = `
            <div class="text-center text-muted py-5">
                <p class="fs-4">No books found in your library. Add one to get started!</p>
            </div>
        `;
        return;
    }
});

// login action
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifier = document.getElementById('loginIdentifier').value.trim;
    const password = document.getElementById('loginPassword').value;

    await loginUser(identifier, password);

    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    
    loginForm.reset();
});

// register action
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signUpUsername').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;

    await registerUser(username, email, password);

    const registerModal = bootstrap.Modal.getInstance(document.getElementById('signUpModal'));
    if (registerModal) registerModal.hide();

    registerForm.reset();
});

if (getToken()) {
    fetchBooks();
} else {
    bookList.innerHTML = `
            <div class="text-center text-muted py-5 w-100">
                <p class="fs-4">Welcome, Buddy!</p>
            </div>
        `;
};