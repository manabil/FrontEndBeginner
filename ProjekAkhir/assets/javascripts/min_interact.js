let clicked=!0;const hamburger=document.querySelector(".hamburger"),button=document.querySelector(".menu"),nav=document.querySelector("nav");let initialScroll=window.scroll;button.addEventListener("click",()=>{hamburger.classList.toggle("slided"),clicked?(clicked=!1,button.firstElementChild.style.transformOrigin="0 0",button.firstElementChild.style.transform="rotate(45deg) translate(-1px, -6px)",button.lastElementChild.style.transformOrigin="0 0",button.lastElementChild.style.transform="rotate(-45deg)",button.children[1].style.transform="scale(0)"):(clicked=!0,button.firstElementChild.style.transformOrigin="0 0",button.firstElementChild.style.transform="rotate(0)",button.lastElementChild.style.transformOrigin="0 0",button.lastElementChild.style.transform="rotate(0)",button.children[1].style.transform="scale(1)")}),window.addEventListener("scroll",()=>{let t=window.pageYOffset;initialScroll>t?nav.style.top="0":nav.style.top="-70px",initialScroll=t});