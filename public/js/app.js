// Main Application JavaScript for DIE Website
class DIEApplication {
    constructor() {
        this.apiBase = '/api';
        this.courses = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedCourses();
        this.setupCourseSearch();
        this.setupApplicationForms();
        this.handleURLParameters();
    }

    setupEventListeners() {
        // Course exploration buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="explore-courses"]')) {
                this.scrollToSection('courses');
            }
            
            if (e.target.matches('[data-action="virtual-tour"]')) {
                this.scrollToSection('campus');
            }
            
            if (e.target.matches('[data-course-id]')) {
                const courseId = e.target.dataset.courseId;
                this.showCourseDetails(courseId);
            }
        });

        // Search functionality
        const searchInput = document.getElementById('courseSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.debounce(() => this.searchCourses(e.target.value), 300)();
            });
        }

        // Filter functionality
        document.querySelectorAll('[data-filter]').forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });
    }

    async loadFeaturedCourses() {
        try {
            const response = await fetch(`${this.apiBase}/courses/featured`);
            const data = await response.json();
            
            if (data.success) {
                this.courses = data.data;
                this.renderCourses(data.data);
            }
        } catch (error) {
            console.error('Error loading featured courses:', error);
            this.showErrorMessage('Failed to load courses. Please try again later.');
        }
    }

    async loadAllCourses() {
        try {
            const response = await fetch(`${this.apiBase}/courses`);
            const data = await response.json();
            
            if (data.success) {
                this.courses = data.data;
                this.renderCourses(data.data);
                this.setupFilters(data.data);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showErrorMessage('Failed to load courses. Please try again later.');
        }
    }

    renderCourses(courses) {
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        if (courses.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-500 dark:text-gray-400">
                        <i class="fas fa-search text-4xl mb-4"></i>
                        <p class="text-lg">No courses found matching your criteria.</p>
                        <button onclick="window.dieApp.loadAllCourses()" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                            View All Courses
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = courses.map(course => this.createCourseCard(course)).join('');
        
        // Trigger animations
        if (window.animationManager) {
            setTimeout(() => {
                container.querySelectorAll('.course-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 100);
                });
            }, 100);
        }
    }

    createCourseCard(course) {
        return `
            <div class="course-card" data-aos="fade-up" data-aos-delay="${Math.random() * 300}">
                <div class="relative overflow-hidden">
                    <img src="${course.image}" alt="${course.title}" 
                         class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                         onerror="this.src='/images/course-placeholder.jpg'">
                    <div class="absolute top-4 right-4">
                        <span class="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                            ${course.level}
                        </span>
                    </div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded text-sm font-semibold">
                            ${course.category}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        ${course.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        ${course.description}
                    </p>
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <i class="fas fa-clock mr-1"></i>
                            ${course.duration}
                        </div>
                        <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ${course.tuition_fee}
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            <i class="fas fa-users mr-1"></i>
                            ${course.available_seats} seats available
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            <i class="fas fa-calendar mr-1"></i>
                            Starts ${new Date(course.start_date).toLocaleDateString()}
                        </div>
                    </div>
                    
                    <div class="flex space-x-2">
                        <button onclick="window.dieApp.showCourseDetails(${course.id})" 
                                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            <i class="fas fa-info-circle mr-2"></i>Details
                        </button>
                        <button onclick="window.dieApp.showApplicationForm(${course.id})" 
                                class="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                            <i class="fas fa-paper-plane mr-2"></i>Apply
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async showCourseDetails(courseId) {
        try {
            const response = await fetch(`${this.apiBase}/courses/${courseId}`);
            const data = await response.json();
            
            if (data.success) {
                this.openCourseModal(data.data);
            } else {
                this.showErrorMessage('Course not found.');
            }
        } catch (error) {
            console.error('Error loading course details:', error);
            this.showErrorMessage('Failed to load course details.');
        }
    }

    openCourseModal(course) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                <div class="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${course.title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="p-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <img src="${course.image}" alt="${course.title}" 
                                 class="w-full h-64 object-cover rounded-lg mb-4"
                                 onerror="this.src='/images/course-placeholder.jpg'">
                            
                            <div class="space-y-4">
                                <div>
                                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">Course Information</h3>
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">Duration:</span>
                                            <span class="ml-2 text-gray-900 dark:text-white">${course.duration}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">Level:</span>
                                            <span class="ml-2 text-gray-900 dark:text-white">${course.level}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">Category:</span>
                                            <span class="ml-2 text-gray-900 dark:text-white">${course.category}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">Tuition:</span>
                                            <span class="ml-2 text-gray-900 dark:text-white font-bold">${course.tuition_fee}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">Key Features</h3>
                                    <ul class="space-y-1">
                                        ${course.features.map(feature => `
                                            <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <i class="fas fa-check text-green-500 mr-2"></i>
                                                ${feature}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                                <p class="text-gray-600 dark:text-gray-300">${course.description}</p>
                            </div>
                            
                            <div>
                                <h3 class="font-bold text-gray-900 dark:text-white mb-2">Career Prospects</h3>
                                <ul class="space-y-1">
                                    ${course.career_prospects.map(career => `
                                        <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <i class="fas fa-briefcase text-blue-500 mr-2"></i>
                                            ${career}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 class="font-bold text-gray-900 dark:text-white mb-2">Admission Requirements</h3>
                                <ul class="space-y-1">
                                    ${course.admission_requirements.map(req => `
                                        <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <i class="fas fa-graduation-cap text-purple-500 mr-2"></i>
                                            ${req}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm text-gray-500 dark:text-gray-400">Available Seats:</span>
                                    <span class="font-bold text-gray-900 dark:text-white">${course.available_seats}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-500 dark:text-gray-400">Start Date:</span>
                                    <span class="font-bold text-gray-900 dark:text-white">${new Date(course.start_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div class="flex space-x-3">
                                <button onclick="window.dieApp.showApplicationForm(${course.id}); this.closest('.fixed').remove();" 
                                        class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                    <i class="fas fa-paper-plane mr-2"></i>Apply Now
                                </button>
                                <button onclick="window.dieApp.downloadBrochure(${course.id})" 
                                        class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    <i class="fas fa-download mr-2"></i>Download Brochure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async searchCourses(query) {
        if (!query.trim()) {
            this.loadFeaturedCourses();
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/courses/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderCourses(data.data);
            }
        } catch (error) {
            console.error('Error searching courses:', error);
            this.showErrorMessage('Search failed. Please try again.');
        }
    }

    setupCourseSearch() {
        // Create search interface if it doesn't exist
        const coursesSection = document.getElementById('courses');
        if (coursesSection && !document.getElementById('courseSearch')) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'mb-8';
            searchContainer.innerHTML = `
                <div class="max-w-md mx-auto">
                    <div class="relative">
                        <input type="text" id="courseSearch" placeholder="Search courses..." 
                               class="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>
            `;
            
            const coursesContainer = document.getElementById('coursesContainer');
            if (coursesContainer) {
                coursesContainer.parentNode.insertBefore(searchContainer, coursesContainer);
                this.setupEventListeners(); // Re-setup to include new search input
            }
        }
    }

    setupApplicationForms() {
        // Application form handling will be implemented here
        // For now, we'll show a simple modal
    }

    showApplicationForm(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            this.showErrorMessage('Course not found.');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                <div class="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Apply for ${course.title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form class="p-6 space-y-4" onsubmit="window.dieApp.submitApplication(event, ${courseId})">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                            <input type="text" name="full_name" required 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                            <input type="email" name="email" required 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                            <input type="tel" name="phone" required 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                            <input type="date" name="date_of_birth" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
                        <textarea name="address" required rows="3" 
                                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Educational Background *</label>
                        <textarea name="education_background" required rows="3" 
                                  placeholder="Please describe your educational qualifications..."
                                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivation *</label>
                        <textarea name="motivation" required rows="4" 
                                  placeholder="Why do you want to join this course? What are your goals?"
                                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"></textarea>
                    </div>
                    
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="this.closest('.fixed').remove()" 
                                class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            <i class="fas fa-paper-plane mr-2"></i>Submit Application
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async submitApplication(event, courseId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const applicationData = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(`${this.apiBase}/courses/${courseId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(applicationData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showSuccessMessage('Application submitted successfully! We will contact you soon.');
                event.target.closest('.fixed').remove();
            } else {
                this.showErrorMessage(data.message || 'Application failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            this.showErrorMessage('Application failed. Please check your connection and try again.');
        }
    }

    downloadBrochure(courseId) {
        // In a real application, this would download an actual brochure
        this.showSuccessMessage('Brochure download will be available soon. Please contact admissions for detailed information.');
    }

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Handle chat parameter
        if (urlParams.get('chat') === 'open') {
            setTimeout(() => {
                const chatbotToggle = document.getElementById('chatbotToggle');
                if (chatbotToggle) {
                    chatbotToggle.click();
                }
            }, 1000);
        }
        
        // Handle course parameter
        const courseId = urlParams.get('course');
        if (courseId) {
            setTimeout(() => {
                this.showCourseDetails(parseInt(courseId));
            }, 1000);
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-600 text-white' :
            type === 'error' ? 'bg-red-600 text-white' :
            'bg-blue-600 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} mr-3"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dieApp = new DIEApplication();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DIEApplication;
}

