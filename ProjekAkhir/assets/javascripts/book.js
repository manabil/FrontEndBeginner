const books = [];
const SAVED_EVENT = 'saved-book';
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'CATALOG_APPS';

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('form');
  if (submitForm != null) {
    submitForm.addEventListener('submit', (event) => {
      event.preventDefault();
      addBook();
    });
  }
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

/**
 * Insert a book if no data loaded
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
   * Generate object of book
   * @param {number} id id book
   * @param {string} title Description of book title
   * @param {string} author Author of book
   * @param {number} year Year released of book
   * @param {boolean} isCompleted Is book have been readed or not
   * @return {void} Object of book
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
  const inputTitle = document.getElementById('inputJudul').value + '  ';
  const inputAuthor = document.getElementById('inputPenulis').value;
  const inputYear = document.getElementById('inputTahun').value;
  // eslint-disable-next-line max-len
  const inputIsComplete = document.querySelector('input[name="inputStatusBuku"]:checked').value === 'true' ? true : false;

  // eslint-disable-next-line max-len
  const bookObject = generateBookObject(generatedID, inputTitle, inputAuthor, inputYear, inputIsComplete);
  books.push(bookObject);

  toastNotification();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/**
 * Show book item list
 * @param {object} bookObject Object of generateBookObject
 * @return {HTMLCollection} Element of book list
 */
function manipulateBook(bookObject) {
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
   * Add a book item to completed list
   * @param {number} bookId Id of book
   */
  function readedBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    saveData();
  }

  /**
   * Remove a book item from object
   * @param {number} bookId Id of book
   */
  function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (!bookTarget) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  /**
   * Add book to uncompleted list
   * @param {number} bookId TodoId from unix timestamp
   */
  function undoBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  // ! BELUUUM SELESAI FUNCTION INI
  /**
   * Edit book item
   * @param {number} bookId TodoId from unix timestamp
   */
  function editBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    // pass
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  const bookTitle = document.createElement('h2');
  bookTitle.innerText = bookObject.title;

  const bookYear = document.createElement('p');
  bookYear.innerText = bookObject.year;
  bookYear.style.fontWeight = 900;
  bookYear.style.fontSize = '17px';
  bookYear.style.marginBottom = '15px';

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = bookObject.author;

  const bookInfo = document.createElement('div');
  bookInfo.classList.add('book-info');
  bookInfo.append(bookTitle, bookYear, bookAuthor);

  const bookAction = document.createElement('div');
  bookAction.classList.add('book-action');

  const container = document.createElement('div');
  container.classList.add('book-card');
  container.append(bookInfo);

  const iconReaded = document.createElement('i');
  iconReaded.classList.add('fa', 'fa-light', 'fa-book-open', 'fa-2xl');
  const iconUnreaded = document.createElement('i');
  iconUnreaded.classList.add('fa', 'fa-thin', 'fa-book', 'fa-2xl');
  const iconEdit = document.createElement('i');
  iconEdit.classList.add('fa', 'fa-regular', 'fa-pen-to-square', 'fa-2xl');
  const iconDelete = document.createElement('i');
  iconDelete.classList.add('fa', 'fa-regular', 'fa-trash', 'fa-2xl');
  const iconCheck = document.createElement('i');
  iconCheck.classList.add('fa', 'fa-light', 'fa-circle-check');

  const buttonEdit = document.createElement('button');
  buttonEdit.title = 'Edit Book';
  buttonEdit.append(iconEdit);
  const buttonDelete = document.createElement('button');
  buttonDelete.title = 'Delete Book';
  buttonDelete.append(iconDelete);

  buttonEdit.addEventListener('click', () => {
    editBook(bookObject.id);
  });
  buttonDelete.addEventListener('click', () => {
    removeBook(bookObject.id);
  });

  if (bookObject.isCompleted) {
    const readedCheck = document.createElement('span');
    readedCheck.style.color = 'green';
    readedCheck.append(iconCheck);
    bookTitle.append(readedCheck);

    const buttonUncompleted = document.createElement('button');
    buttonUncompleted.title = 'Uncomplete Read';
    buttonUncompleted.append(iconReaded);
    console.log(buttonUncompleted);

    buttonUncompleted.addEventListener('click', () => {
      undoBook(bookObject.id);
      console.log('event trigerred');
    });

    bookAction.append(buttonUncompleted, buttonEdit, buttonDelete);
    container.append(bookAction);
  } else {
    const buttonCompleted = document.createElement('button');
    buttonCompleted.title = 'Complete Read';
    buttonCompleted.append(iconUnreaded);

    buttonCompleted.addEventListener('click', () => {
      readedBook(bookObject.id);
    });

    bookAction.append(buttonCompleted, buttonEdit, buttonDelete);
    container.append(bookAction);
  }

  return container;
}

/**
 * save book to array of books
 */
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Check local storage support in your browser
 * @return {boolean} Return 1 if browser support and 0 if browser not support
 */
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Load local storage data
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

/**
 * Toast a notification
 * @param {string} text Information of notification
 */
function toastNotification(text = 'tambah') {
  if (text != 'tambah') {
    // eslint-disable-next-line max-len
    tata.success(`Buku telah berhasil di${text}`, '', {
      duration: 5000,
      animate: 'slide',
    });
  }
  // eslint-disable-next-line max-len
  tata.success(`Buku berhasil ditambah`, 'Klik disini untuk melihat katalog', {
    duration: 5000,
    animate: 'slide',
    onClick: () => {
      window.open('katalog.html');
    },
  });
}

document.addEventListener(RENDER_EVENT, () => {
  const bookList = document.getElementsByClassName('book-item')[0];
  bookList.innerHTML = '';

  if (books.length == 0) {
    const container = document.getElementsByClassName('book-item')[0];
    const text = document.createElement('h3');
    text.innerHTML = 'Isi buku terlebih dahulu ! </br> 📚📚📚';
    text.style.marginTop = '50px';
    text.style.textAlign = 'center';
    text.style.fontWeight = 'bold';
    text.style.color = '#263179';
    container.append(text);
  }

  for (const bookItem of books) {
    const bookElement = manipulateBook(bookItem);
    bookList.append(bookElement);
  }
  console.log('book rendered');
});

document.addEventListener(SAVED_EVENT, () => {
  // pass
});
