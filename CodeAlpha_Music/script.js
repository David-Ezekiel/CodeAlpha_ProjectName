// --- Groove Music UI Integration ---
document.addEventListener('DOMContentLoaded', function () {
    // Sidebar navigation (highlight active and switch main content)
    const tabMap = {
        home: 'homeTab',
        songs: 'songListTab',
        recent: 'recentTab',
        nowplaying: 'nowPlayingTab',
        playlists: 'playlistsTab',
        favorites: 'favoritesTab',
        artists: 'artistsTab',
        albums: 'albumsTab',
        genres: 'genresTab',
        recentlyadded: 'recentlyAddedTab',
        queue: 'queueTab',
        equalizer: 'equalizerTab'
    };
    document.querySelectorAll('.groove-nav li').forEach(item => {
        item.addEventListener('click', function () {
            // Modal logic for settings/about
            const tab = item.getAttribute('data-tab');
            if (tab === 'settings' || tab === 'about') {
                openModal(tab);
                return;
            }
            document.querySelectorAll('.groove-nav li').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // Show only the selected tab content
            Object.values(tabMap).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            if (tabMap[tab]) {
                const showEl = document.getElementById(tabMap[tab]);
                if (showEl) showEl.style.display = '';
                // Handle different tab content rendering
                if (window.groovePlayer) {
                    switch(tab) {
                        case 'songs':
                            window.groovePlayer.renderSongList();
                            break;
                        case 'playlists':
                            window.groovePlayer.renderPlaylistsPanel();
                            break;
                        case 'artists':
                            window.groovePlayer.renderArtistsPanel();
                            break;
                        case 'albums':
                            window.groovePlayer.renderAlbumsPanel();
                            break;
                        case 'favorites':
                            window.groovePlayer.renderFavoritesPanel();
                            break;
                        case 'recent':
                            window.groovePlayer.renderRecentPanel();
                            break;
                        case 'nowplaying':
                            window.groovePlayer.renderNowPlayingPanel();
                            break;
                    }
                }
            }
        });
    });
    // Default to My Music tab
    document.querySelector('.groove-nav li[data-tab="songs"]').click();
    // Hamburger menu for sidebar collapse
    const sidebar = document.getElementById('sidebar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (sidebar && hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
            // Also toggle .collapsed on .groove-container and .groove-playerbar for layout shift
            const container = document.querySelector('.groove-container');
            const playerbar = document.querySelector('.groove-playerbar');
            if (sidebar.classList.contains('collapsed')) {
                if (container) container.style.marginLeft = '60px';
                if (playerbar) playerbar.style.left = '60px';
            } else {
                if (container) container.style.marginLeft = '260px';
                if (playerbar) playerbar.style.left = '260px';
            }
        });
    }
    // Modal logic
    function openModal(type) {
        closeModal();
        let modal, content;
        if (type === 'settings') {
            modal = document.getElementById('settingsModal');
            content = `<div class='groove-modal-content'>
                <button class='groove-modal-close' onclick='closeModal()'>&times;</button>
                <h2>Settings</h2>
                <p>Settings panel coming soon. Here you can add theme, audio, and app preferences.</p>
            </div>`;
        } else if (type === 'about') {
            modal = document.getElementById('aboutModal');
            content = `<div class='groove-modal-content'>
                <button class='groove-modal-close' onclick='closeModal()'>&times;</button>
                <h2>About</h2>
                <p>This is a Groove Music inspired player. Built with HTML, CSS, and JavaScript.</p>
                <p>Features include:</p>
                <ul>
                    <li>Audio playback controls (play, pause, next, previous)</li>
                    <li>Progress bar and volume control</li>
                    <li>Song information display (title, artist, duration)</li>
                    <li>Playlist management</li>
                    <li>Search functionality</li>
                    <li>Autoplay feature</li>
                    <li>Drag & drop file upload</li>
                </ul>
            </div>`;
        } else if (type === 'help') {
            modal = document.getElementById('aboutModal');
            content = `<div class='groove-modal-content'>
                <button class='groove-modal-close' onclick='closeModal()'>&times;</button>
                <h2>Help & Keyboard Shortcuts</h2>
                <h3>Keyboard Shortcuts:</h3>
                <ul>
                    <li><strong>Spacebar:</strong> Play/Pause</li>
                    <li><strong>Ctrl + →:</strong> Next song</li>
                    <li><strong>Ctrl + ←:</strong> Previous song</li>
                    <li><strong>Ctrl + ↑:</strong> Volume up</li>
                    <li><strong>Ctrl + ↓:</strong> Volume down</li>
                    <li><strong>Ctrl + M:</strong> Mute/Unmute</li>
                    <li><strong>Escape:</strong> Close modals</li>
                </ul>
                <h3>How to use:</h3>
                <ul>
                    <li>Upload audio files by dragging them to the upload area or clicking browse</li>
                    <li>Use the search bar to find songs, artists, or albums</li>
                    <li>Create playlists from the Playlists section</li>
                    <li>Browse by Artists or Albums for organized viewing</li>
                </ul>
            </div>`;
        }
        if (modal) {
            modal.innerHTML = content;
            modal.style.display = 'flex';
        }
    }
    window.closeModal = function() {
        document.getElementById('settingsModal').style.display = 'none';
        document.getElementById('aboutModal').style.display = 'none';
    };
    // Close modal on Escape key and add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') window.closeModal();
        
        // Music player keyboard shortcuts
        if (window.groovePlayer && !e.target.matches('input, textarea')) {
            switch(e.key) {
                case ' ': // Spacebar for play/pause
                    e.preventDefault();
                    window.groovePlayer.togglePlayPause();
                    break;
                case 'ArrowRight': // Right arrow for next
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.groovePlayer.playNext();
                    }
                    break;
                case 'ArrowLeft': // Left arrow for previous
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.groovePlayer.playPrev();
                    }
                    break;
                case 'ArrowUp': // Up arrow for volume up
                    if (e.ctrlKey) {
                        e.preventDefault();
                        const currentVolume = window.groovePlayer.audio.volume;
                        window.groovePlayer.audio.volume = Math.min(1, currentVolume + 0.1);
                        window.groovePlayer.volumeBar.value = window.groovePlayer.audio.volume;
                        window.groovePlayer.updateVolumeIcon();
                    }
                    break;
                case 'ArrowDown': // Down arrow for volume down
                    if (e.ctrlKey) {
                        e.preventDefault();
                        const currentVolume = window.groovePlayer.audio.volume;
                        window.groovePlayer.audio.volume = Math.max(0, currentVolume - 0.1);
                        window.groovePlayer.volumeBar.value = window.groovePlayer.audio.volume;
                        window.groovePlayer.updateVolumeIcon();
                    }
                    break;
                case 'm': // M for mute
                case 'M':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.groovePlayer.toggleMute();
                    }
                    break;
            }
        }
    });
});

