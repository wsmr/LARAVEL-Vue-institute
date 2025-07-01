// AI Chatbot Functionality
class ChatbotManager {
    constructor() {
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatbot = document.getElementById('chatbot');
        this.closeChatbot = document.getElementById('closeChatbot');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendMessage = document.getElementById('sendMessage');
        
        this.isOpen = false;
        this.conversationHistory = [];
        
        this.init();
    }

    init() {
        // Add event listeners
        if (this.chatbotToggle) {
            this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        }

        if (this.closeChatbot) {
            this.closeChatbot.addEventListener('click', () => this.closeChatbotPanel());
        }

        if (this.sendMessage) {
            this.sendMessage.addEventListener('click', () => this.sendUserMessage());
        }

        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendUserMessage();
                }
            });
        }

        // Initialize with welcome message
        this.addBotMessage("Hello! I'm your DIE AI Assistant. I can help you with information about courses, campus facilities, admissions, and more. How can I assist you today?");
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbotPanel();
        } else {
            this.openChatbotPanel();
        }
    }

    openChatbotPanel() {
        if (this.chatbot) {
            this.chatbot.classList.remove('hidden');
            this.isOpen = true;
            
            // Focus on input
            if (this.chatInput) {
                setTimeout(() => this.chatInput.focus(), 100);
            }
        }
    }

    closeChatbotPanel() {
        if (this.chatbot) {
            this.chatbot.classList.add('hidden');
            this.isOpen = false;
        }
    }

    sendUserMessage() {
        const message = this.chatInput?.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addUserMessage(message);
        
        // Clear input
        if (this.chatInput) {
            this.chatInput.value = '';
        }

        // Process message and generate response
        this.processUserMessage(message);
    }

    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.appendMessage(messageElement);
        this.conversationHistory.push({ role: 'user', content: message });
    }

    addBotMessage(message) {
        const messageElement = this.createMessageElement(message, 'bot');
        this.appendMessage(messageElement);
        this.conversationHistory.push({ role: 'bot', content: message });
    }

    createMessageElement(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `p-2 rounded text-sm ${
            sender === 'user' 
                ? 'bg-blue-600 text-white ml-8 self-end' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-8'
        }`;
        messageDiv.textContent = message;
        return messageDiv;
    }

    appendMessage(messageElement) {
        if (this.chatMessages) {
            this.chatMessages.appendChild(messageElement);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    processUserMessage(message) {
        // Show typing indicator
        this.showTypingIndicator();

        // Simulate processing delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'p-2 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mr-8 italic';
        typingDiv.textContent = 'AI Assistant is typing...';
        this.appendMessage(typingDiv);
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Define response patterns
        const responses = {
            // Greetings
            greeting: {
                keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
                responses: [
                    "Hello! Welcome to DIE. How can I help you today?",
                    "Hi there! I'm here to assist you with any questions about our institute.",
                    "Greetings! What would you like to know about DIE?"
                ]
            },
            
            // Courses
            courses: {
                keywords: ['course', 'program', 'study', 'degree', 'diploma', 'curriculum'],
                responses: [
                    "We offer a wide range of courses including Computer Science, Engineering, Business Administration, and Liberal Arts. Would you like specific information about any particular program?",
                    "Our academic programs are designed to meet industry standards. We have undergraduate and postgraduate courses available. Which field interests you?",
                    "DIE provides comprehensive education in various disciplines. You can explore our courses section for detailed information about each program."
                ]
            },
            
            // Admissions
            admissions: {
                keywords: ['admission', 'apply', 'application', 'enroll', 'registration', 'requirements'],
                responses: [
                    "Admissions are open for the next academic year. You can apply online through our website. Do you need information about specific requirements?",
                    "To apply to DIE, you'll need to submit your academic transcripts, personal statement, and meet our entrance requirements. Would you like details about the application process?",
                    "Our admissions team is here to help! Applications can be submitted online. What specific information do you need about the admission process?"
                ]
            },
            
            // Campus
            campus: {
                keywords: ['campus', 'facilities', 'library', 'laboratory', 'sports', 'accommodation'],
                responses: [
                    "Our modern campus features state-of-the-art facilities including a central library, science laboratories, sports complex, and student accommodation. You can take a 3D virtual tour!",
                    "DIE campus is equipped with modern amenities to support your learning experience. We have excellent library resources, well-equipped labs, and recreational facilities.",
                    "The campus offers a vibrant learning environment with all necessary facilities. Would you like to know about any specific facility?"
                ]
            },
            
            // Fees
            fees: {
                keywords: ['fee', 'cost', 'tuition', 'payment', 'scholarship', 'financial'],
                responses: [
                    "Our fee structure varies by program. We also offer scholarships and financial aid for eligible students. Would you like specific information about fees for a particular course?",
                    "Tuition fees depend on the program you choose. We have flexible payment options and scholarship opportunities available. Contact our finance office for detailed information.",
                    "We strive to make quality education affordable. Various financial assistance programs are available. Which program are you interested in?"
                ]
            },
            
            // Technology features
            technology: {
                keywords: ['3d', 'voice search', 'ai', 'technology', 'digital', 'online'],
                responses: [
                    "DIE embraces modern technology! We have 3D campus visualization, voice search capabilities, and AI assistance to enhance your experience.",
                    "Our institute uses cutting-edge technology including virtual reality campus tours, voice-activated search, and AI-powered learning assistance.",
                    "Technology is integrated into our learning environment. You can explore our campus in 3D, use voice commands, and get AI assistance anytime!"
                ]
            },
            
            // Contact
            contact: {
                keywords: ['contact', 'phone', 'email', 'address', 'location', 'visit'],
                responses: [
                    "You can reach us at info@die.edu or call +94 11 234 5678. We're located in Colombo, Sri Lanka. Our admissions office is open Monday to Friday.",
                    "For more information, contact our admissions office at info@die.edu. You can also visit our campus in Colombo for a personal consultation.",
                    "Feel free to contact us! Email: info@die.edu, Phone: +94 11 234 5678. We'd be happy to arrange a campus visit for you."
                ]
            }
        };

        // Find matching response category
        for (const [category, data] of Object.entries(responses)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
                return randomResponse;
            }
        }

        // Default responses for unmatched queries
        const defaultResponses = [
            "That's an interesting question! Could you provide more details so I can assist you better?",
            "I'd be happy to help! Could you rephrase your question or be more specific about what you're looking for?",
            "I'm here to help with information about DIE. Could you tell me more about what you need assistance with?",
            "Let me help you with that! Could you provide more context about your question?",
            "I want to make sure I give you the right information. Could you clarify what specific aspect you're interested in?"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Method to add predefined quick responses
    addQuickResponses() {
        const quickResponsesContainer = document.createElement('div');
        quickResponsesContainer.className = 'flex flex-wrap gap-2 p-2 border-t dark:border-gray-700';
        
        const quickResponses = [
            'Tell me about courses',
            'Admission requirements',
            'Campus facilities',
            'Contact information'
        ];

        quickResponses.forEach(response => {
            const button = document.createElement('button');
            button.className = 'px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors';
            button.textContent = response;
            button.addEventListener('click', () => {
                if (this.chatInput) {
                    this.chatInput.value = response;
                    this.sendUserMessage();
                }
            });
            quickResponsesContainer.appendChild(button);
        });

        if (this.chatbot) {
            this.chatbot.appendChild(quickResponsesContainer);
        }
    }

    // Method to export conversation
    exportConversation() {
        const conversation = this.conversationHistory
            .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n');
        
        const blob = new Blob([conversation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'die-chatbot-conversation.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Method to clear conversation
    clearConversation() {
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '';
        }
        this.conversationHistory = [];
        this.addBotMessage("Conversation cleared! How can I help you today?");
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotManager = new ChatbotManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotManager;
}

