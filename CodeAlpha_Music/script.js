document.addEventListener('DOMContentLoaded', function() {
// Simple static playlist
const playlist = [
  {
    title: 'Paradoxum Calm',
    artist: 'Allen Smith',
    url: 'assets/songs/track1.mp3',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=400&h=400&q=80'
  },
  {
    title: 'Dreamscape',
    artist: 'Luna Wave',
    url: 'assets/songs/track2.mp3',
    cover: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&q=80'
  },
  {
    title: 'Night Drive',
    artist: 'Synth Rider',
    url: 'assets/songs/track3.mp3',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80'
  }
];

let current = 0;
let isPlaying = false;

const audio = document.getElementById('audio');
const playpauseBtn = document.getElementById('playpause');
const playpauseIcon = playpauseBtn.querySelector('i');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');
const titleEl = document.getElementById('track-title');
const artistEl = document.getElementById('track-artist');
const coverEl = document.querySelector('.album-art img');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const playlistEl = document.getElementById('playlist');
const autoplayCheckbox = document.getElementById('autoplay');
const volumeBar = document.getElementById('volume-bar');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabSections = document.querySelectorAll('.tab-section');
const recentsSection = document.getElementById('recents-section');
const favouritesSection = document.getElementById('favourites-section');
const addSongForm = document.getElementById('add-song-form');
const songTitleInput = document.getElementById('song-title-input');
const songArtistInput = document.getElementById('song-artist-input');
const songUrlInput = document.getElementById('song-url-input');
const songCoverInput = document.getElementById('song-cover-input');
const openAddSongModalBtn = document.getElementById('open-add-song-modal');
const addSongModal = document.getElementById('add-song-modal');
const closeAddSongModalBtn = document.getElementById('close-add-song-modal');
const songFileInput = document.getElementById('song-file-input');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggleBtn.querySelector('i');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = muteBtn.querySelector('i');

let recents = [];
let favourites = [];

function formatTime(sec) {
  if (isNaN(sec) || sec === Infinity) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function loadTrack(idx) {
  const track = playlist[idx];
  audio.src = track.url;
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  coverEl.src = track.cover;
  progressBar.value = 0;
  currentTimeEl.textContent = '00:00';
  totalDurationEl.textContent = '00:00';
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playpauseIcon.classList.remove('fa-play');
  playpauseIcon.classList.add('fa-pause');
  addToRecents(current);
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playpauseIcon.classList.remove('fa-pause');
  playpauseIcon.classList.add('fa-play');
}

playpauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
});

// Tab switching logic
function activateTab(tab) {
  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  tabSections.forEach(sec => sec.classList.remove('active'));
  document.getElementById(tab + '-section').classList.add('active');
}
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// Add to recents when a song is played
function addToRecents(idx) {
  const track = playlist[idx];
  // Remove if already in recents
  recents = recents.filter(t => t.title !== track.title || t.artist !== track.artist);
  recents.unshift(track);
  if (recents.length > 10) recents = recents.slice(0, 10);
  renderRecents();
}

// Toggle favourite
function toggleFavourite(idx) {
  const track = playlist[idx];
  const i = favourites.findIndex(t => t.title === track.title && t.artist === track.artist);
  if (i === -1) {
    favourites.unshift(track);
  } else {
    favourites.splice(i, 1);
  }
  renderFavourites();
  renderPlaylist();
}

function isFavourite(track) {
  return favourites.some(t => t.title === track.title && t.artist === track.artist);
}

function playSongAtIndex(idx) {
  current = idx;
  loadTrack(current);
  audio.currentTime = 0;
  playTrack();
  renderPlaylist();
  addToRecents(current);
}

// Render recents
function renderRecents() {
  recentsSection.innerHTML = '';
  if (recents.length === 0) {
    recentsSection.innerHTML = '<div class="empty-msg">No recent tracks.</div>';
    return;
  }
  const ul = document.createElement('ul');
  recents.forEach((track, idx) => {
    const li = document.createElement('li');
    li.textContent = `${track.artist} – ${track.title}`;
    li.className = 'recent-item';
    li.addEventListener('click', () => {
      const playlistIdx = playlist.findIndex(t => t.title === track.title && t.artist === track.artist);
      if (playlistIdx !== -1) {
        playSongAtIndex(playlistIdx);
      }
    });
    ul.appendChild(li);
  });
  recentsSection.appendChild(ul);
}

// Render favourites
function renderFavourites() {
  favouritesSection.innerHTML = '';
  if (favourites.length === 0) {
    favouritesSection.innerHTML = '<div class="empty-msg">No favourites yet.</div>';
    return;
  }
  const ul = document.createElement('ul');
  favourites.forEach((track, idx) => {
    const li = document.createElement('li');
    li.textContent = `${track.artist} – ${track.title}`;
    li.className = 'favourite-item';
    li.addEventListener('click', () => {
      const playlistIdx = playlist.findIndex(t => t.title === track.title && t.artist === track.artist);
      if (playlistIdx !== -1) {
        playSongAtIndex(playlistIdx);
      }
    });
    ul.appendChild(li);
  });
  favouritesSection.appendChild(ul);
}

// Update playlist rendering to use playSongAtIndex
function renderPlaylist() {
  playlistEl.innerHTML = '';
  playlist.forEach((track, idx) => {
    const li = document.createElement('li');
    li.textContent = `${track.artist} – ${track.title}`;
    if (idx === current) li.classList.add('active');
    li.addEventListener('click', () => {
      playSongAtIndex(idx);
    });
    // Heart button
    const favBtn = document.createElement('button');
    favBtn.className = 'fav-btn';
    favBtn.innerHTML = isFavourite(track) ? '♥' : '♡';
    favBtn.title = isFavourite(track) ? 'Remove from favourites' : 'Add to favourites';
    favBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavourite(idx);
    });
    li.appendChild(favBtn);
    playlistEl.appendChild(li);
  });
}

addSongForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const title = songTitleInput.value.trim();
  const artist = songArtistInput.value.trim();
  const url = songUrlInput.value.trim();
  const file = songFileInput.files[0];
  const cover = songCoverInput.value.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=400&h=400&q=80';

  let audioSrc = '';
  if (file) {
    if (!file.type.startsWith('audio/')) {
      alert('Please select a valid audio file.');
      return;
    }
    audioSrc = URL.createObjectURL(file);
  } else if (url) {
    if (!url.match(/\.(mp3|wav|ogg)(\?.*)?$/i)) {
      alert('Please provide a valid audio URL (mp3, wav, ogg).');
      return;
    }
    audioSrc = url;
  } else {
    alert('Please provide an audio file or a valid audio URL.');
    return;
  }
  if (!title || !artist) {
    alert('Please provide both a title and artist.');
    return;
  }
  playlist.push({ title, artist, url: audioSrc, cover });
  renderPlaylist();
  // Optionally, clear the form
  songTitleInput.value = '';
  songArtistInput.value = '';
  songUrlInput.value = '';
  songFileInput.value = '';
  songCoverInput.value = '';
  // Close modal after adding
  addSongModal.classList.remove('show');
  document.body.style.overflow = '';
});

openAddSongModalBtn.addEventListener('click', () => {
  addSongModal.classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(() => songTitleInput.focus(), 100);
});
closeAddSongModalBtn.addEventListener('click', () => {
  addSongModal.classList.remove('show');
  document.body.style.overflow = '';
});
addSongModal.addEventListener('click', (e) => {
  if (e.target === addSongModal) {
    addSongModal.classList.remove('show');
    document.body.style.overflow = '';
  }
});

songFileInput.addEventListener('change', function() {
  const file = songFileInput.files[0];
  if (!file) return;
  // Only autofill if fields are empty
  if (!songTitleInput.value || !songArtistInput.value) {
    // Remove extension
    let name = file.name.replace(/\.[^/.]+$/, '');
    let title = name;
    let artist = '';
    // Try to split by ' - '
    if (name.includes(' - ')) {
      const parts = name.split(' - ');
      // Assume 'Artist - Title' or 'Title - Artist'
      if (!songTitleInput.value && !songArtistInput.value) {
        // Default: first part is title, second is artist
        title = parts[0];
        artist = parts.slice(1).join(' - ');
      }
      // If user has typed artist, only fill title
      if (!songTitleInput.value && songArtistInput.value) {
        title = parts[0];
      }
      // If user has typed title, only fill artist
      if (songTitleInput.value && !songArtistInput.value) {
        artist = parts.slice(1).join(' - ');
      }
    }
    if (!songTitleInput.value) songTitleInput.value = title;
    if (!songArtistInput.value) songArtistInput.value = artist;
  }
  // Show format as a note
  const format = file.name.split('.').pop().toLowerCase();
  let note = document.querySelector('.add-song-format-note');
  if (!note) {
    note = document.createElement('div');
    note.className = 'add-song-format-note';
    songFileInput.parentNode.insertBefore(note, songFileInput.nextSibling);
  }
  note.textContent = `Format: .${format}`;
});

audio.addEventListener('ended', () => {
  if (autoplayCheckbox.checked) {
    current = (current + 1) % playlist.length;
    loadTrack(current);
    playTrack();
    renderPlaylist();
  }
});

// Update playlist highlight on track change
function updateOnTrackChange() {
  renderPlaylist();
}

// Update playlist on next/prev
prevBtn.addEventListener('click', () => {
  current = (current - 1 + playlist.length) % playlist.length;
  loadTrack(current);
  playTrack();
  updateOnTrackChange();
});

nextBtn.addEventListener('click', () => {
  current = (current + 1) % playlist.length;
  loadTrack(current);
  playTrack();
  updateOnTrackChange();
});

// Also update on playpause (in case of click on playlist)
playpauseBtn.addEventListener('click', () => {
  updateOnTrackChange();
});

audio.addEventListener('loadedmetadata', () => {
  totalDurationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalDurationEl.textContent = formatTime(audio.duration);
  }
});

progressBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

if (volumeBar) {
  volumeBar.addEventListener('input', function() {
    audio.volume = parseFloat(this.value);
  });
  // Set initial volume
  audio.volume = parseFloat(volumeBar.value);
}

muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  if (audio.muted) {
    muteIcon.classList.remove('fa-volume-up');
    muteIcon.classList.add('fa-volume-xmark');
  } else {
    muteIcon.classList.remove('fa-volume-xmark');
    muteIcon.classList.add('fa-volume-up');
  }
});

function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleIcon.classList.remove('fa-moon');
    themeToggleIcon.classList.add('fa-sun');
  } else {
    document.body.classList.remove('dark-mode');
    themeToggleIcon.classList.remove('fa-sun');
    themeToggleIcon.classList.add('fa-moon');
  }
  localStorage.setItem('daves-music-player-theme', mode);
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(isDark ? 'light' : 'dark');
});

// On load, restore theme
const savedTheme = localStorage.getItem('daves-music-player-theme');
if (savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  setTheme('dark');
} else {
  setTheme('light');
}

// Force dark mode and keep it
setTheme('dark');
themeToggleBtn.style.display = 'none';

// Initial load
loadTrack(current);
pauseTrack();
renderPlaylist();
renderRecents();
renderFavourites();

});
