let clicked = true
let nav = document.querySelector('.hamburger')
let button = document.querySelector('.menu')

button.addEventListener('click', () => {
    nav.classList.toggle('slided')
})

function toggler() {
    if (clicked) {
        clicked = false
        button.firstElementChild.style.transformOrigin = '0 0'
        button.firstElementChild.style.transform = 'rotate(45deg) translate(-1px, -6px)'
        button.lastElementChild.style.transformOrigin = '0 0'
        button.lastElementChild.style.transform = 'rotate(-45deg)'
        button.children[1].style.transform = 'scale(0)'
    } else {
        clicked = true
        button.firstElementChild.style.transformOrigin = '0 0'
        button.firstElementChild.style.transform = 'rotate(0)'
        button.lastElementChild.style.transformOrigin = '0 0'
        button.lastElementChild.style.transform = 'rotate(0)'
        button.children[1].style.transform = 'scale(1)'
    }
}

