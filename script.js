// --- gifs ---
const gifs = ["blue_gif.gif", "cinnamoroll_gif.gif", "pika_gif.gif", "plane_gif.gif", "ramen_gif.gif", "train_gif.gif"];
let gifIndex = 0;

// --- update date/time ---
function updateDateTime() {
    const now = new Date();
  
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formattedDate = now.toLocaleDateString(undefined, dateOptions);
  
    const timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    const formattedTime = now.toLocaleTimeString(undefined, timeOptions);
  
    document.getElementById('date').textContent = formattedDate;
    document.getElementById('time').textContent = formattedTime;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// --- cycle gif ---
function cycleGif() {
    gifIndex = (gifIndex + 1) % gifs.length; // loop through gifs
    document.querySelector(".comfy-gif").src = `assets/${gifs[gifIndex]}`; // manually set
}

cycleGif(); // initial load
setInterval(cycleGif, 300000); // every 5 mins

// -- youtube player
let player;
let isPlaying = false;
let currentVolume = 50;
let progressAnimation;
const playlistVideoIds = [
    "bass9XdfxtQ",
    "nqUoa2inNtw",
    "gCYqZP70dLk",
    "Dui7KB8y-Ro",
    "d1AKq_r0Ggc",
    "JhnTM9eBkhE",
    "q9ySYl-4SvU",
    "c4pBkDV-H5U",
    "6lR3axQs7dA",
    "F_Bj_6idYqc",
    "M8LSh-yzIgE",
    "M9iLKdhV778",
    "hF0I9h7C4A4",
    "1y8D6Smn6AQ",
    "q8iCL5CR5k0",
    "DXuNJ267Vss",
    "MJedvm2TE8o",
    "HHKmS7c5ai4",
    "B5eM3Q3wj0M",
    "zF32eh6PWPk",
    "hbz-8K-pxpY",
    "WwXJrMhbi-s",
    "5yaY7aG1Lpo",
    "A2zepLiuEJU",
    "jbSfHK2bsik"
];

function shuffleArray(array) {
    return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// --- create shuffled playlist ---
let shuffledPlaylist = shuffleArray([...playlistVideoIds]);
let currentVideoIndex = 0;

// --- create player ---
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            rel: 0
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

// player ready
function onPlayerReady(event) {
    player.setVolume(currentVolume);
    document.getElementById("volume").value = currentVolume;
    player.loadVideoById(shuffledPlaylist[currentVideoIndex]);
}

// track progress bar as song plays
const progressBar = document.getElementById('progress-bar');
progressBar.value = 0;

// --- Initialize play icon position ---
const playBtn = document.getElementById('play');
const playIcon = playBtn.querySelector('img');  // Ensure playIcon is initialized before use
playIcon.style.left = "0px";  // Set the icon to the left at initial load

function updateProgress() {
    if (player && player.getDuration && player.getCurrentTime) {
        const duration = player.getDuration();
        const currentTime = player.getCurrentTime();
        
        if (!isNaN(duration) && duration > 0) {
            progressBar.value = (currentTime / duration) * 100;
            
            // Update the play icon's position based on progress bar
            const iconPosition = (progressBar.value / 100) * progressBar.offsetWidth;
            playIcon.style.left = `${iconPosition}px`;
        }

        progressAnimation = requestAnimationFrame(() => {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                updateProgress();
            }
        });
    }
}

// player state change handler
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        playIcon.src = 'icons/pause.png';
        playIcon.alt = 'Pause';
        cancelAnimationFrame(progressAnimation);
        updateProgress();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        playIcon.src = 'icons/play.png';
        playIcon.alt = 'Play';
        cancelAnimationFrame(progressAnimation);  // Stop animation when paused or ended
    }

    if (event.data === YT.PlayerState.ENDED) {
        playNextVideo();
    }
}

progressBar.addEventListener('input', (e) => {
    const duration = player.getDuration();
    const seekTo = (e.target.value / 100) * duration;
    player.seekTo(seekTo, true);
});

// --- shuffle playlist ---
function playNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % shuffledPlaylist.length;
    player.loadVideoById(shuffledPlaylist[currentVideoIndex]);
}

function playPreviousVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length;
    player.loadVideoById(shuffledPlaylist[currentVideoIndex]);
}

// load youtube api
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

// controls
playBtn.addEventListener('click', () => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

document.getElementById("prev").addEventListener("click", playPreviousVideo);
document.getElementById("next").addEventListener("click", playNextVideo);

document.getElementById("volume").addEventListener("input", (e) => {
    currentVolume = e.target.value;
    player.setVolume(currentVolume);
});


/* const playlistVideoIds = [
    "bass9XdfxtQ",
    "nqUoa2inNtw",
    "gCYqZP70dLk",
    "Dui7KB8y-Ro",
    "d1AKq_r0Ggc",
    "JhnTM9eBkhE",
    "q9ySYl-4SvU",
    "c4pBkDV-H5U",
    "6lR3axQs7dA",
    "F_Bj_6idYqc",
    "M8LSh-yzIgE",
    "M9iLKdhV778",
    "hF0I9h7C4A4",
    "1y8D6Smn6AQ",
    "q8iCL5CR5k0",
    "DXuNJ267Vss",
    "MJedvm2TE8o",
    "HHKmS7c5ai4",
    "B5eM3Q3wj0M",
    "zF32eh6PWPk",
    "hbz-8K-pxpY",
    "WwXJrMhbi-s",
    "5yaY7aG1Lpo",
    "A2zepLiuEJU",
    "jbSfHK2bsik"
]; */