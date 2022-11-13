const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'CATALOG_APPS';
let isSorted = false;

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('form');
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  if (submitForm != null) {
    const params = new URLSearchParams(document.location.search);
    if (params.has('book')) {
      getBook(parseInt(params.get('book')));
      submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        editBook(parseInt(params.get('book')));
      });
    } else {
      submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
      });
    }
  }
});

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
 * Edit book
 * @param {number} bookId Id of book
 */
function editBook(bookId) {
  const inputTitle = document.getElementById('inputJudul').value;
  const inputAuthor = document.getElementById('inputPenulis').value;
  const inputYear = document.getElementById('inputTahun').value;
  // eslint-disable-next-line max-len
  const inputIsComplete = document.querySelector('input[name="inputStatusBuku"]:checked').value === 'true' ? true : false;

  const bookIdx = findBookIndex(bookId);
  books[bookIdx].title = inputTitle + ' ';
  books[bookIdx].author = inputAuthor;
  books[bookIdx].year = inputYear;
  books[bookIdx].isCompleted = inputIsComplete;

  Swal.fire({
    title: 'Apakah anda yakin mengubah buku ini ?',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    icon: 'warning',
  }).then((result) => {
    if (result.isConfirmed) {
      toastNotification('edit');
      saveData();
    }
  });
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
   * Add a book item to completed list
   * @param {number} bookId Id of book
   */
  function readedBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
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

  const bookTitle = document.createElement('h2');
  const bookYear = document.createElement('p');
  const bookAuthor = document.createElement('p');

  bookTitle.innerText = bookObject.title;
  bookAuthor.innerText = bookObject.author;
  bookYear.innerText = bookObject.year;
  bookYear.style.fontWeight = 900;
  bookYear.style.fontSize = '17px';
  bookYear.style.marginBottom = '15px';

  const bookInfo = document.createElement('div');
  const bookAction = document.createElement('div');
  bookInfo.classList.add('book-info');
  bookAction.classList.add('book-action');
  bookInfo.append(bookTitle, bookYear, bookAuthor);

  const container = document.createElement('div');
  container.classList.add('book-card');
  container.append(bookInfo);

  const iconReaded = document.createElement('i');
  const iconUnreaded = document.createElement('i');
  const iconEdit = document.createElement('i');
  const iconDelete = document.createElement('i');
  const iconCheck = document.createElement('i');

  iconReaded.classList.add('fa', 'fa-light', 'fa-book-open', 'fa-2xl');
  iconUnreaded.classList.add('fa', 'fa-thin', 'fa-book', 'fa-2xl');
  iconEdit.classList.add('fa', 'fa-regular', 'fa-pen-to-square', 'fa-2xl');
  iconDelete.classList.add('fa', 'fa-regular', 'fa-trash', 'fa-2xl');
  iconCheck.classList.add('fa', 'fa-light', 'fa-circle-check');

  const buttonEdit = document.createElement('button');
  const buttonDelete = document.createElement('button');

  buttonEdit.title = 'Edit Book';
  buttonDelete.title = 'Delete Book';

  buttonEdit.append(iconEdit);
  buttonDelete.append(iconDelete);

  buttonEdit.addEventListener('click', () => {
    window.open(`tambah.html?book=${bookObject.id}`, '_parent');
  });

  buttonDelete.addEventListener('click', () => {
    Swal.fire({
      title: 'Apakah anda ingin menghapus buku ini ?',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        toastNotification('hapus', bookObject);
        removeBook(bookObject.id);
      }
    });
  });

  if (bookObject.isCompleted) {
    const readedCheck = document.createElement('span');
    const buttonUncompleted = document.createElement('button');
    readedCheck.style.color = 'green';
    buttonUncompleted.title = 'Uncomplete Read';

    readedCheck.append(iconCheck);
    bookTitle.append(readedCheck);
    buttonUncompleted.append(iconUnreaded);

    buttonUncompleted.addEventListener('click', () => {
      undoBook(bookObject.id);
      toastNotification('ubah', bookObject);
    });

    bookAction.append(buttonUncompleted, buttonEdit, buttonDelete);
    container.append(bookAction);
  } else {
    const buttonCompleted = document.createElement('button');
    buttonCompleted.title = 'Complete Read';
    buttonCompleted.append(iconReaded);

    buttonCompleted.addEventListener('click', () => {
      readedBook(bookObject.id);
      toastNotification('ubah', bookObject);
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
 * @param {string} buku Object of book
 */
function toastNotification(text, buku) {
  if (text == 'hapus') {
    // eslint-disable-next-line max-len
    tata.success(`Buku telah berhasil dihapus`, `Buku "${buku.title}" telah dihapus`, {
      duration: 5000,
      animate: 'slide',
    });
  } else if (text == 'ubah') {
    // eslint-disable-next-line max-len
    if (buku.isCompleted) {
      tata.success(`Buku sudah dibaca`, `Buku "${buku.title}" telah dibaca`, {
        duration: 5000,
        animate: 'slide',
      });
    } else {
      tata.warn(`Buku belum dibaca`, `Buku "${buku.title}" belum dibaca`, {
        duration: 5000,
        animate: 'slide',
      });
    }
  } else if (text == 'edit') {
    // eslint-disable-next-line max-len
    tata.success(`Buku berhasil diubah`, 'Klik disini untuk melihat katalog', {
      duration: 5000,
      animate: 'slide',
      onClick: () => {
        window.open('katalog.html');
      },
    });
  } else {
    // eslint-disable-next-line max-len
    tata.success(`Buku berhasil ditambah`, 'Klik disini untuk melihat katalog', {
      duration: 5000,
      animate: 'slide',
      onClick: () => {
        window.open('katalog.html');
      },
    });
  }
}

/**
 * jos
 */
function searchBook() {
  // eslint-disable-next-line max-len
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const container = document.getElementsByClassName('book-item')[0];
  container.innerHTML = '';

  if (searchInput == '') {
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
  }
  let isAny = 0;
  for (const book of books) {
    // eslint-disable-next-line max-len
    if (book.title.toLowerCase().includes(searchInput) || book.year.toLowerCase().includes(searchInput) || book.author.toLowerCase().includes(searchInput)) {
      if (book.isCompleted) {
        isAny += 1;
        const bookItem = manipulateBook(book);
        container.append(bookItem);
      } else {
        isAny += 1;
        const bookItem = manipulateBook(book);
        container.append(bookItem);
      }
    }
  }
  if (!isAny) {
    const text = document.createElement('h3');
    text.innerHTML = 'Tidak ditemukan buku ! </br> ❌';
    text.style.marginTop = '50px';
    text.style.textAlign = 'center';
    text.style.fontWeight = 'bold';
    text.style.color = 'red';
    container.append(text);
    isAny = false;
  }
}

/**
 * Get book and insert value to edit book
 * @param {number} bookId Id of book
 */
function getBook(bookId) {
  const submitButton = document.getElementsByName('saveButton')[0];
  const inputJudul = document.getElementById('inputJudul');
  const inputPenulis = document.getElementById('inputPenulis');
  const inputTahun = document.getElementById('inputTahun');

  const bookIdx = findBookIndex(bookId);
  const judul = books[bookIdx].title;
  const penulis = books[bookIdx].author;
  const tahun = books[bookIdx].year;
  const isCompleted = books[bookIdx].isCompleted;

  inputJudul.value = judul;
  inputPenulis.value = penulis;
  inputTahun.value = tahun;
  if (isCompleted) {
    document.getElementById('inputComplete').checked = true;
  } else {
    document.getElementById('inputUncomplete').checked = true;
  }

  submitButton.value = 'Edit Buku';
}

/**
 * pass
 */
function groupBook() {
  const groupButton = document.getElementById('group-button');
  if (isSorted) {
    groupButton.style.backgroundColor = 'white';
    groupButton.style.color = 'black';
    isSorted = false;
  } else {
    groupButton.style.backgroundColor = '#4154f1';
    groupButton.style.color = 'white';
    isSorted = true;
  }
}

document.getElementById('group-button').addEventListener('click', (event) => {
  event.preventDefault();
  groupBook();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.getElementById('searchInput').addEventListener('keyup', (event) => {
  event.preventDefault();
  searchBook();
});

document.getElementById('searchSubmit').addEventListener('submit', (event) => {
  event.preventDefault();
  searchBook();
});

document.addEventListener(RENDER_EVENT, () => {
  const bookList = document.getElementsByClassName('book-item')[0];
  const bookAll = document.getElementsByClassName('book-all')[0];
  const bookComplete = document.getElementsByClassName('book-complete')[0];
  const bookUncomplete = document.getElementsByClassName('book-uncomplete')[0];
  // eslint-disable-next-line max-len
  const bookCompleteList = document.getElementsByClassName('book-complete-item')[0];
  // eslint-disable-next-line max-len
  const bookUncompleteList = document.getElementsByClassName('book-uncomplete-item')[0];

  bookList.innerHTML = '';
  bookCompleteList.innerHTML = '';
  bookUncompleteList.innerHTML = '';

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

  if (isSorted) {
    bookComplete.style.display = 'block';
    bookUncomplete.style.display = 'block';
    bookAll.style.display = 'none';
    for (const bookItem of books) {
      const bookElement = manipulateBook(bookItem);
      if (bookItem.isCompleted) {
        bookCompleteList.append(bookElement);
      } else {
        bookUncompleteList.append(bookElement);
      }
    }
  } else {
    bookComplete.style.display = 'none';
    bookUncomplete.style.display = 'none';
    bookAll.style.display = 'block';
    for (const bookItem of books) {
      const bookElement = manipulateBook(bookItem);
      bookList.append(bookElement);
    }
  }
});
