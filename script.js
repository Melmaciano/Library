const openDialog = document.querySelector("#new-book");
const bookDialog = document.querySelector("#book-dialog");
const outputBox = document.querySelector("output");
const values = document.querySelectorAll("#book-dialog input");
const confirmBtn = document.querySelector("#confirm-btn");
const cancelBtn = document.querySelector("#cancel-btn")

openDialog.addEventListener("click", () => bookDialog.showModal());
bookDialog.addEventListener("close", () => {
    if(bookDialog.returnValue === "close") return;

    outputBox.value = [...values].reduce((acc, elem) => {
        const label = document.querySelector(`label[for=${elem.id}]`);
        return `${acc === "" ? "" : acc + "; "}${label.textContent} ${elem.value}`;
    }, "");
});
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bookDialog.close("close");
});
confirmBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    bookDialog.close();
});

// const myLibrary = [];

// function Book(author, title, pages, read) {
//     this.author;
//     this.title;
//     this.pages;
//     this.read;
// }
