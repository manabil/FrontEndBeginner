let clicked = true;
const hamburger = document.querySelector('.hamburger');
const button = document.querySelector('.menu');
const nav = document.querySelector('nav');
let initialScroll = window.scroll;

button.addEventListener('click', () => {
  hamburger.classList.toggle('slided');
  if (clicked) {
    clicked = false;
    button.firstElementChild.style.transformOrigin = '0 0';
    // eslint-disable-next-line max-len
    button.firstElementChild.style.transform = 'rotate(45deg) translate(-1px, -6px)';
    button.lastElementChild.style.transformOrigin = '0 0';
    button.lastElementChild.style.transform = 'rotate(-45deg)';
    button.children[1].style.transform = 'scale(0)';
  } else {
    clicked = true;
    button.firstElementChild.style.transformOrigin = '0 0';
    button.firstElementChild.style.transform = 'rotate(0)';
    button.lastElementChild.style.transformOrigin = '0 0';
    button.lastElementChild.style.transform = 'rotate(0)';
    button.children[1].style.transform = 'scale(1)';
  }
});

/**
 * Hide/show a navbar list in mobile
 */
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (initialScroll > currentScroll) {
    nav.style.top = '0';
  } else {
    nav.style.top = '-70px';
  }
  initialScroll = currentScroll;
});
