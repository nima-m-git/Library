let myLibrary = [];

let body = document.querySelector('body');
let table = document.querySelector('table');

let id = 0;
const generateID = () => id++;


//          Book Constructor            \\
class Book {
    constructor(title, author, pages, read){
        this.title = title
        this.author = author
        this.pages = pages
        this.read = (read)? 'yes' : 'no';
        this.id = generateID();
    }
}

Book.prototype.info = function() {
    let haveRead = (this.read == 'true')? 'read' : 'not read yet';
    return this.title + ' by ' + this.author + ', ' + this.pages + ' pages long, ' + haveRead
}


//          Sample Books            \\
myLibrary.push(
    new Book('the cat in the hat', 'dr. suess', '23', true),
    new Book('the lorax', 'dr. suess', 36, true),
    new Book('green eggs and ham', 'dr. suess', '36', true),
    new Book('a brave new world', 'aldous huxley', '343', true),
    new Book('a clockwork orange', 'anthony burgess', '176', false),
    new Book('moby dick', 'herman melville', 585, false),
    new Book('python crash course', 'eric mattes', 652, true),
    new Book('Organic Chemistry', 'L.G wade jr', 1326, true),
    new Book('genetic analysis', 'griffiths et. al', 862, true),
    new Book('principles of biochemistry', 'lehninger', 1119, true),
    new Book('statistical thermodynamics and kinetics', 'thomas engel', 653, true),
    );


//           User Add Book           \\
function addBookToLibrary() {
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const pages = document.getElementById('pages');
    const read = document.getElementById('read');
    
    const checkField = (field) => {
        const valueMissing = field.validity.valueMissing;
        if (valueMissing) {
            field.setCustomValidity('fill out the field');
        } else {
            field.setCustomValidity('');
        }
        return !(valueMissing)
    }

    if ([title, author, pages].every((field) => checkField(field))) {
        myLibrary.push(new Book(title.value, author.value, pages.value, read.checked));
        updateLibrary();
        resetForm();
    }
}


function resetForm(){
    const formInputs = document.querySelectorAll('input');
    formInputs.forEach(input => input.value = '');
}


//         Create Table            \\
function generateTableHead() {
    const headers = Object.keys(myLibrary[0]);
    headers.push('Remove', 'Toggle');
    headers.splice(headers.indexOf('id'),1);

    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let header of headers) {
        let th = document.createElement('th');
        let text = document.createTextNode(header);
        th.appendChild(text);
        row.appendChild(th);   
    }

}

function generateTable() {
    for (book of myLibrary){
        let row = table.insertRow();
        for (let key in book) {
            if (book.hasOwnProperty(key) && key != 'id') {
                let cellText = document.createTextNode(book[key]);
                row.insertCell().appendChild(cellText);
            }
        }
        let removeButton = createButton(book, 'remove', 'Remove', removeBook);
        row.insertCell().appendChild(removeButton);

        let readButton = createButton(book, 'read', 'Read?', readBook);
        row.insertCell().appendChild(readButton);
    } 
}

function updateLibrary() {
    body.removeChild(table);
    newTable = document.createElement('table');
    body.appendChild(newTable);

    table = document.querySelector('table');

    generateTable();
    generateTableHead();
}

//          Initial         \\
for (book of myLibrary) {
    updateLibrary(book);
}

resetForm();


//           Buttons           \\

function getIndex(book){
    for (i=0; i<myLibrary.length; i++) {
        if (book.id == myLibrary[i].id){
            return i
        } 
    }
}

function createButton(book, className, text, func) {
    let button = document.createElement('button');
    let index = getIndex(book);
    button.value = index;
    button.classList = className;
    button.textContent = text;
    button.onclick = function() {func(index); };
    return button
}

function removeBook(index) {
    myLibrary.splice(index, 1);
    updateLibrary();
}

function readBook(index) {
    myLibrary[index].read = (myLibrary[index].read=='yes')? 'no' : 'yes';
    updateLibrary();
}








