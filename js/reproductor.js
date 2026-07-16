(function () {
  var player = document.getElementById('reproductor');
  if (!player) return;

  var audio = document.createElement('audio');
  audio.src = 'audio/The Warning - S!ck.mp3';
  audio.preload = 'auto';
  player.appendChild(audio);

  var playBtn = document.getElementById('rep-play');
  var stopBtn = document.getElementById('rep-stop');
  var volumeSlider = document.getElementById('rep-vol');
  var timeDisplay = document.getElementById('rep-tiempo');

  var autoplayIniciado = false;
  var hintAdded = false;

  var saved = sessionStorage.getItem('rep_estado');
  if (saved) {
    try {
      var estado = JSON.parse(saved);
      audio.currentTime = estado.tiempo || 0;
      audio.volume = estado.volumen != null ? estado.volumen : 0.5;
      if (volumeSlider) volumeSlider.value = audio.volume * 100;
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

  function mostrarHint() {
    if (hintAdded) return;
    hintAdded = true;
    var hint = document.createElement('div');
    hint.id = 'rep-hint';
    hint.textContent = 'Hacé clic en cualquier parte para escuchar';
    Object.assign(hint.style, {
      position: 'absolute', bottom: '100%', left: '0', right: '0',
      background: 'var(--naranja)', color: '#fff', fontSize: '0.7rem',
      padding: '4px 8px', textAlign: 'center', borderRadius: '8px 8px 0 0',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
    });
    if (player) player.appendChild(hint);
  }

  function ocultarHint() {
    var hint = document.getElementById('rep-hint');
    if (hint) hint.remove();
    hintAdded = false;
  }

  function arrancar() {
    if (autoplayIniciado) return;
    autoplayIniciado = true;
    ocultarHint();
    if (audio.paused) {
      audio.play().then(function () {
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        guardarEstado();
      }).catch(function (err) {
        console.warn('Reproductor: no se pudo iniciar la reproducción', err);
      });
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(function () {
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        guardarEstado();
        ocultarHint();
      }).catch(function (err) {
        console.warn('Reproductor: error al reproducir', err);
      });
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

  audio.addEventListener('error', function () {
    console.warn('Reproductor: error al cargar el archivo de audio');
    if (playBtn) playBtn.title = 'Error al cargar audio';
  });

  audio.play().then(function () {
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    guardarEstado();
    autoplayIniciado = true;
  }).catch(function () {});

  function alInteractuar() {
    arrancar();
  }

  document.addEventListener('click', alInteractuar);
  document.addEventListener('touchstart', alInteractuar);
  document.addEventListener('keydown', alInteractuar);

  window.addEventListener('beforeunload', guardarEstado);
  window.addEventListener('pagehide', guardarEstado);

  if (!autoplayIniciado) {
    setTimeout(mostrarHint, 3000);
  }
})();
