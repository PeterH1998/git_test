const myLibrary = [];

function Book(title, author, pages, read){
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read

    this.info = function() {
        return (this.title + " by " + this.author + ", " + this.pages + ", " + this.read)
    
    }
}

Book.prototype.toggleRead = function() {
    this.read = this.read? false: true;
}

function addBookToLibrary(title, author, pages, read) {
    const book  = new Book(title,author,pages,read);
    myLibrary.push(book)
}

function displayArray(){
    const tableBody = document.getElementById("tableBody")
    tableBody.innerHTML = ""
    for(let i=0; i< myLibrary.length; i++){
        //console.log(myLibrary[i].title)
        const row = document.createElement("tr");

        row.dataset.id = myLibrary[i].id;

        const titleCell = document.createElement("td");
        titleCell.textContent = myLibrary[i].title;
        row.appendChild(titleCell);
        
        const authorCell = document.createElement("td");
        authorCell.textContent = myLibrary[i].author;
        row.appendChild(authorCell);
        
        const pagesCell = document.createElement("td");
        pagesCell.textContent = myLibrary[i].pages;
        row.appendChild(pagesCell);
        
        const readCell = document.createElement("td");
        readCell.textContent = myLibrary[i].read === true? "Read": "Not Read";
        row.appendChild(readCell);

        const deleteCell = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "Delete Book";

        deleteCell.appendChild(btn);
        row.appendChild(deleteCell);

        btn.addEventListener("click", () => {
            const bookId = row.dataset.id;

            const index = myLibrary.findIndex( i => i.id === bookId)
            myLibrary.splice(index,1);
            displayArray();
        })

        const editCell = document.createElement("td");
        const btn2 = document.createElement("button");
        btn2.textContent = "Edit Read";

        editCell.appendChild(btn2);
        row.appendChild(editCell);

        btn2.addEventListener("click", () => {
            const bookId = row.dataset.id;

            const index = myLibrary.findIndex( i => i.id === bookId)            
            myLibrary[index].toggleRead();
            displayArray();
        })


        
        tableBody.appendChild(row);

    }
}


const newBookBtn = document.getElementById("newBookBtn");
const form = document.getElementById("bookForm");
const library = document.getElementById("library")


newBookBtn.addEventListener("click", () => {
  form.style.display = form.style.display === "none" ? "block" : "none";
});

form.addEventListener("submit", () => {

    event.preventDefault();


    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let pages = document.getElementById("pages").value;
    let read = document.getElementById("read").checked;
    

    addBookToLibrary(title, author, pages, read);
    displayArray();

    form.reset();
    form.style.display = "none";
})

addBookToLibrary("Dune", "Frank Herbert", 412, true);
displayArray();
