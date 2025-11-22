// --- SOCIAL ICONS ANIMATION ---
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 200);
    });
});

// --- VARIABLES ---
const DISCORD_ID = "837741275603009626";
let songStartTimestamp = 0;
let songEndTimestamp = 0;
let isPlaying = false;

// --- FETCH DATA FROM DISCORD ---
async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (!data.success) return;

        const discordUser = data.data.discord_user;
        const spotifyData = data.data.spotify;

        // 1. AVATAR DECORATION
        const decorationImg = document.getElementById('discord-decoration');
        if (decorationImg) {
            const decorationHash = discordUser.avatar_decoration_data ? discordUser.avatar_decoration_data.asset : null;
            if (decorationHash) {
                decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=160&passthrough=true`;
                decorationImg.style.display = 'block';
            } else {
                decorationImg.style.display = 'none';
            }
        }

        // 2. SPOTIFY DATA
        const spotifyContainer = document.getElementById('spotify-container');
        const progressWrapper = document.querySelector('.spotify-progress-wrapper');

        if (spotifyContainer) {
            spotifyContainer.style.display = 'flex'; 

            if (spotifyData) {
                isPlaying = true;
                songStartTimestamp = spotifyData.timestamps.start;
                songEndTimestamp = spotifyData.timestamps.end;

                document.getElementById('spotify-album-art').src = spotifyData.album_art_url;
                document.getElementById('spotify-song-title').textContent = spotifyData.song;
                document.getElementById('spotify-artist-name').textContent = spotifyData.artist;
                document.getElementById('spotify-album-art').style.filter = "none";
                
                // Link to song
                spotifyContainer.onclick = () => window.open(`https://open.spotify.com/track/${spotifyData.track_id}`, '_blank');
                spotifyContainer.style.cursor = "pointer";

                // Ensure bar is visible
                if (progressWrapper) progressWrapper.style.display = 'flex'; 

            } else {
                isPlaying = false;
                document.getElementById('spotify-album-art').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png';
                document.getElementById('spotify-song-title').textContent = 'Not Found';
                document.getElementById('spotify-artist-name').textContent = 'Spotify';
                document.getElementById('spotify-album-art').style.filter = "grayscale(100%)";
                
                // --- VISUAL RESET (Keep showing 0:00) ---
                if (progressWrapper) {
                    progressWrapper.style.display = 'flex'; // Keep it visible
                    document.getElementById('spotify-progress-fill').style.width = '0%';
                    document.getElementById('spotify-time-current').innerText = '0:00';
                    document.getElementById('spotify-time-total').innerText = '0:00';
                }
                
                spotifyContainer.onclick = null;
                spotifyContainer.style.cursor = "default";
            }
        }

    } catch (error) {
        console.error("Error fetching Discord status:", error);
    }
}

// --- PROGRESS BAR LOGIC ---
function updateProgressBar() {
    if (!isPlaying) return; // Stop calculating if music is off

    const now = Date.now();
    const totalDuration = songEndTimestamp - songStartTimestamp;
    const currentProgress = now - songStartTimestamp;
    
    let percentage = (currentProgress / totalDuration) * 100;
    if (percentage > 100) percentage = 100;

    const barFill = document.getElementById('spotify-progress-fill');
    if (barFill) barFill.style.width = `${percentage}%`;

    const timeCurr = document.getElementById('spotify-time-current');
    const timeTot = document.getElementById('spotify-time-total');
    
    if (timeCurr) timeCurr.innerText = formatTime(currentProgress);
    if (timeTot) timeTot.innerText = formatTime(totalDuration);
}

// Helper: Convert milliseconds to MM:SS
function formatTime(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// --- TIMERS ---
getDiscordStatus(); 
setInterval(getDiscordStatus, 5000); 
setInterval(updateProgressBar, 1000);


// --- RAIN EFFECT LOGIC ---



// 1. Create the container if it doesn't exist yet
let rainContainer = document.getElementById('rain-container');
if (!rainContainer) {
    rainContainer = document.createElement('div');
    rainContainer.id = 'rain-container';
    document.body.appendChild(rainContainer);
}

function createRainDrop() {
    const drop = document.createElement('div');
    drop.classList.add('raindrop');
    drop.innerText = "<i class="fa-regular fa-snowflake"></i>";

    // --- Randomize Properties ---
    
    // Random horizontal position (0% to 100% of viewport width)
    drop.style.left = Math.random() * 100 + 'vw';

    // Random animation duration (fall speed between 2s and 7s)
    const duration = Math.random() * 5 + 2; 
    drop.style.animationDuration = duration + 's';

    // Random opacity for depth effect
    drop.style.opacity = Math.random() * 0.6 + 0.2; 

    // Random font size for variety
    const size = Math.random() * 12 + 10; // between 10px and 22px
    drop.style.fontSize = size + 'px';

    // Add to container
    rainContainer.appendChild(drop);

    // --- Cleanup ---
    // Remove element after animation finishes to prevent memory leaks
    setTimeout(() => {
        drop.remove();
    }, duration * 1000);
}

// Start the rain generator
// Change '100' to a lower number for MORE rain, higher for LESS rain.
setInterval(createRainDrop, 100); 
