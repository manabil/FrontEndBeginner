document.getElementById("form").addEventListener("submit", () => {
  let judulBuku = document.getElementById("inputJudul").value;
  let penulisBuku = document.getElementById("inputPenulis").value;
  let tahunBuku = document.getElementById("inputTahun").value;
  localStorage.setItem("JOS", tahunBuku);
  console.log(judulBuku);
  console.log(penulisBuku);
  console.log(tahunBuku);
});

let jos = localStorage.getItem("JOS");
console.log(jos);