// --- Music Player Logic ---
class GrooveMusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.songListTab = document.getElementById('songListTab');
        this.fileInput = document.getElementById('fileInput');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.totalTimeDisplay = document.getElementById('totalTime');
        this.volumeBar = document.getElementById('volumeBar');
        this.muteBtn = document.getElementById('muteBtn');
        this.autoplayBtn = document.getElementById('autoplayBtn');
        this.playerCover = document.getElementById('playerCover');
        this.playerTitle = document.getElementById('playerTitle');
        this.playerArtist = document.getElementById('playerArtist');
        this.songs = [];
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isAutoplay = false;
        this.volume = 1;
        this.sortBy = 'title';
        this.init();
    }
    init() {
        // Default gospel songs (expanded to 30 for testing, now with cover images)
        this.songs = [
            { title: 'Way Maker', artist: 'Sinach', album: 'Way Maker', genre: 'Gospel', duration: '4:02', src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2016 },
            { title: 'Excess Love', artist: 'Mercy Chinwo', album: 'The Cross: My Gaze', genre: 'Gospel', duration: '5:10', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2018 },
            { title: 'Imela', artist: 'Nathaniel Bassey', album: 'The Son of God', genre: 'Gospel', duration: '6:20', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2014 },
            { title: 'You Are Great', artist: 'Steve Crown', album: 'You Are Great', genre: 'Gospel', duration: '5:45', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2016 },
            { title: 'Onaga', artist: 'Tim Godfrey', album: 'Fearless Worship', genre: 'Gospel', duration: '4:50', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2019 },
            { title: 'Nara', artist: 'Tim Godfrey', album: 'Nara', genre: 'Gospel', duration: '5:30', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2018 },
            { title: 'Ekwueme', artist: 'Prospa Ochimana', album: 'Ekwueme', genre: 'Gospel', duration: '6:00', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2017 },
            { title: 'Olorun Agbaye', artist: 'Nathaniel Bassey', album: 'Hallelujah Again', genre: 'Gospel', duration: '7:12', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2021 },
            // 22 more dummy songs for testing scroll
            { title: 'Overflow', artist: 'Sinach', album: 'Overflow', genre: 'Gospel', duration: '4:15', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2017 },
            { title: 'Chinedum', artist: 'Mercy Chinwo', album: 'Satisfied', genre: 'Gospel', duration: '3:55', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2020 },
            { title: 'Yahweh', artist: 'Nathaniel Bassey', album: 'Yahweh', genre: 'Gospel', duration: '5:40', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2015 },
            { title: 'All Power', artist: 'Steve Crown', album: 'Nations Will Rise and Sing', genre: 'Gospel', duration: '4:30', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2017 },
            { title: 'Agidigba', artist: 'Tim Godfrey', album: 'Agidigba', genre: 'Gospel', duration: '4:20', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2016 },
            { title: 'Amazing God', artist: 'Prospa Ochimana', album: 'Amazing God', genre: 'Gospel', duration: '5:10', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2019 },
            { title: 'No One Like You', artist: 'Sinach', album: 'Shout It Loud', genre: 'Gospel', duration: '4:45', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2012 },
            { title: 'Bor Ekom', artist: 'Mercy Chinwo', album: 'Satisfied', genre: 'Gospel', duration: '3:50', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2020 },
            { title: 'Book of Life', artist: 'Nathaniel Bassey', album: 'Book of Life', genre: 'Gospel', duration: '6:10', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2017 },
            { title: 'We Wait on You', artist: 'Steve Crown', album: 'You Are Great', genre: 'Gospel', duration: '5:00', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2016 },
            { title: 'Victory', artist: 'Tim Godfrey', album: 'Victory', genre: 'Gospel', duration: '4:35', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2018 },
            { title: 'My Worship', artist: 'Prospa Ochimana', album: 'My Worship', genre: 'Gospel', duration: '5:20', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2020 },
            { title: 'I Know Who I Am', artist: 'Sinach', album: 'Shout It Loud', genre: 'Gospel', duration: '4:10', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2012 },
            { title: 'Obinasom', artist: 'Mercy Chinwo', album: 'Satisfied', genre: 'Gospel', duration: '4:00', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2020 },
            { title: 'Jehovah', artist: 'Nathaniel Bassey', album: 'Book of Life', genre: 'Gospel', duration: '5:50', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2017 },
            { title: 'Awesome God', artist: 'Steve Crown', album: 'Nations Will Rise and Sing', genre: 'Gospel', duration: '4:25', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2017 },
            { title: 'God Turned It Around', artist: 'Tim Godfrey', album: 'Already Won', genre: 'Gospel', duration: '4:40', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2021 },
            { title: 'The Great I Am', artist: 'Prospa Ochimana', album: 'The Great I Am', genre: 'Gospel', duration: '6:05', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2021 },
            { title: 'Matchless Love', artist: 'Sinach', album: 'Matchless Love', genre: 'Gospel', duration: '4:35', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2018 },
            { title: 'Regular', artist: 'Mercy Chinwo', album: 'Satisfied', genre: 'Gospel', duration: '3:45', src: '', cover: 'https://i.imgur.com/2nCt3Sbl.jpg', year: 2020 },
            { title: 'This God Is Too Good', artist: 'Nathaniel Bassey', album: 'This God Is Too Good', genre: 'Gospel', duration: '6:30', src: '', cover: 'https://i.imgur.com/8Km9tLL.jpg', year: 2016 },
            { title: 'You Alone', artist: 'Steve Crown', album: 'Nations Will Rise and Sing', genre: 'Gospel', duration: '4:50', src: '', cover: 'https://i.imgur.com/1bX5QH6.jpg', year: 2017 }
        ];
        this.renderSongList();
        this.setupEvents();
        this.updatePlayerBar();
        this.renderArtistsPanel();
        this.renderAlbumsPanel();
        this.setupSearch();
    }
    setupEvents() {
        // File upload
        this.fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
        // Drag and drop
        const dragDropArea = document.getElementById('dragDropArea');
        if (dragDropArea) {
            ['dragenter', 'dragover'].forEach(event => {
                dragDropArea.addEventListener(event, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dragDropArea.classList.add('dragover');
                });
            });
            ['dragleave', 'drop'].forEach(event => {
                dragDropArea.addEventListener(event, (e) => {
                    e.preventDefault();
                e.stopPropagation();
                    dragDropArea.classList.remove('dragover');
                });
            });
            dragDropArea.addEventListener('drop', (e) => {
                const files = Array.from(e.dataTransfer.files);
                this.handleFiles(files);
            });
            // Click on drag area opens file dialog
            dragDropArea.addEventListener('click', () => {
                this.fileInput.click();
            });
        }
        // Play controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrev());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.progressBar.addEventListener('input', (e) => {
            if (this.audio.duration) {
                this.audio.currentTime = (e.target.value / 100) * this.audio.duration;
            }
        });
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => {
            if (this.isAutoplay) this.playNext();
        });
        this.volumeBar.addEventListener('input', (e) => {
            this.audio.volume = e.target.value;
            this.volume = e.target.value;
            this.updateVolumeIcon();
        });
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.autoplayBtn.addEventListener('click', () => {
            this.isAutoplay = !this.isAutoplay;
            this.autoplayBtn.classList.toggle('active', this.isAutoplay);
        });
        // Add sort select for My Music
        if (!document.getElementById('sortSelect')) {
            const sortFilter = document.createElement('select');
            sortFilter.id = 'sortSelect';
            sortFilter.innerHTML = '<option value="title">Sort by Title</option><option value="artist">Sort by Artist</option>';
            sortFilter.style.marginLeft = '12px';
            sortFilter.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.renderSongList();
            });
            const sortFilterContainer = document.querySelector('.groove-sort-filter');
            if (sortFilterContainer) sortFilterContainer.appendChild(sortFilter);
        }
        // Panel switching for Artists and Albums
        document.querySelectorAll('.groove-nav li[data-tab="artists"]').forEach(item => {
            item.addEventListener('click', () => {
                this.hideAllPanels();
                document.getElementById('artistsTab').style.display = '';
                this.renderArtistsPanel();
            });
        });
        document.querySelectorAll('.groove-nav li[data-tab="albums"]').forEach(item => {
            item.addEventListener('click', () => {
                this.hideAllPanels();
                document.getElementById('albumsTab').style.display = '';
                this.renderAlbumsPanel();
            });
        });
    }
    hideAllPanels() {
        // Hide all tab panels
        document.querySelectorAll('.groove-tab-content').forEach(el => el.style.display = 'none');
        if (document.getElementById('artistsTab')) document.getElementById('artistsTab').style.display = 'none';
        if (document.getElementById('albumsTab')) document.getElementById('albumsTab').style.display = 'none';
    }
    handleFiles(files) {
        let firstPlayableIdx = -1;
        files.forEach((file, i) => {
            if (file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file);
                const song = {
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    artist: 'Unknown Artist',
                    duration: '...loading...',
                    src: url,
                    cover: '',
                    file: file
                };
                this.songs.push(song);
                if (firstPlayableIdx === -1) firstPlayableIdx = this.songs.length - 1;
                this.getAudioDuration(url, (duration) => {
                    song.duration = this.formatTime(duration);
                    this.renderSongList();
                });
            }
        });
        this.renderSongList();
        // Play the first imported song immediately
        if (firstPlayableIdx !== -1) {
            this.playSong(firstPlayableIdx);
        }
    }
    renderSongList() {
        if (!this.songListTab) return;
        let songs = [...this.songs];
        if (this.sortBy === 'artist') {
            songs.sort((a, b) => a.artist.localeCompare(b.artist));
        } else {
            songs.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (songs.length === 0) {
            this.songListTab.innerHTML = '<div style="color:#b3b3b3;padding:32px 0;">No songs yet. Add some music above.</div>';
            return;
        }
        let html = '<table class="groove-song-table"><thead><tr><th></th><th>Cover</th><th>Title</th><th>Artist</th><th>Album</th><th>Genre</th><th>Duration</th></tr></thead><tbody>';
        songs.forEach((song, idx) => {
            const originalIdx = this.songs.indexOf(song);
            html += `<tr>
                <td><button class="groove-song-play-btn" data-idx="${originalIdx >= 0 ? originalIdx : idx}"><i class="fa fa-play"></i></button></td>
                <td><img src="${song.cover || ''}" class="groove-song-thumb" alt="cover" /></td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.album || 'Unknown Album'}</td>
                <td>${song.genre || 'Unknown Genre'}</td>
                <td>${song.duration}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        this.songListTab.innerHTML = html;
        this.songListTab.querySelectorAll('.groove-song-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                this.playSong(idx);
            });
        });
    }
    renderArtistsPanel() {
        let panel = document.getElementById('artistsTab');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'artistsTab';
            panel.className = 'groove-tab-content';
            panel.style.display = 'none';
            document.querySelector('.groove-main').appendChild(panel);
        }
        // Group by artist
        const artists = {};
        this.songs.forEach(song => {
            if (!artists[song.artist]) artists[song.artist] = [];
            artists[song.artist].push(song);
        });
        let html = '<h1><i class="fa fa-user"></i> Artists</h1>';
        html += '<div class="groove-card-grid">';
        Object.keys(artists).sort().forEach(artist => {
            const cover = artists[artist][0].cover;
            html += `<div class='groove-card'>
                <img src='${cover}' class='groove-card-img' alt='artist cover' />
                <div class='groove-card-title'>${artist}</div>
                <div class='groove-card-meta'>${artists[artist].length} song(s)</div>
            </div>`;
        });
        html += '</div>';
        panel.innerHTML = html;
    }
    renderAlbumsPanel() {
        let panel = document.getElementById('albumsTab');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'albumsTab';
            panel.className = 'groove-tab-content';
            panel.style.display = 'none';
            document.querySelector('.groove-main').appendChild(panel);
        }
        // Group by album
        const albums = {};
        this.songs.forEach(song => {
            if (!albums[song.album]) albums[song.album] = [];
            albums[song.album].push(song);
        });
        let html = '<h1><i class="fa fa-compact-disc"></i> Albums</h1>';
        html += '<div class="groove-card-grid">';
        Object.keys(albums).sort().forEach(album => {
            const cover = albums[album][0].cover;
            html += `<div class='groove-card'>
                <img src='${cover}' class='groove-card-img' alt='album cover' />
                <div class='groove-card-title'>${album}</div>
                <div class='groove-card-meta'>${albums[album][0].artist} <br> ${albums[album].length} song(s)</div>
            </div>`;
        });
        html += '</div>';
        panel.innerHTML = html;
    }
    playSong(idx) {
        if (idx < 0 || idx >= this.songs.length) return;
        const song = this.songs[idx];
        
        // If no audio source, show message
        if (!song.src) {
            alert('No audio file available for this song. Please upload audio files to play them.');
            return;
        }
        
        this.currentSongIndex = idx;
        this.audio.src = song.src;
        this.audio.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Error playing this audio file. It may be corrupted or in an unsupported format.');
        });
        this.isPlaying = true;
        this.updatePlayerBar();
        this.updatePlayPauseIcon();
        this.addToRecentPlays(idx);
    }
    playPrev() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.playSong(this.currentSongIndex);
    }
    playNext() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
            this.playSong(this.currentSongIndex);
    }
    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
            this.isPlaying = true;
        } else {
            this.audio.pause();
            this.isPlaying = false;
        }
        this.updatePlayPauseIcon();
    }
    updatePlayPauseIcon() {
        this.playPauseBtn.innerHTML = this.audio.paused ? '<i class="fa fa-play"></i>' : '<i class="fa fa-pause"></i>';
    }
    updatePlayerBar() {
        const song = this.songs[this.currentSongIndex];
        if (!song) {
            this.playerCover.src = '';
            this.playerTitle.textContent = 'No song';
            this.playerArtist.textContent = '---';
            this.totalTimeDisplay.textContent = '0:00';
            return;
        }
        this.playerCover.src = song.cover || '';
        this.playerTitle.textContent = song.title;
        this.playerArtist.textContent = song.artist;
        this.totalTimeDisplay.textContent = song.duration;
    }
    updateProgress() {
        if (!this.audio.duration) return;
        this.progressBar.value = (this.audio.currentTime / this.audio.duration) * 100;
            this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
    }
    updateDuration() {
        if (!this.audio.duration) return;
            this.totalTimeDisplay.textContent = this.formatTime(this.audio.duration);
    }
    updateVolumeIcon() {
        if (this.audio.muted || this.audio.volume === 0) {
            this.muteBtn.innerHTML = '<i class="fa fa-volume-mute"></i>';
        } else if (this.audio.volume < 0.5) {
            this.muteBtn.innerHTML = '<i class="fa fa-volume-down"></i>';
        } else {
            this.muteBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
        }
    }
    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.updateVolumeIcon();
    }
    getAudioDuration(src, cb) {
        const tempAudio = document.createElement('audio');
        tempAudio.src = src;
        tempAudio.addEventListener('loadedmetadata', function () {
            cb(tempAudio.duration);
        });
    }
    formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    setupSearch() {
        const searchInput = document.getElementById('mainSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchSongs(e.target.value);
            });
        }
    }
    
    searchSongs(query) {
        if (!query.trim()) {
            this.renderSongList();
            return;
        }
        
        const filteredSongs = this.songs.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase()) ||
            song.album.toLowerCase().includes(query.toLowerCase()) ||
            song.genre.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderFilteredSongList(filteredSongs);
    }
    
    renderFilteredSongList(songs) {
        if (!this.songListTab) return;
        
        if (songs.length === 0) {
            this.songListTab.innerHTML = '<div style="color:#b3b3b3;padding:32px 0;">No songs found matching your search.</div>';
            return;
        }
        
        let html = '<table class="groove-song-table"><thead><tr><th></th><th>Cover</th><th>Title</th><th>Artist</th><th>Album</th><th>Genre</th><th>Duration</th></tr></thead><tbody>';
        songs.forEach((song, idx) => {
            const originalIdx = this.songs.indexOf(song);
            html += `<tr>
                <td><button class="groove-song-play-btn" data-idx="${originalIdx}"><i class="fa fa-play"></i></button></td>
                <td><img src="${song.cover}" class="groove-song-thumb" alt="cover" /></td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.album || 'Unknown Album'}</td>
                <td>${song.genre || 'Unknown Genre'}</td>
                <td>${song.duration}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        this.songListTab.innerHTML = html;
        
        this.songListTab.querySelectorAll('.groove-song-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                this.playSong(idx);
            });
        });
    }
    
    // Add playlist functionality
    createPlaylist(name) {
        if (!this.playlists) this.playlists = [];
        const playlist = {
            id: Date.now(),
            name: name,
            songs: [],
            created: new Date()
        };
        this.playlists.push(playlist);
        this.renderPlaylistsPanel();
        return playlist;
    }
    
    addToPlaylist(playlistId, songIndex) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist && this.songs[songIndex]) {
            playlist.songs.push(songIndex);
            this.renderPlaylistsPanel();
        }
    }
    
    renderPlaylistsPanel() {
        const playlistsTab = document.getElementById('playlistsTab');
        if (!playlistsTab) return;
        
        if (!this.playlists || this.playlists.length === 0) {
            playlistsTab.innerHTML = `
                <h1><i class="fa fa-list"></i> Playlists</h1>
                <div class="groove-playlists-placeholder">
                    <p>No playlists yet.</p>
                    <button class="groove-create-playlist-btn" onclick="groovePlayer.showCreatePlaylistDialog()">
                        <i class="fa fa-plus"></i> Create Playlist
                    </button>
                </div>
            `;
            return;
        }
        
        let html = '<h1><i class="fa fa-list"></i> Playlists</h1>';
        html += '<button class="groove-create-playlist-btn" onclick="groovePlayer.showCreatePlaylistDialog()"><i class="fa fa-plus"></i> Create Playlist</button>';
        html += '<div class="groove-card-grid">';
        
        this.playlists.forEach(playlist => {
            html += `<div class='groove-card' onclick="groovePlayer.openPlaylist(${playlist.id})">
                <div class='groove-card-icon'><i class="fa fa-list"></i></div>
                <div class='groove-card-title'>${playlist.name}</div>
                <div class='groove-card-meta'>${playlist.songs.length} song(s)</div>
            </div>`;
        });
        
        html += '</div>';
        playlistsTab.innerHTML = html;
    }
    
    showCreatePlaylistDialog() {
        const name = prompt('Enter playlist name:');
        if (name && name.trim()) {
            this.createPlaylist(name.trim());
        }
    }
    
    openPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;
        
        const playlistSongs = playlist.songs.map(idx => this.songs[idx]).filter(Boolean);
        this.renderFilteredSongList(playlistSongs);
        
        // Switch to songs tab to show playlist content
        document.querySelector('.groove-nav li[data-tab="songs"]').click();
    }
    
    renderFavoritesPanel() {
        const favoritesTab = document.getElementById('favoritesTab');
        if (!favoritesTab) return;
        
        if (!this.favorites || this.favorites.length === 0) {
            favoritesTab.innerHTML = `
                <h1><i class="fa fa-star"></i> Favorites</h1>
                <div class="groove-favorites-placeholder">No favorite songs yet. Click the star icon next to songs to add them to favorites.</div>
            `;
            return;
        }
        
        const favoriteSongs = this.favorites.map(idx => this.songs[idx]).filter(Boolean);
        let html = '<h1><i class="fa fa-star"></i> Favorites</h1>';
        html += '<table class="groove-song-table"><thead><tr><th></th><th>Cover</th><th>Title</th><th>Artist</th><th>Album</th><th>Genre</th><th>Duration</th></tr></thead><tbody>';
        
        favoriteSongs.forEach((song, idx) => {
            const originalIdx = this.songs.indexOf(song);
            html += `<tr>
                <td><button class="groove-song-play-btn" data-idx="${originalIdx}"><i class="fa fa-play"></i></button></td>
                <td><img src="${song.cover || ''}" class="groove-song-thumb" alt="cover" /></td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.album || 'Unknown Album'}</td>
                <td>${song.genre || 'Unknown Genre'}</td>
                <td>${song.duration}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        favoritesTab.innerHTML = html;
        
        favoritesTab.querySelectorAll('.groove-song-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                this.playSong(idx);
            });
        });
    }
    
    renderRecentPanel() {
        const recentTab = document.getElementById('recentTab');
        if (!recentTab) return;
        
        if (!this.recentPlays || this.recentPlays.length === 0) {
            recentTab.innerHTML = `
                <h1><i class="fa fa-history"></i> Recent Plays</h1>
                <div class="groove-recent-placeholder">No recent plays yet.</div>
            `;
            return;
        }
        
        const recentSongs = this.recentPlays.slice(-20).reverse().map(idx => this.songs[idx]).filter(Boolean);
        let html = '<h1><i class="fa fa-history"></i> Recent Plays</h1>';
        html += '<table class="groove-song-table"><thead><tr><th></th><th>Cover</th><th>Title</th><th>Artist</th><th>Album</th><th>Genre</th><th>Duration</th></tr></thead><tbody>';
        
        recentSongs.forEach((song, idx) => {
            const originalIdx = this.songs.indexOf(song);
            html += `<tr>
                <td><button class="groove-song-play-btn" data-idx="${originalIdx}"><i class="fa fa-play"></i></button></td>
                <td><img src="${song.cover || ''}" class="groove-song-thumb" alt="cover" /></td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.album || 'Unknown Album'}</td>
                <td>${song.genre || 'Unknown Genre'}</td>
                <td>${song.duration}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        recentTab.innerHTML = html;
        
        recentTab.querySelectorAll('.groove-song-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                this.playSong(idx);
            });
        });
    }
    
    renderNowPlayingPanel() {
        const nowPlayingTab = document.getElementById('nowPlayingTab');
        if (!nowPlayingTab) return;
        
        const currentSong = this.songs[this.currentSongIndex];
        if (!currentSong) {
            nowPlayingTab.innerHTML = `
                <h1><i class="fa fa-play-circle"></i> Now Playing</h1>
                <div class="groove-nowplaying-placeholder">No song is currently playing.</div>
            `;
            return;
        }
        
        let html = `
            <h1><i class="fa fa-play-circle"></i> Now Playing</h1>
            <div class="groove-now-playing-card">
                <img src="${currentSong.cover || ''}" class="groove-now-playing-cover" alt="cover" />
                <div class="groove-now-playing-info">
                    <h2>${currentSong.title}</h2>
                    <h3>${currentSong.artist}</h3>
                    <p>Album: ${currentSong.album || 'Unknown Album'}</p>
                    <p>Genre: ${currentSong.genre || 'Unknown Genre'}</p>
                    <p>Duration: ${currentSong.duration}</p>
                </div>
            </div>
        `;
        
        nowPlayingTab.innerHTML = html;
    }
    
    // Track recent plays
    addToRecentPlays(songIndex) {
        if (!this.recentPlays) this.recentPlays = [];
        
        // Remove if already exists to avoid duplicates
        const existingIndex = this.recentPlays.indexOf(songIndex);
        if (existingIndex > -1) {
            this.recentPlays.splice(existingIndex, 1);
        }
        
        // Add to end
        this.recentPlays.push(songIndex);
        
        // Keep only last 50 plays
        if (this.recentPlays.length > 50) {
            this.recentPlays = this.recentPlays.slice(-50);
        }
    }
}
window.groovePlayer = new GrooveMusicPlayer();