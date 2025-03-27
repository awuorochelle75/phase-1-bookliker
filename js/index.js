document.addEventListener("DOMContentLoaded", function() {

    const bookList = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");
    const currentUser = { id: 1, username: "pouros" }; // Mock user

    // Fetch and display books
    function fetchBooks() {
        fetch("http://localhost:3000/books")
            .then(response => response.json())
            .then(books => {
                console.log(books);
                bookList.innerHTML = "";
                books.forEach(book => renderBook(book));
            });
    }

    function renderBook(book) {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
    }

    function showBookDetails(book) {
        console.log(book);
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.img_url}" alt="${book.title}">
            <p>${book.description}</p>
            <h3>Liked by:</h3>
            <ul id="user-list">
                ${book.users.map(user => `<li>${user.username}</li>`).join("")}
            </ul>
            <button id="like-btn">${book.users.some(user => user.id === currentUser.id) ? "Unlike" : "Like"}</button>
        `;

        document.querySelector("#like-btn").addEventListener("click", () => toggleLike(book));
    }

    function toggleLike(book) {
        const isLiked = book.users.some(user => user.id === currentUser.id);
        const updatedUsers = isLiked
            ? book.users.filter(user => user.id !== currentUser.id) // Remove user
            : [...book.users, currentUser]; // Add user

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ users: updatedUsers })
        })
        .then(response => response.json())
        .then(updatedBook => showBookDetails(updatedBook));
    }

    fetchBooks();
});
