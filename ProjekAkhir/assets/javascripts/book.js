const books = [];
const SAVED_EVENT = 'saved-book';
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'CATALOG_APPS';

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

/**
 * Add book item
 */
function addBook() {
  /**
   * Generate unix timestamp
   * @return {number} Timestamp in unix format
   */
  function generateId() {
    return +new Date();
  }

  /**
   * Generate object of task
   * @param {number} id id book
   * @param {string} title Description of book title
   * @param {string} author Author of book
   * @param {number} year Year released of book
   * @param {boolean} isCompleted Is book have been readed or not
   * @return {object} Object of generateBookObject
   */
  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  }
  const generatedID = generateId();
  const inputTitle = document.getElementById('inputJudul').value;
  const inputAuthor = document.getElementById('inputPenulis').value;
  const inputYear = document.getElementById('inputTahun').value;
  // eslint-disable-next-line max-len
  const inputIsComplete = document.querySelector('input[name="inputStatusBuku"]:checked').value === 'true' ? true : false;

  // eslint-disable-next-line max-len
  const bookObject = generateBookObject(generatedID, inputTitle, inputAuthor, inputYear, inputIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/**
 * Show book item list
 * @param {object} bookObject Object of generateBookObject
 * @return {HTMLCollection} Element of book list
 */
function makeBook(bookObject) {
  /**
   * Return an object if avaiable and return null
   * if object unavaiable
   * @param {number} bookId Unix timestamps of booklist
   * @return {object} Object of book item
   */
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  /**
   * Return an index if avaiable in book object and return -1
   * if index unavaiable in book object
   * @param {number} bookId Unix timestamps of booklist
   * @return {number} Index of bookId
   */
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return false;
  }

  /**
   * Return a book item to completed list
   * @param {number} bookId TodoId from unix timestamp
   */
  function addBookCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  /**
   * Remove a book item from object
   * @param {number} bookId TodoId from unix timestamp
   */
  function removeBookCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (!bookTarget) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  /**
   * Return a book item to uncompleted list again
   * @param {number} bookId TodoId from unix timestamp
   */
  function undoBookCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  const bookTitle = document.createElement('h2');
  bookTitle.innerText = bookObject.title;

  const bookYear = document.createElement('p');
  bookYear.innerText = bookObject.year;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = bookObject.author;

  const bookInfo = document.createElement('div');
  bookInfo.classList.add('book-info');
  bookInfo.append(bookTitle, bookYear, bookAuthor);

  const container = document.createElement('div');
  container.classList.add('book-card');
  container.append(bookInfo);

  const bookAction = document.createElement('div');
  bookAction.classList.add('book-action');

  if (bookObject.isCompleted) {
    // * SAMPEEEEE SINIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

    const buttonCompleted = document.createElement('button');
    buttonCompleted.title = 'Complete Read';

    buttonCompleted.classList.add('undo-button');
    buttonCompleted.addEventListener('click', () => {
      undoBookCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', () => {
      removeBookCompleted(bookObject.id);
    });

    container.append(buttonCompleted, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', () => {
      addBookCompleted(bookObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedTODOList = document.getElementById('books');
  uncompletedTODOList.innerHTML = '';

  const completedTODOList = document.getElementById('completed-books');
  completedTODOList.innerHTML = '';

  for (const todoItem of books) {
    const todoElement = makeBook(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

/**
 * pass
 */
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

/**
 * @return {boolean} jos
 */
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * pass
 */
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
