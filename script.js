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
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.id = "id-" + (Date.now() * Math.random());
    this.background = `rgb(${random()}, ${random()}, ${random()}, 0.9)`;
    this.makeCard = makeCard;
    this.card = this.makeCard(this);
    this.delete = function() {
        this.card.style.transform = "scale(0)";
        setTimeout(() => {
            this.card.remove();
        }, 200);
    };
    this.takeCardValuesToForm = takeCardValuesToForm;
    this.edit = function({ author, title, pages, read }) {
        this.takeCardValuesToForm();
        this.author = author;
        this.title = title;
        this.pages = pages;
        this.read = read;
        this.card.remove();
        this.card = this.makeCard(this);
        edit = !edit;
        shakeCard(this.card);
    };
}

// Edit card

function takeCardValuesToForm() {
    dialogInputs.forEach(input => {
        if (input.type === "checkbox") input.checked = this.read === "read" ? "true" : "false"; 
        else input.value = this[input.id];
    });
}

// Shake the form when is modified

function shakeCard(card) {
    card.style.animation = "shake-card 0.6s"
    setTimeout(() => {
        card.style.animation = "none";
    }, 600);
}

// Make card

let edit = false;
let currentBook;

function makeCard(book) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = this.id;
    card.style.background = this.background
    card.innerHTML = (`
        <div class="data-container">
            <div class="data-para">
                <p>Author: </p>
                <p>${this.author}</p>
            </div>
            <div class="data-para">
                <p>Title: </p>
                <p>${this.title}</p>
            </div>
            <div class="data-para">
                <p>Pages: </p>
                <p>${this.pages}</p>
            </div>
            <div class="data-para">
                <p>Read: </p>
                <p>${this.read ? "read" : "unread"}</p>
            </div>
        </div>
        <div>
            <button class="delete-btn">DELETE</button>
            <button class="edit-btn">EDIT</button>
        </div>
    `);
    outputBox.appendChild(card);
    card.querySelector(".delete-btn").addEventListener("click", () => { book.delete() });
    card.querySelector(".edit-btn").addEventListener("click", () => {
        edit = !edit;
        currentBook = book;
        bookDialog.showModal();
    })
    return card;
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
    console.log(book)
    return book;
}

openDialog.addEventListener("click", () => bookDialog.showModal());

bookDialog.addEventListener("close", () => {
    if (bookDialog.returnValue === "close") return;
    const book = extractDialogInputs();
    if (edit) currentBook.edit(book);
    else myLibrary.push(new Book(book));
    emptyForm();
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bookDialog.close("close");
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
