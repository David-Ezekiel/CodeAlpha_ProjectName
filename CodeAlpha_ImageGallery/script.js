
// Professional Image Gallery JavaScript

// DOM Elements
const galleryItems = document.querySelectorAll('.gallery-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const searchInput = document.getElementById('search-input');
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const closeBtn = document.getElementById('close-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const currentImageSpan = document.getElementById('current-image');
const totalImagesSpan = document.getElementById('total-images-lightbox');
const loadMoreBtn = document.getElementById('load-more');
const addImagesBtn = document.getElementById('add-images');
const imageUpload = document.getElementById('image-upload');

// State variables
let currentFilter = 'all';
let currentView = 'grid';
let currentLightboxIndex = 0;
let filteredImages = [];
let isLightboxOpen = false;
let loadedImagesCount = 0;
let totalAvailableImages = 60; // Total images available to load
let userUploadedImages = [];

// Category counts for the new categories
const categoryCounts = {
    'all': 48,
    'nature': 8,
    'urban': 6,
    'wildlife': 5,
    'architecture': 5,
    'abstract': 6,
    'technology': 6,
    'travel': 6,
    'portrait': 4
};

// Initialize the gallery
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupEventListeners();
    setupIntersectionObserver();
    updateImageCounts();
    preloadImages();
    updateTotalImagesCount();
});

// Initialize gallery functionality
function initializeGallery() {
    // Set up initial filtered images array
    filteredImages = Array.from(galleryItems);
    
    // Add loading animation to images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        
        // Add loading state
        img.addEventListener('load', function() {
            this.classList.add('loaded');
            item.classList.add('in-view');
        });
        
        // Add error handling
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400x300/f0f0f0/999999?text=Image+Not+Found';
            this.classList.add('loaded');
            item.classList.add('in-view');
        });
        
        // Add click event for lightbox
        item.addEventListener('click', () => openLightbox(index));
        
        // Add staggered animation delay
        item.style.animationDelay = `${index * 0.05}s`;
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Initialize with grid view
    gallery.classList.add('grid');
}

// Setup all event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilterClick(btn));
    });
    
    // View buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => handleViewChange(btn));
    });
    
    // Search functionality with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });
    
    // Lightbox controls
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadCurrentImage);
    if (shareBtn) shareBtn.addEventListener('click', shareCurrentImage);
    
    // Lightbox keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Close lightbox on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Load more and add images buttons
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', handleLoadMore);
    if (addImagesBtn) addImagesBtn.addEventListener('click', handleAddImages);
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
}

// Handle filter button clicks
function handleFilterClick(btn) {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get filter value
    currentFilter = btn.getAttribute('data-filter');
    
    // Apply filter with animation
    applyFilter(currentFilter);
    
    // Update counts
    updateImageCounts();
}

// Apply filter to gallery items
function applyFilter(filter) {
    const searchTerm = searchInput.value.toLowerCase();
    let visibleCount = 0;
    
    galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const title = item.getAttribute('data-title').toLowerCase();
        const description = item.getAttribute('data-description').toLowerCase();
        
        const matchesFilter = filter === 'all' || category === filter;
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) ||
            category.includes(searchTerm);
        
        if (matchesFilter && matchesSearch) {
            item.classList.remove('filtered-out');
            item.classList.add('filtered-in');
            setTimeout(() => {
                item.style.display = 'block';
            }, index * 30);
            visibleCount++;
        } else {
            item.classList.add('filtered-out');
            item.classList.remove('filtered-in');
            setTimeout(() => {
                item.style.display = 'none';
            }, 200);
        }
    });
    
    // Update filtered images array
    updateFilteredImages();
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount === 0);
}

// Handle search functionality
function handleSearch(searchTerm) {
    applyFilter(currentFilter);
}

// Handle view change (grid/masonry/list)
function handleViewChange(btn) {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentView = btn.getAttribute('data-view');
    
    // Remove all view classes
    gallery.classList.remove('grid', 'masonry', 'list');
    
    // Add new view class with smooth transition
    gallery.style.opacity = '0';
    gallery.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        if (currentView === 'masonry') {
            gallery.classList.add('masonry');
        } else if (currentView === 'list') {
            gallery.classList.add('list');
        } else {
            gallery.classList.add('grid');
        }
        
        // Trigger reflow for masonry
        if (currentView === 'masonry') {
            gallery.style.display = 'none';
            gallery.offsetHeight; // Force reflow
            gallery.style.display = 'block';
        }
        
        // Restore visibility
        gallery.style.opacity = '1';
        gallery.style.transform = 'scale(1)';
    }, 150);
    
    // Update filtered images for new view
    setTimeout(() => {
        updateFilteredImages();
    }, 200);
}

