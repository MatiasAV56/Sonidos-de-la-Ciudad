document.getElementById('menu-toggle').addEventListener('click', function() {
  document.getElementById('menu').classList.toggle('abierto');
  this.classList.toggle('abierto');
});
document.querySelectorAll('#menu a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('menu').classList.remove('abierto');
  });
});
