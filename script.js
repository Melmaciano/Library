// Selectors for dialog
const openDialog = document.querySelector("#new-book");
const bookDialog = document.querySelector("#book-dialog");
const dialogInputs = [...document.querySelectorAll("#book-dialog input")];
const outputBox = document.querySelector("output");
const confirmBtn = document.querySelector("#confirm-btn");
const cancelBtn = document.querySelector("#cancel-btn")

const myLibrary = [];

// Make book data

function Book({ author, title, pages, read }) {
    // Properties
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.id = "id-" + (Date.now() * Math.random());
    this.background = `rgb(${random()}, ${random()}, ${random()}, 0.9)`;
    // Make card
    this.makeCard = makeCard;
    // Delete card
    this.delete = deleteCard;
    // Edit card
    this.takeCardValuesToForm = takeCardValuesToForm;
    this.updateCard = updateCard;
    this.edit = editCard;
}

// Make card

let edit = false;
let currentBook;

function makeCard() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = this.id;
    card.style.background = this.background
    card.innerHTML = (`
        <div class="data-container">
            <div>
                <p>Author: </p>
                <p class="data-para" id="para-author">${this.author}</p>
            </div>
            <div>
                <p>Title: </p>
                <p class="data-para" id="para-title">${this.title}</p>
            </div>
            <div>
                <p>Pages: </p>
                <p class="data-para" id="para-pages">${this.pages}</p>
            </div>
            <div>
                <p>Read: </p>
                <p class="data-para" id="para-read">${this.read ? "read" : "unread"}</p>
            </div>
        </div>
        <div>
            <button class="delete-btn">DELETE</button>
            <button class="edit-btn">EDIT</button>
        </div>
    `);
    this.card = card;
    outputBox.appendChild(card);

    // Events
    const book = this;
    card.querySelector(".delete-btn").addEventListener("click", () => { book.delete() });
    card.querySelector(".edit-btn").addEventListener("click", () => {
        edit = !edit;
        currentBook = book;
        book.takeCardValuesToForm();
        bookDialog.showModal();
    })
}

// Delete card

function deleteCard() {
    this.card.style.transform = "scale(0)";
    setTimeout(() => {
        this.card.remove();
    }, 200);
};

// Edit card

function takeCardValuesToForm() {
    dialogInputs.forEach(input => {
        if (input.type === "checkbox") input.checked = this.read === "read" ? "true" : "false"; 
        else input.value = this[input.id];
    });
}

function editCard({ author, title, pages, read }) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.updateCard();
    edit = !edit;
    shakeCard(this.card);
};

function updateCard() {
    [...this.card.querySelectorAll(".data-para")].forEach((para) => {
        para.textContent = this[para.id.slice(5)];
    });
}

// Shake the form when is modified

function shakeCard(card) {
    card.style.animation = "shake-card 0.6s"
    setTimeout(() => {
        card.style.animation = "none";
    }, 600);
}

// Random

function random() {
    return Math.floor(Math.random() * 256);
}

// Empty the form

function emptyForm() {
    dialogInputs.forEach(inputField => inputField.type === "checkbox" ? 
        inputField.checked = false : 
        inputField.value = "");
}

// Dialog

function extractDialogInputs() {
    const book = {};
    dialogInputs.forEach(elem => {
        const label = document.querySelector(`label[for=${elem.id}]`);
        const cleanLabel = label.textContent.replace(": ", "").toLowerCase();
        const value = elem.type === "checkbox" ? elem.checked : elem.value;
        book[cleanLabel] = value;
    });
    return book;
}

openDialog.addEventListener("click", () => bookDialog.showModal());

bookDialog.addEventListener("close", () => {
    if (bookDialog.returnValue === "close") { emptyForm(); edit = !edit; return; };
    const book = extractDialogInputs();
    if (edit) currentBook.edit(book);
    else {
        const newBook = new Book(book);
        newBook.makeCard();
        myLibrary.push(newBook);    
    };
    emptyForm();
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bookDialog.close("close");
});

confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (dialogInputs.some(elem => elem.value === "")) {
        alert("It seems that you have not filled out all the fields or you are using incorrect values");
    }
    else bookDialog.close("send");
});

dialogInputs.forEach(elem => {
    elem.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { 
            e.preventDefault();

            if (dialogInputs.some(elem => elem.value === "")) {
                alert("It seems that you have not filled out all the fields or you are using incorrect values");
            } else {
                bookDialog.close("send");
            }
        }
    });
});
