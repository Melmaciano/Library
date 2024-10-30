// Selectors for dialog
const openDialog = document.querySelector("#new-book");
const bookDialog = document.querySelector("#book-dialog");
const outputBox = document.querySelector("output");
const values = document.querySelectorAll("#book-dialog input");
const confirmBtn = document.querySelector("#confirm-btn");
const cancelBtn = document.querySelector("#cancel-btn")

const myLibrary = [];

function Book({ author, title, pages, read }) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(book) {
    const newBook = new Book(book);
    myLibrary.push(newBook);

    outputBox.appendChild(makeCard(book));
}

// Create a book Card

function makeCard(book) {
    const card = document.createElement("div");
    card.classList.add("card");

    for(let key in book) {
        const para = document.createElement("p");
        const label = document.createElement("span");
        const value = document.createElement("span");
        label.textContent = key + ": ";
        value.textContent = book[key];

        para.appendChild(label);
        para.appendChild(value);
        card.appendChild(para);
    }

    return card;
}

// Make the dialog functional
openDialog.addEventListener("click", () => bookDialog.showModal());
bookDialog.addEventListener("close", () => {
    if(bookDialog.returnValue === "close") return;
    const book = {};

    [...values].forEach(elem => {
        const label = document.querySelector(`label[for=${elem.id}]`);
        book[label.textContent.replace(": ", "").toLowerCase()] = elem.value;
    });

    // Send book information
    addBookToLibrary(book);
});
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bookDialog.close("close");
});
confirmBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    bookDialog.close();
});
