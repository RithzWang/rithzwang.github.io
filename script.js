// Existing code for social icons
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.add('clicked'); 
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 200);
    });
});

const DISCORD_ID = "837741275603009626"; 

async function getDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        const discordUser = data.data.discord_user;
        const spotifyData = data.data.spotify;

        // --- 1. HANDLE AVATAR DECORATION ---
        const decorationImg = document.getElementById('discord-decoration');
        if (decorationImg) {
            const decorationHash = discordUser.avatar_decoration_data ? discordUser.avatar_decoration_data.asset : discordUser.avatar_decoration;
            if (decorationHash) {
                decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=160&passthrough=true`;
                decorationImg.style.display = 'block';
            } else {
                decorationImg.style.display = 'none';
            }
        }

        
const spotifyContainer = document.getElementById('spotify-container');
        if (spotifyContainer) {
            // Always make sure the card is visible
            spotifyContainer.style.display = 'block'; 

            if (spotifyData) {
                // IF MUSIC IS PLAYING:
                document.getElementById('spotify-album-art').src = spotifyData.album_art_url;
                document.getElementById('spotify-song-title').textContent = spotifyData.song;
                document.getElementById('spotify-artist-name').textContent = spotifyData.artist;
                
                // Make image normal
                document.getElementById('spotify-album-art').style.filter = "none"; 
            } else {
                // IF NO MUSIC IS PLAYING:
                // Set a default Spotify Logo
                document.getElementById('spotify-album-art').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png';
                
                // Set text to "Not Playing"
                document.getElementById('spotify-song-title').textContent = 'Not Found';
                document.getElementById('spotify-artist-name').textContent = 'Spotify';
                
                // Optional: Make the logo black & white to show it's offline
                document.getElementById('spotify-album-art').style.filter = "grayscale(100%)"; 
            }
        }

        } catch (error) {
        console.error("Error fetching Discord status:", error);
    }


    }

getDiscordStatus();
setInterval(getDiscordStatus, 5000);
