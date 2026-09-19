//
// DOM MANIPULATION
//
const bodyElement = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const showBookList = document.querySelector('.logo');
const bookList = document.querySelector('.bookList');

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

let cachedBooks = [];

// fetch books
const fetchBooks = async () => {
    try {
        const res = await fetch('/api/books');
        const books = await res.json();
        if (books.length === 0) {
            console.log('No books added to database yet!');
        } else {
            console.log('Books from DB:', books);
            cachedBooks = books;
        }
    } catch (err) {
        console.log("Error fetching books:", err);
    }
};

// render books into dom (not yet displayed)
const renderBooks = (books) => {
    bookList.innerHTML = ''; 
    
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'w-100';
        const statusBadgeColor =
            book.status === 'Finished' ? 'text-success' :
            book.status === 'To read' ? 'text-warning' :
            book.status === 'Reading' ? 'text-primary' : 'bg-warning text-dark';
        card.innerHTML = `
            <div class="card h-100 shadow-sm border-5">
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex flex-column justify-content-between align-items-start mb-3">
                        <span class=" ${statusBadgeColor} fw-light fs-6">${book.status}</span>
                        <h4 class="card-title fw-bold me-2 mb-0 fs-4" title="${book.title}">
                            ${book.title}
                        </h4>
                    </div>
                    
                    <h5 class="card-subtitle mb-4 text-muted fs-5">
                        <i class="bi bi-person"></i> ${book.author}
                    </h5>

                    <div class="mt-auto pt-3 border-top d-flex justify-content-between">
                    <button class="btn btn-outline-info btn-md px-3" onclick="editBook('${book._id}')">
                            Edit
                        </button>
                        <button class="btn btn-outline-danger btn-md px-3" onclick="deleteBook('${book._id}')">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            `;
            bookList.appendChild(card);
    });
};

// click to display book list 
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

// Handle form submission (POST)










fetchBooks();