// Existing code for social icons
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.add('clicked'); 
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 200);
    });
});

const DISCORD_ID = "837741275603009626"; // Your ID

async function getSpotifyStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        
        const spotifyData = data.data.spotify;
        const container = document.getElementById('spotify-container');

        if (spotifyData) {
            // If listening to music, show the card
            container.style.display = 'block';
            
            // Update Image
            document.getElementById('spotify-album-art').src = spotifyData.album_art_url;
            
            // Update Text
            document.getElementById('spotify-song-title').textContent = spotifyData.song;
            document.getElementById('spotify-artist-name').textContent = spotifyData.artist;
        } else {
            // If not listening, hide the card
            container.style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching Spotify status:", error);
    }
}

// Run immediately on load
getSpotifyStatus();

// Check again every 5 seconds to keep it real-time
setInterval(getSpotifyStatus, 5000);

