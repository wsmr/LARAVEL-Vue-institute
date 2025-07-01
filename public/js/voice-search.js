// Voice Search Functionality
class VoiceSearchManager {
    constructor() {
        this.voiceSearchBtn = document.getElementById('voiceSearchBtn');
        this.voiceSearchModal = document.getElementById('voiceSearchModal');
        this.closeVoiceSearch = document.getElementById('closeVoiceSearch');
        this.voiceSearchResult = document.getElementById('voiceSearchResult');
        
        this.recognition = null;
        this.isListening = false;
        
        this.init();
    }

    init() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.setupSpeechRecognition();
        } else {
            console.warn('Speech recognition not supported in this browser');
            if (this.voiceSearchBtn) {
                this.voiceSearchBtn.style.display = 'none';
            }
            return;
        }

        // Add event listeners
        if (this.voiceSearchBtn) {
            this.voiceSearchBtn.addEventListener('click', () => this.startVoiceSearch());
        }

        if (this.closeVoiceSearch) {
            this.closeVoiceSearch.addEventListener('click', () => this.closeModal());
        }

        if (this.voiceSearchModal) {
            this.voiceSearchModal.addEventListener('click', (e) => {
                if (e.target === this.voiceSearchModal) {
                    this.closeModal();
                }
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + Shift + V)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                this.startVoiceSearch();
            }
        });
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('Listening... Speak now!');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const displayText = finalTranscript || interimTranscript;
            this.updateUI(`You said: "${displayText}"`);

            if (finalTranscript) {
                this.processVoiceCommand(finalTranscript.trim());
            }
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            let errorMessage = 'Speech recognition error: ';
            
            switch (event.error) {
                case 'no-speech':
                    errorMessage += 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage += 'Microphone not accessible. Please check permissions.';
                    break;
                case 'not-allowed':
                    errorMessage += 'Microphone access denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage += 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage += event.error;
            }
            
            this.updateUI(errorMessage);
            setTimeout(() => this.closeModal(), 3000);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };
    }

    startVoiceSearch() {
        if (!this.recognition) {
            alert('Voice search is not supported in your browser.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            return;
        }

        this.showModal();
        this.updateUI('Initializing microphone...');
        
        try {
            this.recognition.start();
        } catch (error) {
            this.updateUI('Error starting voice recognition. Please try again.');
            console.error('Voice recognition error:', error);
        }
    }

    processVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Define voice commands and their actions
        const commands = {
            'courses': () => this.scrollToSection('courses'),
            'course': () => this.scrollToSection('courses'),
            'campus': () => this.scrollToSection('campus'),
            'campus tour': () => this.scrollToSection('campus'),
            'about': () => this.scrollToSection('about'),
            'contact': () => this.scrollToSection('contact'),
            'home': () => this.scrollToSection('home'),
            'dark mode': () => this.toggleDarkMode(),
            'light mode': () => this.toggleLightMode(),
            'chatbot': () => this.openChatbot(),
            'chat': () => this.openChatbot(),
            'help': () => this.showHelp(),
        };

        // Search for matching command
        let commandExecuted = false;
        for (const [keyword, action] of Object.entries(commands)) {
            if (lowerCommand.includes(keyword)) {
                this.updateUI(`Executing: ${keyword}`);
                action();
                commandExecuted = true;
                break;
            }
        }

        // If no specific command found, perform general search
        if (!commandExecuted) {
            this.performSearch(command);
        }

        // Close modal after a delay
        setTimeout(() => this.closeModal(), 2000);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.updateUI(`Section "${sectionId}" not found.`);
        }
    }

    toggleDarkMode() {
        if (window.darkModeManager) {
            window.darkModeManager.enableDarkMode();
        }
    }

    toggleLightMode() {
        if (window.darkModeManager) {
            window.darkModeManager.enableLightMode();
        }
    }

    openChatbot() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        if (chatbotToggle) {
            chatbotToggle.click();
        }
    }

    showHelp() {
        const helpText = `
            Voice commands you can use:
            • "Courses" - View available courses
            • "Campus" or "Campus tour" - View 3D campus
            • "Dark mode" / "Light mode" - Toggle theme
            • "Chatbot" or "Chat" - Open AI assistant
            • "Home", "About", "Contact" - Navigate to sections
            • Or just say what you're looking for!
        `;
        this.updateUI(helpText);
    }

    performSearch(query) {
        this.updateUI(`Searching for: "${query}"`);
        
        // Simple search implementation
        const searchableContent = document.body.textContent.toLowerCase();
        if (searchableContent.includes(query.toLowerCase())) {
            this.updateUI(`Found content related to "${query}"`);
            this.highlightSearchTerm(query);
        } else {
            this.updateUI(`No results found for "${query}". Try different keywords.`);
        }
    }

    highlightSearchTerm(term) {
        // Simple highlighting implementation
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(term.toLowerCase())) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            const text = textNode.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            const highlightedText = text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600">$1</mark>');
            
            if (highlightedText !== text) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedText;
                parent.replaceChild(wrapper, textNode);
                
                // Remove highlights after 5 seconds
                setTimeout(() => {
                    const marks = wrapper.querySelectorAll('mark');
                    marks.forEach(mark => {
                        mark.outerHTML = mark.innerHTML;
                    });
                }, 5000);
            }
        });
    }

    showModal() {
        if (this.voiceSearchModal) {
            this.voiceSearchModal.classList.remove('hidden');
            this.voiceSearchModal.classList.add('flex');
        }
    }

    closeModal() {
        if (this.voiceSearchModal) {
            this.voiceSearchModal.classList.add('hidden');
            this.voiceSearchModal.classList.remove('flex');
        }
        
        if (this.isListening && this.recognition) {
            this.recognition.stop();
        }
    }

    updateUI(message) {
        if (this.voiceSearchResult) {
            this.voiceSearchResult.textContent = message;
        }
    }
}

// Initialize voice search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceSearchManager = new VoiceSearchManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceSearchManager;
}

