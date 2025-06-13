// DOM Elements
const chatPane = document.getElementById('chatPane');
const collapseBtn = document.getElementById('collapseBtn');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const chatMessages = document.getElementById('chatMessages');

// State
let isCollapsed = false;
let messageCounter = 0;

// Initialize the application
function init() {
    setupEventListeners();
    focusInput();
}

// Event Listeners
function setupEventListeners() {
    // Collapse/expand chat pane
    collapseBtn.addEventListener('click', toggleChatPane);
    
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    
    // Reset demo
    resetBtn.addEventListener('click', resetDemo);
    
    // Enable/disable send button based on input
    chatInput.addEventListener('input', toggleSendButton);
    
    // Navigation menu interactions
    setupNavigationEvents();
}

// Toggle chat pane collapse/expand
function toggleChatPane() {
    isCollapsed = !isCollapsed;
    chatPane.classList.toggle('collapsed', isCollapsed);
    
    // Update button accessibility
    collapseBtn.setAttribute('aria-expanded', !isCollapsed);
    
    // Focus input when expanding
    if (!isCollapsed) {
        setTimeout(() => focusInput(), 300);
    }
}

// Send message functionality
function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Create user message
    addMessage('user', message);
    
    // Clear input
    chatInput.value = '';
    toggleSendButton();
    
    // Simulate LLM response after a short delay
    setTimeout(() => {
        const responses = [
            "This is a placeholder response from the LLM.",
            "I understand your message. This is a demo response.",
            "Thank you for your input. This is a simulated AI response.",
            "I'm processing your request. This is a sample reply.",
            "Your message has been received. Here's a demo response."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage('llm', randomResponse);
    }, 500 + Math.random() * 1000);
    
    // Focus back on input
    focusInput();
}

// Add message to chat
function addMessage(type, content) {
    messageCounter++;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.setAttribute('role', 'log');
    messageDiv.setAttribute('aria-live', 'polite');
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = type === 'user' ? 'You' : 'Assistant';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 50);
}

// Reset demo functionality
function resetDemo() {
    // Clear chat messages
    chatMessages.innerHTML = '';
    
    // Clear input
    chatInput.value = '';
    
    // Reset message counter
    messageCounter = 0;
    
    // Expand chat pane if collapsed
    if (isCollapsed) {
        toggleChatPane();
    }
    
    // Focus input
    focusInput();
    
    // Update send button state
    toggleSendButton();
    
    // Show confirmation (optional)
    console.log('Demo reset successfully');
}

// Toggle send button state
function toggleSendButton() {
    const hasText = chatInput.value.trim().length > 0;
    sendBtn.disabled = !hasText;
}

// Focus input field
function focusInput() {
    if (!isCollapsed) {
        chatInput.focus();
    }
}

// Setup navigation menu events
function setupNavigationEvents() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Log navigation (in a real app, this would route to different pages)
            console.log(`Navigated to ${this.textContent}`);
        });
        
        // Add keyboard navigation
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        
        item.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

// Utility function to handle responsive behavior
function handleResize() {
    // Adjust chat pane behavior on mobile
    if (window.innerWidth < 768 && !isCollapsed) {
        // Could add mobile-specific behavior here
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize
window.addEventListener('resize', handleResize);

// Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to collapse chat
    if (event.key === 'Escape' && !isCollapsed) {
        toggleChatPane();
    }
    
    // Ctrl/Cmd + R to reset (prevent default browser refresh)
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        resetDemo();
    }
});