// Parse URL parameters on load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get('hash');
    
    if (hash) {
        searchByHash(hash);
    }
    
    // Show content locker
    document.getElementById('contentLockerBackground').style.display = 'block';
    document.getElementById('contentLocker').style.display = 'block';
});

async function searchByHash(hash) {
    const contentDisplay = document.getElementById('contentInfo');
    const toolTitle = document.getElementById('tool-title');
    const offersList = document.getElementById('offersList');
    
    try {
        const response = await fetch(`/api/search?hash=${encodeURIComponent(hash)}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch content');
        }
        
        // Update title with content class
        toolTitle.textContent = `${data.content_class} Locked`;
        
        // Display content info
        contentDisplay.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">${escapeHtml(data.title)}</h3>
                ${data.image_url ? `<img src="${escapeHtml(data.image_url)}" alt="Content thumbnail" class="w-full rounded-lg">` : ''}
                <p class="text-gray-600">${escapeHtml(data.description)}</p>
            </div>
        `;
        
        // Load offers
        loadOffers(hash);
        
    } catch (error) {
        console.error('Error:', error);
        contentDisplay.innerHTML = '<p class="text-red-500">Content not found or no longer available.</p>';
    }
}

async function loadOffers(hash) {
    const offersDiv = document.getElementById('offersList');
    
    try {
        // Get client IP and user agent
        const response = await fetch('/api/offers', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch offers');
        }
        
        const offers = await response.json();
        
        // Display offers
        offersDiv.innerHTML = offers.map(offer => `
            <div class="offer-item">
                <li onclick="startOffer('${offer.offerid}', '${hash}')">
                    <span class="lc-checks__feature">${escapeHtml(offer.name_short)}</span>
                </li>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading offers:', error);
        offersDiv.innerHTML = '<p class="text-red-500">Failed to load offers. Please try again later.</p>';
    }
}

function startOffer(offerId, hash) {
    // Mock offer completion - in real implementation, this would redirect to the offer
    alert('In a real implementation, this would redirect to the offer completion page.');
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}