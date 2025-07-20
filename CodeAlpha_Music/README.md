# Groove Music Player

A modern, responsive music player web application built with HTML, CSS, and JavaScript. Inspired by Microsoft Groove Music with a sleek dark theme using the color #0f172a.

## 🎵 Features

### Core Functionality

- **Audio Playback**: Play, pause, previous, next controls
- **Playlist Management**: Add, remove, and organize your music files
- **Progress Control**: Click or drag to seek through songs
- **Volume Control**: Adjustable volume with mute functionality
- **Shuffle & Repeat**: Multiple playback modes (off, all, one)
- **Playback Speed**: Adjustable speed from 0.5x to 2x
- **Autoplay**: Automatic progression through playlist
- **Song Information**: Title, artist, duration, and track counter

### User Experience

- **Modern Design**: Glassmorphism UI with smooth animations
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Drag & Drop**: Intuitive file upload interface
- **Search Functionality**: Find songs quickly in your playlist
- **Visual Feedback**: Loading states and error handling

### Visual Features

- **Rotating Album Art**: Animated cover art during playback
- **Gradient Backgrounds**: Beautiful color schemes
- **Smooth Transitions**: Professional animations throughout
- **Custom Scrollbars**: Styled playlist scrolling
- **Hover Effects**: Interactive button and element states

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Audio files in supported formats (MP3, WAV, OGG, etc.)

### Installation

1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start uploading and playing your music!

### Usage

#### Adding Music

1. Click the "Playlist" button to open the playlist panel
2. Click "Add Songs" to select audio files from your computer
3. Your music will be added to the playlist automatically

#### Controls

- **Play/Pause**: Click the center button or press Space
- **Previous/Next**: Use arrow buttons or Left/Right arrow keys
- **Volume**: Use the volume slider or Up/Down arrow keys
- **Mute**: Click the volume icon or press 'M'
- **Shuffle**: Click the shuffle button to randomize playback
- **Repeat**: Click the repeat button to cycle through modes
- **Playback Speed**: Click the speed button to cycle through speeds (0.5x to 2x)
- **Progress**: Click or drag the progress bar to seek
- **Playlist**: Click playlist button to manage your music library

#### Keyboard Shortcuts

- `Space` - Play/Pause
- `←` - Previous song
- `→` - Next song
- `↑` - Increase volume
- `↓` - Decrease volume
- `M` - Mute/Unmute

## 🎨 Design Features

### Glassmorphism UI

- Translucent backgrounds with backdrop blur
- Subtle borders and shadows
- Modern, clean aesthetic

### Color Scheme

- Primary: Gold gradient (#ffd700 to #ffed4e)
- Background: Purple gradient (#667eea to #764ba2 to #f093fb)
- Accents: White with transparency

### Animations

- Smooth transitions on all interactive elements
- Rotating album art during playback
- Hover effects and micro-interactions
- Loading spinners and progress indicators

## 📱 Responsive Design

The music player is fully responsive and optimized for:

- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🔧 Technical Details

### Technologies Used

- **HTML5**: Semantic markup and audio element
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript ES6+**: Class-based architecture
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Audio Formats Supported

- MP3
- WAV
- OGG
- AAC
- FLAC (browser dependent)

## 🛠️ Customization

### Changing Colors

Edit the CSS variables in `style.css`:

```css
:root {
  --primary-color: #ffd700;
  --secondary-color: #ffed4e;
  --background-gradient: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 50%,
    #f093fb 100%
  );
}
```

### Adding Features

The modular JavaScript architecture makes it easy to add new features:

- Extend the `MusicPlayer` class
- Add new event listeners
- Implement additional audio controls

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the project repository.

---

**Enjoy your music! 🎵**
