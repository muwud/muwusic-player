const gifPaths = [
    'assets/blue_gif.gif',
    'assets/cinnamoroll_gif.gif',
    'assets/pika_gif.gif',
    'assets/ramen_gif.gif',
    'assets/plane_gif.gif',
    'assets/train_gif.gif'
];

let currentGifIndex = 0;
const gifElement = document.querySelector('.comfy-gif');

function cycleGifs() {
  currentGifIndex = (currentGifIndex + 1) % gifPaths.length;
  gifElement.src = gifPaths[currentGifIndex];
}

// cycle every 5 mins
setInterval(cycleGifs, 300000);

//check if embedded
if (window !== window.top) {
    document.body.classList.add('embedded');
}


// --- update date/time ---
function updateDateTime() {
    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");

    const now = new Date();

    // "month day, year"
    const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // "hour:minute"
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    dateElement.textContent = date;
    timeElement.textContent = time;
}

// update every second
setInterval(updateDateTime, 1000);

// initial call to set the date and time immediately on page load
updateDateTime();

// --- sparkle animation controls ---
const sparkles = document.querySelectorAll('.sparkle');

function startSparkles() {
  sparkles.forEach((s, i) => {
    const delay = i * 0.75; // or randomize for more variation
    s.style.animation = `sparkle-animation 1.5s ${delay}s infinite`;
    s.style.opacity = 1; // always visible
  });
}

function stopSparkles() {
  sparkles.forEach(s => {
    s.style.animation = "none";
    s.style.opacity = 1; // keep visible
  });
}

// --- youtube player ---
let player;
let isPlaying = false;
let currentVolume = 25;
let isPlayerReady = false;

const playIcon = document.getElementById("play-icon");

const playlistVideoIds = [
  "bass9XdfxtQ", "nqUoa2inNtw", "gCYqZP70dLk", "Dui7KB8y-Ro",
  "d1AKq_r0Ggc", "JhnTM9eBkhE", "q9ySYl-4SvU", "c4pBkDV-H5U",
  "6lR3axQs7dA", "F_Bj_6idYqc", "M8LSh-yzIgE", "M9iLKdhV778",
  "hF0I9h7C4A4", "1y8D6Smn6AQ", "q8iCL5CR5k0", "DXuNJ267Vss",
  "MJedvm2TE8o", "HHKmS7c5ai4", "B5eM3Q3wj0M", "zF32eh6PWPk",
  "hbz-8K-pxpY", "WwXJrMhbi-s", "5yaY7aG1Lpo", "A2zepLiuEJU",
  "jbSfHK2bsik"
];

// --- shuffle array ---
function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

let shuffledPlaylist = shuffleArray([...playlistVideoIds]);
let currentVideoIndex = 0;

// --- create player ---
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId: shuffledPlaylist[currentVideoIndex],
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

const progressBar = document.getElementById("progress-bar");
const volumeSlider = document.getElementById("volume");

// --- player ready ---
function onPlayerReady(event) {
  isPlayerReady = true;
  player.setVolume(currentVolume);

  // sync slider with volume and start progress tracking
  volumeSlider.value = currentVolume;
  startProgressUpdater();
}

// --- update play icon depending on player state ---
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playIcon.src = "icons/pause.png";
    startSparkles();
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    playIcon.src = "icons/play.png";
    stopSparkles();
  } else if (event.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    playIcon.src = "icons/play.png";
    stopSparkles();

    // auto-play next video
    currentVideoIndex = (currentVideoIndex + 1) % shuffledPlaylist.length;
    player.loadVideoById(shuffledPlaylist[currentVideoIndex]);
  }
}

// --- update progress bar ---
let progressInterval;

function startProgressUpdater() {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (isPlayerReady && player.getDuration) {
      const duration = player.getDuration();
      const currentTime = player.getCurrentTime();
      if (duration && currentTime >= 0) {
        progressBar.value = (currentTime / duration) * 100;
      }
    }
  }, 500);
}

// --- seek when dragging progress bar ---
progressBar.addEventListener("input", function (e) {
  if (!isPlayerReady) return;
  const percent = parseFloat(e.target.value);
  const duration = player.getDuration();
  const seekTo = (percent / 100) * duration;
  player.seekTo(seekTo, true);
});

// --- play/pause toggle ---
document.getElementById("play").addEventListener("click", function () {
  if (!isPlayerReady) return;

  if (isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

// --- next/prev buttons ---
document.getElementById("next").addEventListener("click", function () {
  currentVideoIndex = (currentVideoIndex + 1) % shuffledPlaylist.length;
  player.loadVideoById(shuffledPlaylist[currentVideoIndex]);
});

document.getElementById("prev").addEventListener("click", function () {
  currentVideoIndex =
    (currentVideoIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length;
  player.loadVideoById(shuffledPlaylist[currentVideoIndex]);
});

// --- volume control ---
volumeSlider.addEventListener("input", function (e) {
  const volume = parseInt(e.target.value);
  currentVolume = volume;
  if (isPlayerReady) {
    player.setVolume(volume);
  }
});
