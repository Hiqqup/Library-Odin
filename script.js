var library;
const domElements = {
    addButton : document.querySelector("#add-book-button"),
    bookForm : document.querySelector(".book-form"),
    container: document.querySelector("#books"),
    displayBook: function(book){
        var bookHtml = "";
        var defaultImage = true;
        bookHtml+=`<div id="${book.id}" class="book-container">`;;
        bookHtml+= `<h3 class="title">${book.title}</h3>`;
        bookHtml+= book.author? `<p class="author">by <b>${book.author}</b></p>`: "";
        bookHtml+= book.pages? `<p class="pages">with <b>${book.pages}</b> pages</p>`: "";
        bookHtml += `<p>Read: <input type="checkbox" onchange="library['${book.id}'].read = this.checked; storeChange()"`+ (book.read?" checked " : "")+ "></p>"
        if(book.uploadedCover|| book.cover.type && book.cover.type.split("/")[0] === "image"){
            book.uploadedCover = true;
            storeChange();
        }else{
            bookHtml+=`<svg class="default-preview" xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#000000"><path d="M229-59q-35.78 0-63.39-26.91Q138-112.83 138-150v-660q0-37.59 27.61-64.79Q193.22-902 229-902h502q36.19 0 64.09 27.21Q823-847.59 823-810v660q0 37.17-27.91 64.09Q767.19-59 731-59H229Zm0-91h502v-660h-50v266l-97-56-97 56v-266H229v660Zm0 0v-660 660Zm258-394 97-56 97 56-97-56-97 56Z"/></svg>`
        
        } 
        bookHtml += `<button onclick="deleteBook('${book.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></button>`
        bookHtml += `</div>`
        this.container.innerHTML+= bookHtml;

        if(book.uploadedCover){
            const bookContainer = document.getElementById( book.id);
            const image = document.createElement("img");
            image.height  =  100;
            if(book.cover.toString() == "[object Object]"){
                image.src = localStorage.getItem(book.id)
            }
            else{
                const fileReader = new FileReader();
                fileReader.readAsDataURL(book.cover);
                fileReader.addEventListener("load", function () {
                    image.src =this.result;
                    localStorage.setItem(book.id, this.result);
                });  
            }
            bookContainer.appendChild(image);
        }
    },
    addButtonFunctionality : function(){
        this.addButton.addEventListener("click" ,()=>{
            if(this.bookForm.hidden){
                this.bookForm.hidden = false;
            }
            else{        
                if (this.bookForm.checkValidity()){
                    const bookId = addBook( new FormData(this.bookForm));
                    this.displayBook(library[bookId]);
                    this.bookForm.reset();
                    this.bookForm.hidden = true;
                }
                else{
                    this.bookForm.reportValidity();
                }
            }
        });
    },
    handle : function(){
        this.addButtonFunctionality();
        library = JSON.parse(localStorage.getItem("library")) ?? {};
        for(const book in library){
            this.displayBook(library[book]);
        }
    }
};
domElements.handle();


function storeChange(){
    localStorage.setItem("library", JSON.stringify(library));
}
function Book(bookData){
    for(const pair  of bookData.entries()){
        this[pair[0]] = pair[1];
    }
    this.read = false;
    this.uploadedCover = false;
    this.id = crypto.randomUUID();
    this.info = function(){
        const readOrNot = this.read ? "read" : "not read"
        return this.title + " by " + this.author + ", " + this.pages + ", " + readOrNot + "."
    }
};
function addBook(bookData){
    const book = new Book(bookData);
    library[book.id] = book;
    storeChange();
    return book.id;
}
function deleteBook(bookId){
    delete library[bookId];
    document.getElementById(bookId).remove();
    localStorage.removeItem(bookId);
    storeChange();
}