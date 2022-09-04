const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let saveBookmarks = [];

// Show Modal, Focus on Input
const showModal =()=> {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Hide Modal
const hideModal = () => {
  modal.classList.remove('show-modal')
}

// Retrieving bookmarks from localStorage

const fetchBookmarks = () => {
  if(localStorage.getItem('bookmarks')) {
    saveBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } 
  // After fetching
  createBookmarkDom();
}
// Delete bookmark, update the localStorage and re-populate the dom
const deleteBookmark = (url) => {
  saveBookmarks.forEach((bookmark, index) => {
    if(bookmark.url === url) {
      saveBookmarks.splice(index, 1);
    }
  })
  localStorage.setItem('bookmarks', JSON.stringify(saveBookmarks));
  fetchBookmarks();
}
// Create bookmarks DOM
const createBookmarkDom = () => {
  bookmarksContainer.textContent = '';
  saveBookmarks.forEach(bookmark => {
    const { name, url } = bookmark;
    // setting up element with bookmark data
    const item = document.createElement('div');
    item.classList.add('item');
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    closeIcon.textContent = 'X'
    const favIcon = document.createElement('img');
    favIcon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favIcon.setAttribute('alt', '');
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    const link = document.createElement('a')
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    // appending children
    linkInfo.append(favIcon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  })
}
// Validate Form
const validate = (name, url) => {
  const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if(!name || !url) {
    alert('Please submit value for both fields.')
    return;
  }
  if(!url.match(regex)) {
    alert('Please provide a valid web address');
    return;
  }
  return true;
}

// Handle data from form
const storeBookmark = event => {
  event.preventDefault();
  const name = websiteNameEl.value;
  let url = websiteUrlEl.value;
  if(!url.includes('http://', 'https://')) {
    url = `https://${url}`
  }
  validate(name, url)
  const bookmark = {
    name,
    url,
  }
  saveBookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(saveBookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', hideModal)
window.addEventListener('click', (event) => event.target === modal? hideModal() : false );

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();
