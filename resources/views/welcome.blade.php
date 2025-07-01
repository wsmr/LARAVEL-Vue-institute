<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Diyawanna Institute of Education - Advanced educational institute with modern features">
    
    <title>Diyawanna Institute of Education (DIE)</title>
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#1f2937">
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <link rel="apple-touch-icon" href="{{ asset('icons/icon-192x192.png') }}">
    
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/dark-mode.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Three.js for 3D Campus -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">DIE</h1>
                    </div>
                    <div class="hidden md:ml-6 md:flex md:space-x-8">
                        <a href="#home" class="nav-link">Home</a>
                        <a href="#courses" class="nav-link">Courses</a>
                        <a href="#campus" class="nav-link">Campus</a>
                        <a href="#about" class="nav-link">About</a>
                        <a href="#contact" class="nav-link">Contact</a>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    <!-- Voice Search Button -->
                    <button id="voiceSearchBtn" class="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                        <i class="fas fa-microphone"></i>
                    </button>
                    
                    <!-- Dark Mode Toggle -->
                    <button id="darkModeToggle" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <i class="fas fa-moon dark:hidden"></i>
                        <i class="fas fa-sun hidden dark:inline"></i>
                    </button>
                    
                    <!-- Chatbot Toggle -->
                    <button id="chatbotToggle" class="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                        <i class="fas fa-robot"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="pt-16 min-h-screen flex items-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div class="text-center" data-aos="fade-up">
                <h1 class="text-5xl md:text-7xl font-bold mb-6">
                    Diyawanna Institute of Education
                </h1>
                <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                    Advanced educational institute with cutting-edge technology and modern learning experiences
                </p>
                <div class="space-x-4">
                    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Explore Courses
                    </button>
                    <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                        Virtual Tour
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Modern Features</h2>
                <p class="text-xl text-gray-600 dark:text-gray-300">Experience education with cutting-edge technology</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="text-4xl text-blue-600 mb-4">
                        <i class="fas fa-cube"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">3D Campus Tour</h3>
                    <p class="text-gray-600 dark:text-gray-300">Explore our campus in immersive 3D visualization</p>
                </div>
                
                <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                    <div class="text-4xl text-green-600 mb-4">
                        <i class="fas fa-microphone"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Voice Search</h3>
                    <p class="text-gray-600 dark:text-gray-300">Find courses and information using voice commands</p>
                </div>
                
                <div class="feature-card" data-aos="fade-up" data-aos-delay="300">
                    <div class="text-4xl text-purple-600 mb-4">
                        <i class="fas fa-robot"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI Assistant</h3>
                    <p class="text-gray-600 dark:text-gray-300">Get instant help from our AI-powered chatbot</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 3D Campus Section -->
    <section id="campus" class="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">3D Campus Visualization</h2>
                <p class="text-xl text-gray-600 dark:text-gray-300">Take a virtual tour of our modern campus</p>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8" data-aos="fade-up">
                <div id="campus3D" class="w-full h-96 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <!-- 3D Campus will be rendered here -->
                </div>
                <div class="mt-4 text-center">
                    <p class="text-gray-600 dark:text-gray-300">Use mouse to rotate and zoom the 3D campus model</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Courses Section -->
    <section id="courses" class="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Courses</h2>
                <p class="text-xl text-gray-600 dark:text-gray-300">Discover our comprehensive educational programs</p>
            </div>
            
            <div id="coursesContainer" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Courses will be loaded here -->
            </div>
        </div>
    </section>

    <!-- Voice Search Modal -->
    <div id="voiceSearchModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <div class="text-center">
                <div class="text-6xl text-blue-600 mb-4">
                    <i class="fas fa-microphone pulse"></i>
                </div>
                <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Voice Search</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">Say something to search...</p>
                <div id="voiceSearchResult" class="text-sm text-gray-500 dark:text-gray-400 mb-4"></div>
                <button id="closeVoiceSearch" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!-- AI Chatbot -->
    <div id="chatbot" class="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl hidden z-40 transition-all duration-300">
        <div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 class="font-bold">DIE AI Assistant</h3>
            <button id="closeChatbot" class="text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div id="chatMessages" class="h-64 overflow-y-auto p-4 space-y-2">
            <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm">
                Hello! I'm your AI assistant. How can I help you today?
            </div>
        </div>
        <div class="p-4 border-t dark:border-gray-700">
            <div class="flex space-x-2">
                <input type="text" id="chatInput" placeholder="Type your message..." 
                       class="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <button id="sendMessage" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">DIE</h3>
                    <p class="text-gray-400">Diyawanna Institute of Education - Shaping the future through innovative learning.</p>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#courses" class="hover:text-white transition-colors">Courses</a></li>
                        <li><a href="#campus" class="hover:text-white transition-colors">Campus</a></li>
                        <li><a href="#about" class="hover:text-white transition-colors">About</a></li>
                        <li><a href="#contact" class="hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Features</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li>3D Campus Tour</li>
                        <li>Voice Search</li>
                        <li>AI Assistant</li>
                        <li>PWA Support</li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Contact</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><i class="fas fa-envelope mr-2"></i>info@die.edu</li>
                        <li><i class="fas fa-phone mr-2"></i>+94 11 234 5678</li>
                        <li><i class="fas fa-map-marker-alt mr-2"></i>Colombo, Sri Lanka</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 Diyawanna Institute of Education. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/animations.js') }}"></script>
    <script src="{{ asset('js/threejs-campus.js') }}"></script>
    <script src="{{ asset('js/voice-search.js') }}"></script>
    <script src="{{ asset('js/chatbot.js') }}"></script>
    <script src="{{ asset('js/dark-mode.js') }}"></script>
    <script src="{{ asset('js/pwa.js') }}"></script>
    
    <script>
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true
        });
    </script>
</body>
</html>

