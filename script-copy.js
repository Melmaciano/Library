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
