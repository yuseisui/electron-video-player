const close = document.querySelector('#close');
const titleContainer = document.querySelector('#title-container');
const title = document.querySelector('#title');
const fileUploader = document.querySelector('#file-uploader');
const video = document.querySelector('video');
const playpause = document.querySelector('#playpause');
const loop = document.querySelector('#loop');
const volume = document.querySelector('#volume');
const open = document.querySelector('#open');
const progressbar = document.querySelector('#progress-bar');
const volumeValue = document.querySelector('#volume-value');
const timeCurrent = document.querySelector('#time-current');
const timeDuration = document.querySelector('#time-duration');

const throttle = (func, wait = 0) => {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  }.bind(this);
};

const parseSeconds = (seconds) => {
  const oneMin = 60;
  const oneHour = oneMin * 60;
  const hour = Math.trunc(seconds / oneHour);
  const min = Math.trunc((seconds % oneHour) / oneMin);
  const sec = Math.trunc((seconds % oneHour) % oneMin);
  return {hour, min, sec};
};

const formatTime = ({hour, min, sec}) => {
  const hourString = hour > 0 ? `${hour}` : '';
  const minString = hour > 0 ? `${min}`.padStart(2, '0') : `${min}`;
  const secString = `${sec}`.padStart(2, '0');
  return `${hourString}${
    hourString === '' ? '' : ':'
  }${minString}:${secString}`;
};

const togglePause = () => {
  if (video.src !== '' && (video.paused || video.ended)) {
    playpause.classList.remove('paused');
    video.play();
  } else {
    playpause.classList.add('paused');
    video.pause();
  }
};

const toggleLoop = () => {
  if (video.loop) {
    loop.classList.remove('loop');
    video.loop = false;
  } else {
    loop.classList.add('loop');
    video.loop = true;
  }
};

const toggleMute = () => {
  if (video.muted) {
    volume.classList.remove('muted');
    video.muted = false;
  } else {
    volume.classList.add('muted');
    video.muted = true;
  }
};

const toggleTitleMarquee = () => {
  if (title.offsetWidth > titleContainer.offsetWidth) {
    title.classList.add('marquee');
  } else {
    title.classList.remove('marquee');
  }
};

const clamp = (value, min, max) => {
  if (min > max) {
    throw new RangeError('`min` should be lower than `max`');
  }

  return Math.max(min, Math.min(value, max));
};

const volumeBy = (value) => {
  const vol = clamp(video.volume + value, 0, 1);
  video.volume = vol.toFixed(2);
};

const seekBy = (value) => {
  if (video.src === '') return;
  video.currentTime = clamp(video.currentTime + value, 0, video.duration);
};

const openFileDialog = () => {
  fileUploader.click();
};

const closeWindow = () => {
  window.close();
};

// Events

close.addEventListener('click', closeWindow);
loop.addEventListener('click', toggleLoop);
volume.addEventListener('click', toggleMute);
open.addEventListener('click', openFileDialog);
window.addEventListener('resize', toggleTitleMarquee);

document.addEventListener(
  'keydown',
  throttle((event) => {
    switch (event.key) {
      case 'ArrowUp':
        volumeBy(0.05);
        break;
      case 'ArrowDown':
        volumeBy(-0.05);
        break;
      case 'ArrowLeft':
        seekBy(-5);
        break;
      case 'ArrowRight':
        seekBy(5);
        break;
      default:
        break;
    }
  }, 50),
);

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case ' ':
      togglePause();
      break;
    case 'o':
      openFileDialog();
      break;
    case 'l':
      toggleLoop();
      break;
    case 'm':
      toggleMute();
      break;
    default:
      break;
  }
});

fileUploader.addEventListener('change', () => {
  const file = fileUploader.files[0];

  if (file === undefined || !video.canPlayType(file.type)) {
    return;
  }

  URL.revokeObjectURL(video.src);
  video.src = URL.createObjectURL(file);
  playpause.classList.remove('paused');
  title.textContent = file.name;
  document.title = file.name;
  toggleTitleMarquee();
});

video.addEventListener('dblclick', () => {
  if (video.src === '') {
    openFileDialog();
  } else {
    togglePause();
  }
});

video.addEventListener('loadedmetadata', () => {
  progressbar.max = video.duration;
  progressbar.disabled = false;
  timeCurrent.textContent = formatTime(parseSeconds(video.currentTime));
  timeDuration.textContent = formatTime(parseSeconds(video.duration));
});

video.addEventListener('timeupdate', () => {
  const {currentTime} = video;
  progressbar.value = currentTime;
  timeCurrent.textContent = formatTime(parseSeconds(currentTime));
});

video.addEventListener('ended', () => {
  playpause.classList.add('paused');
});

video.addEventListener('volumechange', () => {
  volumeValue.textContent = (video.volume * 100).toFixed(0);
});

playpause.addEventListener('click', togglePause);

progressbar.addEventListener('input', () => {
  progressbar.blur();
  video.currentTime = progressbar.value;
});
