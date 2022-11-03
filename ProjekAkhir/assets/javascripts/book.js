document.getElementById('form').addEventListener('submit', () => {
  const judulBuku = document.getElementById('inputJudul').value;
  const penulisBuku = document.getElementById('inputPenulis').value;
  const tahunBuku = document.getElementById('inputTahun').value;
  localStorage.setItem('JOS', tahunBuku);
  console.log(judulBuku);
  console.log(penulisBuku);
  console.log(tahunBuku);
});

const jos = localStorage.getItem('JOS');
console.log(jos);
