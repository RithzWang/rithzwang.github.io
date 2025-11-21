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

// --- 1. INSTANT LOAD FROM CACHE (The Magic Fix) ---
const decorationImg = document.getElementById('discord-decoration');
const cachedDecoration = localStorage.getItem('discord_decoration_url');

// If we have a saved decoration, show it IMMEDIATELY (0ms delay)
if (cachedDecoration && decorationImg) {
    decorationImg.src = cachedDecoration;
    decorationImg.style.display = 'block';
}

// --- FETCH DATA FROM DISCORD ---
async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (!data.success) return;

        const discordUser = data.data.discord_user;
        const spotifyData = data.data.spotify;

        // --- HANDLE DECORATION ---
        if (decorationImg) {
            const decorationHash = discordUser.avatar_decoration_data ? discordUser.avatar_decoration_data.asset : null;
            
            if (decorationHash) {
                const newUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=160&passthrough=true`;
                
                // Only update DOM if URL is different (prevents flickering)
                if (decorationImg.src !== newUrl) {
                    decorationImg.src = newUrl;
                    decorationImg.style.display = 'block';
                    // Save to cache for next time!
                    localStorage.setItem('discord_decoration_url', newUrl);
                }
            } else {
                decorationImg.style.display = 'none';
                localStorage.removeItem('discord_decoration_url');
            }
        }

        // --- HANDLE SPOTIFY ---
        const spotifyContainer = document.getElementById('spotify-container');
        const progressWrapper = document.querySelector('.spotify-progress-wrapper');

        if (spotifyData) {
            // User is listening
            isPlaying = true;
            songStartTimestamp = spotifyData.timestamps.start;
            songEndTimestamp = spotifyData.timestamps.end;

            const art = document.getElementById('spotify-album-art');
            art.src = spotifyData.album_art_url;
            art.style.filter = "none";

            document.getElementById('spotify-song-title').textContent = spotifyData.song;
            document.getElementById('spotify-artist-name').textContent = spotifyData.artist;
            
            // Update Link
            spotifyContainer.onclick = () => window.open(`https://open.spotify.com/track/$${spotifyData.track_id}`, '_blank');
            spotifyContainer.style.cursor = "pointer";

        } else {
            // User is NOT listening (Revert to Default)
            isPlaying = false;
            const art = document.getElementById('spotify-album-art');
            
            // Only reset if it's not already in default state to avoid flickering
            if (!art.src.includes("Spotify_logo_without_text")) {
                art.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png';
                art.style.filter = "grayscale(100%) opacity(0.5)";
                
                document.getElementById('spotify-song-title').textContent = 'Not Listening';
                document.getElementById('spotify-artist-name').textContent = 'Spotify';
                
                if (progressWrapper) {
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
