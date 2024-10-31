// Selectors for dialog
const openDialog = document.querySelector("#new-book");
const bookDialog = document.querySelector("#book-dialog");
const outputBox = document.querySelector("output");
const dialogValues = [...document.querySelectorAll("#book-dialog input")];
const confirmBtn = document.querySelector("#confirm-btn");
const cancelBtn = document.querySelector("#cancel-btn")

const myLibrary = [];

// Make book data

function Book({ author, title, pages, read, id }) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.id = id;
}

function addBookToLibrary(book) {
    const newBook = new Book(book);
    console.log(newBook);
    myLibrary.push(newBook);

    outputBox.appendChild(makeCard(book));
}

// Edit card

let currentBook;
let edit = false;

function editCard(card) {
    edit = !edit;
    currentBook = myLibrary.find(book => book.id === card.id);
    dialogValues.forEach(inputField => {
        inputField.type === "checkbox" ?
        inputField.checked = currentBook[inputField.id][0] :
        inputField.value = currentBook[inputField.id][0];
    })
    bookDialog.showModal();
}

function updateBook() {
    for (let key in currentBook) {
        if(key === "id") continue;
        else if (key === "read") currentBook[key][0] = bookDialog.querySelector(`#${key}`).checked;
        else currentBook[key][0] = bookDialog.querySelector(`#${key}`).value;
    }
    
    updateLayout();
}

function updateLayout() {
    const cardValues = [...document.querySelectorAll(`.card#${currentBook.id} .data-value`)];
    cardValues.forEach(dataValue => {
        const id = dataValue.id.slice(5); // It is not possible use the same id, so I use slice method to have the same id as book and dialog input
        if (dataValue.id === "card-read") { 
            dataValue.textContent = currentBook[id][0] === true ? "read" : "unread";
        } else {
            dataValue.textContent = currentBook[id][0];
        }
    });
}

// Create a book Card

function makeCard(book) {
    const card = document.createElement("div");
    const buttons = document.createElement("div");
    card.classList.add("card");
    layoutData(book, card);
    buttons.appendChild(makeDeleteBtn(book, card));
    buttons.appendChild(makeEditBtn(card))
    card.appendChild(buttons);

    return card;
}

function makeEditBtn(card) {
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "EDIT";
    editBtn.addEventListener("click", () => editCard(card));

    return editBtn;
}

function makeDeleteBtn(book, card) {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "DELETE";
    deleteBtn.addEventListener("click", () => {
        myLibrary.splice(myLibrary.indexOf(book), 1);
        card.style.transform = "scale(0)"
        setTimeout(() => {
            card.remove();
        }, 200);
    });
    return deleteBtn;
}

function layoutData(book, card) {
    for(let key in book) {
        if (key === "id") { card.setAttribute("id", book.id); continue }

        const para = document.createElement("p");
        const label = document.createElement("div");
        const value = document.createElement("div");
        para.classList.add("data-para");
        value.setAttribute("id", `card-${key}`);
        value.classList.add("data-value");     
        label.textContent = key[0].toUpperCase() + key.slice(1) + ": ";

        if (value.id !== "card-read") value.textContent = book[key][0];
        else value.textContent = book[key][0] === true ? "read" : "unread";

        para.appendChild(label);
        para.appendChild(value);
        card.appendChild(para);
    }
}

// Empty the form

function emptyForm() {
    dialogValues.forEach(inputField => inputField.type === "checkbox" ? 
        inputField.checked = false : 
        inputField.value = "");
}

// Make the dialog functional, add events
openDialog.addEventListener("click", () => bookDialog.showModal());

bookDialog.addEventListener("close", () => {
    const book = {};

    dialogValues.forEach(elem => {
        const label = document.querySelector(`label[for=${elem.id}]`);
        const cleanLabel = label.textContent.replace(": ", "").toLowerCase();
        const value = elem.type === "checkbox" ? elem.checked : elem.value;
        book[cleanLabel] = [value, elem.type];
    });

    if (edit && bookDialog.returnValue === "close") {       // Edit and close
        edit = !edit; 
    } else if (edit && bookDialog.returnValue === "send") { // Edit and send
        edit = !edit;                            
        book.id = currentBook.id;
        updateBook(book);
    } else if (bookDialog.returnValue === "send") {         // Make and send
        book.id = "id" + Date.now();
        addBookToLibrary(book);
    }

    emptyForm();                                            // When close without send, nothing happens
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bookDialog.close("close");
});

confirmBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    if (dialogValues.some(elem => elem.value === "")) {
        alert("It seems that you have not filled out all the fields or you are using incorrect values");
        return;
    }
    bookDialog.close("send");
});

dialogValues.forEach(elem => {
    elem.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { 
            e.preventDefault();

            if (dialogValues.some(elem => elem.value === "")) {
                alert("It seems that you have not filled out all the fields or you are using incorrect values");
            } else {
                bookDialog.close("send");
            }
        }
    });
});
