//
// DOM MANIPULATION
//
const bodyElement = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const showBookList = document.querySelector('.logo');
const bookList = document.querySelector('.bookList');
const addBook = document.getElementById('add-book-form');

let cachedBooks = [];

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

// fetch books from API (GET all and store them in cachedBooks)
const fetchBooks = async () => {
    try { 
        const res = await fetch('/api/books');
        const books = await res.json();
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
                        <h4 class="card-title text-truncate fw-bold mb-1 fs-4" title="${book.title}">
                            ${book.title}
                        </h4>
                        <p class="card-subtitle text-muted mb-0 fs-5">
                            by <span class="fw-medium text-dark">${book.author}</span>
                        </p>
                    </div>

                    <div class="ms-md-auto gap-2 d-flex align-items-center">
                    <button class="btn btn-outline-info" onclick="editBook('${book._id}')">
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

// click to display whole book list
showBookList.addEventListener('click', () => {
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

// Form submission (POST)
addBook.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const status = document.getElementById('status').value;

    try {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({title, author, status})
        });
        const data = await res.json();
        if (!res.ok) {    // displays any validaton or middleware error message
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

// DELETE 
const deleteBook = async (id) => {
    if (!confirm('Are you sure you want to delete this book?'))
        return;
    try {
        const res = await fetch(`/api/books/${id}`, {method: 'DELETE'});
        if (res.ok) {
            alert('Book succesfully deleted');
            await fetchBooks();
            renderBooks(cachedBooks);
        } 
    } catch (err) {
        console.error('Error deleting book:', err);
    }
};






fetchBooks();