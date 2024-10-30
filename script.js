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
    console.log(newBook);
    myLibrary.push(newBook);

    outputBox.appendChild(makeCard(book));
}

// Create a book Card

function makeCard(book) {
    const card = document.createElement("div");
    card.classList.add("card");
    layoutData(book, card);
    makeDeleteBtn(book, card);
    return card;
}

function makeDeleteBtn(book, card) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => {
        myLibrary.splice(myLibrary.indexOf(book), 1);
        card.remove();
    });
    card.appendChild(deleteBtn);
}

function layoutData(book, card) {
    for(let key in book) {
        const para = document.createElement("p");
        const label = document.createElement("span");
        label.textContent = key + ": ";
        
        const value = document.createElement("input");
        value.setAttribute("type", book[key][1]);
        if (value.type !== "checkbox") value.value = book[key][0];
        else value.checked = book[key][0];
        value.setAttribute("disabled", "disabled");
        value.classList.add("value");


        para.appendChild(label);
        para.appendChild(value);
        card.appendChild(para);
    }
}

// Make the dialog functional
openDialog.addEventListener("click", () => bookDialog.showModal());
bookDialog.addEventListener("close", () => {
    if(bookDialog.returnValue === "close") return;
    const book = {};

    [...values].forEach(elem => {
        const label = document.querySelector(`label[for=${elem.id}]`);
        book[label.textContent.replace(": ", "").toLowerCase()] = (
            [elem.type !== "checkbox" ? elem.type : elem.checked, elem.type]
        );
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
    if ([...values].some(elem => elem.value === "")) {
        alert("You must fill in all fields before sending the form");
        return;
    }
    bookDialog.close("send");
});
