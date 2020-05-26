const library = (function() {
    const getLibrary = () => Object.values(localStorage).map(book => JSON.parse(book));
    const getSortedLibrary = () => library.getLibrary().sort((a, b) => (a.id > b.id)? 1 : -1);
    const getBook = (bookID) => JSON.parse(localStorage.getItem(bookID));
    const addBook = (newBook) => localStorage.setItem(newBook.id, JSON.stringify(newBook));
    const removeBook = (ID) => {
        localStorage.removeItem(ID)
        updateLibraryTable();
    }
    const readBook = (ID) => {
        const book = getBook(ID);
        book.read = (book.read == "yes") ? "no" : "yes";
        library.addBook(book)
        updateLibraryTable();
    }

    return {
        getLibrary,
        getSortedLibrary,
        getBook,
        addBook,
        removeBook,
        readBook,
    }
})();


//          Book Constructor            \\
const generateID = (function () {
    let id = 0;
    function newID() {
        return id++;
    }
    return {newID}
})();


class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read ? "yes" : "no";
    this.id = generateID.newID();
  }
}

Book.prototype.info = function () {
  let haveRead = this.read == "true" ? "read" : "not read yet";
  return (this.title + " by " + this.author + ", " + this.pages + " pages long, " + haveRead)
};

//          Sample Books            \\
const sampleBooks = [
  new Book("the cat in the hat", "dr. suess", "23", true),
  new Book("the lorax", "dr. suess", 36, true),
  new Book("green eggs and ham", "dr. suess", "36", true),
  new Book("a brave new world", "aldous huxley", "343", true),
  new Book("a clockwork orange", "anthony burgess", "176", false),
  new Book("moby dick", "herman melville", 585, false),
  new Book("python crash course", "eric mattes", 652, true),
  new Book("Organic Chemistry", "L.G wade jr", 1326, true),
  new Book("genetic analysis", "griffiths et. al", 862, true),
  new Book("principles of biochemistry", "lehninger", 1119, true),
  new Book("statistical thermodynamics and kinetics", "thomas engel", 653, true)
];
sampleBooks.map(book => library.addBook(book));


//           User Add Book           \\
document.getElementById('add-new-book').addEventListener('click', function() {
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const pages = document.getElementById("pages");
    const read = document.getElementById("read");
    const checkField = (field) => {
      const valueMissing = field.validity.valueMissing;
      if (valueMissing) {
        field.setCustomValidity("fill out the field");
      } else {
        field.setCustomValidity("");
      }
      return !valueMissing;
    };
  
    // form validation
    if ([title, author, pages].every((field) => checkField(field))) {
      const newBook = new Book(title.value, author.value, pages.value, read.checked);
      library.addBook(newBook);
      updateLibraryTable();
      resetForm();
    }
})

function resetForm() {
  const formInputs = document.querySelectorAll("input");
  formInputs.forEach((input) => (input.value = ""));
}

//         Create Table            \\
let table = document.querySelector("table");

function generateTableHead() {
  const headers = Object.keys(library.getLibrary()[0]);
  headers.push("Remove", "Toggle");
  headers.splice(headers.indexOf("id"), 1);

  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let header of headers) {
    let th = document.createElement("th");
    let text = document.createTextNode(header);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable() {
  for (book of library.getSortedLibrary()) {
    let row = table.insertRow();
    for (let key in book) {
      if (book.hasOwnProperty(key) && key != "id") {
        let cellText = document.createTextNode(book[key]);
        row.insertCell().appendChild(cellText);
      }
    }
    let removeButton = createButton(book, "remove", "Remove", library.removeBook);
    row.insertCell().appendChild(removeButton);

    let readButton = createButton(book, "read", "Read?", library.readBook);
    row.insertCell().appendChild(readButton);
  }
}

function updateLibraryTable() {
  const body = document.querySelector("body");
  body.removeChild(table);
  table = document.createElement("table"); // remove redeclaration?
  body.appendChild(table);

  generateTable();
  generateTableHead();
}

//          Initial         \\
for (book of library.getSortedLibrary()) {
  updateLibraryTable(book);
}
resetForm();

//           Buttons           \\
// Obsolete? ID used now
function getIndex(book) {
  for (i = 0; i < library.getLibrary().length; i++) {
    if (book.id == library.getLibrary()[i].id) {
      return i;
    }
  }
}

function createButton(book, className, text, func) {
  let button = document.createElement("button");
//   button.value = index;
  button.classList = className;
  button.textContent = text;
  button.onclick = function () {
    func(book.id);
  };
  return button;
}



