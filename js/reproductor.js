(function () {
  var audio = new Audio();
  var player = document.getElementById('reproductor');
  if (!player) return;

  var playBtn = document.getElementById('rep-play');
  var stopBtn = document.getElementById('rep-stop');
  var volumeSlider = document.getElementById('rep-vol');
  var timeDisplay = document.getElementById('rep-tiempo');

  var mp3 = 'audio/The Warning - S!ck.mp3';
  audio.src = mp3;
  audio.preload = 'auto';

  var saved = sessionStorage.getItem('rep_estado');
  if (saved) {
    try {
      var estado = JSON.parse(saved);
      audio.currentTime = estado.tiempo || 0;
      audio.volume = estado.volumen != null ? estado.volumen : 0.5;
      if (volumeSlider) volumeSlider.value = audio.volume * 100;
      if (estado.reproduciendo) {
        audio.play().then(function () {
          if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(function () {});
      }
    } catch (e) {}
  } else {
    audio.volume = volumeSlider ? volumeSlider.value / 100 : 0.5;
  }

  function guardarEstado() {
    sessionStorage.setItem('rep_estado', JSON.stringify({
      tiempo: audio.currentTime,
      reproduciendo: !audio.paused,
      volumen: audio.volume
    }));
  }

  function intentarAutoplay() {
    if (audio.paused) {
      audio.play().then(function () {
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        guardarEstado();
      }).catch(function () {});
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(function () {
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        guardarEstado();
      }).catch(function () {});
    } else {
      audio.pause();
      if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
      guardarEstado();
    }
  }

  function detener() {
    audio.pause();
    audio.currentTime = 0;
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
    if (timeDisplay) timeDisplay.textContent = '0:00';
    guardarEstado();
  }

  function formatearTiempo(s) {
    var m = Math.floor(s / 60);
    var seg = Math.floor(s % 60);
    return m + ':' + (seg < 10 ? '0' : '') + seg;
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (stopBtn) stopBtn.addEventListener('click', detener);

  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      audio.volume = this.value / 100;
      guardarEstado();
    });
  }

  audio.addEventListener('timeupdate', function () {
    if (timeDisplay) timeDisplay.textContent = formatearTiempo(audio.currentTime);
  });

  audio.addEventListener('ended', function () {
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
    if (timeDisplay) timeDisplay.textContent = '0:00';
    guardarEstado();
  });

  audio.addEventListener('loadedmetadata', function () {
    if (timeDisplay) timeDisplay.textContent = '0:00 / ' + formatearTiempo(audio.duration);
  });

  if (!saved) {
    audio.play().then(function () {
      if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      guardarEstado();
    }).catch(function () {});
  }

  document.addEventListener('click', function iniciar() {
    intentarAutoplay();
    document.removeEventListener('click', iniciar);
  });

  document.addEventListener('touchstart', function iniciar() {
    intentarAutoplay();
    document.removeEventListener('touchstart', iniciar);
  });

  window.addEventListener('beforeunload', guardarEstado);
  window.addEventListener('pagehide', guardarEstado);
})();