// Update filtered images array
function updateFilteredImages() {
    filteredImages = Array.from(galleryItems).filter(item => 
        item.style.display !== 'none' && !item.classList.contains('filtered-out')
    );
}

// Open lightbox
function openLightbox(index) {
    if (typeof index === 'object') {
        // If called from onclick, find the index
        const item = index.closest('.gallery-item');
        index = Array.from(galleryItems).indexOf(item);
    }
    
    if (index < 0 || index >= filteredImages.length) return;
    
    currentLightboxIndex = index;
    isLightboxOpen = true;
    
    // Update lightbox content
    updateLightboxContent();
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update counter
    updateLightboxCounter();
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    isLightboxOpen = false;
}

// Navigate lightbox
function navigateLightbox(direction) {
    const newIndex = currentLightboxIndex + direction;
    
    if (newIndex >= 0 && newIndex < filteredImages.length) {
        currentLightboxIndex = newIndex;
        updateLightboxContent();
        updateLightboxCounter();
    }
}

// Update lightbox content
function updateLightboxContent() {
    if (currentLightboxIndex >= 0 && currentLightboxIndex < filteredImages.length) {
        const currentItem = filteredImages[currentLightboxIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.getAttribute('data-title');
        const description = currentItem.getAttribute('data-description');
        
        // Update image
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        // Update title and description
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        
        // Show loading state
        lightboxImg.style.opacity = '0';
        lightboxImg.addEventListener('load', function() {
            lightboxImg.style.opacity = '1';
        }, { once: true });
    }
}

// Update lightbox counter
function updateLightboxCounter() {
    currentImageSpan.textContent = currentLightboxIndex + 1;
    totalImagesSpan.textContent = filteredImages.length;
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    if (!isLightboxOpen) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateLightbox(-1);
            break;
        case 'ArrowRight':
            navigateLightbox(1);
            break;
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        lightbox.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Download current image
function downloadCurrentImage() {
    if (currentLightboxIndex >= 0 && currentLightboxIndex < filteredImages.length) {
        const currentItem = filteredImages[currentLightboxIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.getAttribute('data-title');
        
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `${title}.jpg`;
        link.click();
    }
}

// Share current image
function shareCurrentImage() {
    if (currentLightboxIndex >= 0 && currentLightboxIndex < filteredImages.length) {
        const currentItem = filteredImages[currentLightboxIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.getAttribute('data-title');
        const description = currentItem.getAttribute('data-description');
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: description,
                url: img.src
            }).catch(err => {
                fallbackShare(title, description, img.src);
            });
        } else {
            fallbackShare(title, description, img.src);
        }
    }
}

// Fallback share function
function fallbackShare(title, description, imageUrl) {
    const shareText = `${title}: ${description}`;
    const shareUrl = `${window.location.href}?image=${encodeURIComponent(imageUrl)}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    } else {
        showNotification('Share feature not supported in this browser', 'warning');
    }
}

// Update image counts
function updateImageCounts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Count visible images for each category
    const counts = {
        'all': 0,
        'nature': 0,
        'urban': 0,
        'wildlife': 0,
        'architecture': 0,
        'abstract': 0,
        'technology': 0,
        'travel': 0,
        'portrait': 0
    };
    
    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const title = item.getAttribute('data-title').toLowerCase();
        const description = item.getAttribute('data-description').toLowerCase();
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) ||
            category.includes(searchTerm);
        
        if (matchesSearch) {
            counts['all']++;
            if (counts[category] !== undefined) {
                counts[category]++;
            }
        }
    });
    
    // Update count displays
    Object.keys(counts).forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) {
            countElement.textContent = counts[category];
        }
    });
    
    // Update total images count
    const totalImagesElement = document.getElementById('total-images');
    if (totalImagesElement) {
        totalImagesElement.textContent = counts['all'] + userUploadedImages.length;
    }
}

// Update total images count
function updateTotalImagesCount() {
    const totalImagesElement = document.getElementById('total-images');
    if (totalImagesElement) {
        totalImagesElement.textContent = galleryItems.length + userUploadedImages.length;
    }
}

// Setup intersection observer for lazy loading
function setupIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, options);
    
    // Observe all images
    document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
    });
}

// Preload images
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=800&q=80'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Handle window resize
function handleResize() {
    if (currentView === 'masonry') {
        // Trigger masonry reflow
        gallery.style.display = 'none';
        gallery.offsetHeight;
        gallery.style.display = 'block';
    }
}

// Show no results message
function showNoResultsMessage(show) {
    let noResults = document.getElementById('no-results');
    
    if (show) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No images found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            gallery.appendChild(noResults);
        }
        noResults.style.display = 'block';
    } else if (noResults) {
        noResults.style.display = 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    switch(type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
}

// Handle load more button
function handleLoadMore() {
    if (loadMoreBtn.classList.contains('loading')) return;
    
    loadMoreBtn.classList.add('loading');
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    // Simulate loading delay
    setTimeout(() => {
        const imagesToLoad = 12;
        loadMoreImages(imagesToLoad);
        
        loadMoreBtn.classList.remove('loading');
        loadMoreBtn.innerHTML = `
            <i class="fas fa-plus-circle"></i>
            <span class="btn-text">Load More Images</span>
            <span class="btn-count">+${Math.min(12, totalAvailableImages - loadedImagesCount)}</span>
        `;
        
        // Disable button if no more images
        if (loadedImagesCount >= totalAvailableImages) {
            loadMoreBtn.classList.add('disabled');
            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Images Loaded';
        }
    }, 1500);
}

// Load more images
function loadMoreImages(count) {
    const categories = ['nature', 'urban', 'wildlife', 'architecture', 'abstract', 'technology', 'travel', 'portrait'];
    const titles = [
        'Mountain Vista', 'City Lights', 'Wild Eagle', 'Modern Building', 'Abstract Art', 'Tech Innovation', 'Travel Adventure', 'Portrait Study',
        'Forest Canopy', 'Urban Street', 'Lion King', 'Historic Castle', 'Color Splash', 'Digital World', 'Beach Sunset', 'Fashion Model',
        'River Flow', 'Skyscraper', 'Elephant Herd', 'Ancient Temple', 'Geometric Shapes', 'AI Future', 'Mountain Peak', 'Street Artist'
    ];
    
    for (let i = 0; i < count && loadedImagesCount < totalAvailableImages; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const imageUrl = `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?auto=format&fit=crop&w=800&q=80`;
        
        const galleryItem = createGalleryItem(title, `Beautiful ${category} photography`, category, imageUrl);
        gallery.appendChild(galleryItem);
        
        loadedImagesCount++;
    }
    
    // Update counts
    updateImageCounts();
    updateTotalImagesCount();
    
    // Show notification
    showNotification(`Loaded ${count} new images!`, 'success');
}

// Create gallery item
function createGalleryItem(title, description, category, imageUrl) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-category', category);
    item.setAttribute('data-title', title);
    item.setAttribute('data-description', description);
    
    item.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" alt="${title}" loading="lazy">
            <div class="image-overlay">
                <div class="overlay-content">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="overlay-actions">
                        <button class="action-btn" onclick="openLightbox(this)">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button class="action-btn" onclick="downloadImage(this)">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="action-btn" onclick="shareImage(this)">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const img = item.querySelector('img');
    img.addEventListener('load', function() {
        this.classList.add('loaded');
        item.classList.add('in-view');
    });
    
    item.addEventListener('click', () => {
        const index = Array.from(galleryItems).indexOf(item);
        openLightbox(index);
    });
    
    return item;
}

// Handle add images button
function handleAddImages() {
    if (imageUpload) {
        imageUpload.click();
    }
}

// Handle image upload
function handleImageUpload(event) {
    const files = event.target.files;
    
    if (files.length === 0) return;
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const title = `Uploaded Image ${userUploadedImages.length + 1}`;
                const description = `User uploaded image`;
                const category = 'user-upload';
                
                const galleryItem = createGalleryItem(title, description, category, e.target.result);
                gallery.appendChild(galleryItem);
                
                userUploadedImages.push({
                    title,
                    description,
                    category,
                    url: e.target.result
                });
                
                // Update counts
                updateImageCounts();
                updateTotalImagesCount();
                
                // Show notification
                showNotification(`Image "${title}" uploaded successfully!`, 'success');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Reset file input
    event.target.value = '';
}

// Global functions for onclick handlers
window.openLightbox = function(element) {
    const item = element.closest('.gallery-item');
    const index = Array.from(galleryItems).indexOf(item);
    openLightbox(index);
};

window.downloadImage = function(element) {
    const item = element.closest('.gallery-item');
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title');
    
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `${title}.jpg`;
    link.click();
    
    showNotification(`Downloading "${title}"...`, 'success');
};

window.shareImage = function(element) {
    const item = element.closest('.gallery-item');
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title');
    const description = item.getAttribute('data-description');
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: description,
            url: img.src
        }).catch(err => {
            fallbackShare(title, description, img.src);
        });
    } else {
        fallbackShare(title, description, img.src);
    }
};
