// DOM Elements
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('preview-modal');
const previewFrame = document.getElementById('preview-frame');
const modalTitle = document.getElementById('modal-title');
const openFullProjectBtn = document.getElementById('open-full-project');
// Removed themeToggle

// Project data
const projects = {
    gallery: {
        title: 'Image Gallery',
        folder: 'CodeAlpha_ImageGallery',
        description: 'Interactive Photo Gallery with Lightbox'
    },
    calculator: {
        title: 'Calculator',
        folder: 'CodeAlpha_Calculator',
        description: 'Functional Calculator with Modern UI'
    },
    portfolio: {
        title: 'Portfolio Website',
        folder: 'CodeAlpha_Portfolio',
        description: 'Personal Portfolio Showcase'
    },
    music: {
        title: 'Music Player',
        folder: 'CodeAlpha_Music',
        description: 'Interactive Audio Player'
    }
};

// Removed theme management code

// Initialize the application
// Only keep the DOMContentLoaded for console log

document.addEventListener('DOMContentLoaded', function() {
    console.log('CodeAlpha Projects Dashboard loaded');
});

// Open project in new tab/window
function openProject(folderName) {
    const projectUrl = `./${folderName}/index.html`;
    
    // Add loading state
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Opening...';
    button.disabled = true;

    // Simulate loading delay
    setTimeout(() => {
        window.open(projectUrl, '_blank');
        button.innerHTML = originalText;
        button.disabled = false;
    }, 500);
}

// Preview project in modal
function previewProject(projectType) {
    const project = projects[projectType];
    if (!project) return;

    modalTitle.textContent = `${project.title} - Preview`;
    previewFrame.src = `./${project.folder}/index.html`;
    
    // Set up the full project button
    openFullProjectBtn.onclick = () => openProject(project.folder);
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Add fade-in animation
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transition = 'opacity 0.3s ease';
    }, 10);
}

// Close preview modal
function closePreview() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        previewFrame.src = '';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closePreview();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closePreview();
    }
});

// Loading Animation
const loadingStyles = `
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);