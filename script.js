function Book(title, author, numPages){
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.read = false;
    this.info = function(){
        const readOrNot = this.read ? "read" : "not read"
        return this.title + " by " + this.author + ", " + this.numPages + ", " + readOrNot + "."
    }
};

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien" , 295);

console.log(theHobbit.info());