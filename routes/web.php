<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Main application route
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Course management routes
Route::prefix('api/courses')->group(function () {
    Route::get('/', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/search', [CourseController::class, 'search'])->name('courses.search');
    Route::get('/categories', [CourseController::class, 'categories'])->name('courses.categories');
    Route::get('/levels', [CourseController::class, 'levels'])->name('courses.levels');
    Route::get('/featured', [CourseController::class, 'featured'])->name('courses.featured');
    Route::get('/statistics', [CourseController::class, 'statistics'])->name('courses.statistics');
    Route::get('/recommendations', [CourseController::class, 'recommendations'])->name('courses.recommendations');
    Route::get('/{id}', [CourseController::class, 'show'])->name('courses.show');
    Route::post('/{id}/apply', [CourseController::class, 'apply'])->name('courses.apply');
});

// Additional pages
Route::get('/courses', function () {
    return view('courses.index');
})->name('courses.page');

Route::get('/courses/{id}', function ($id) {
    return view('courses.show', compact('id'));
})->name('courses.detail');

Route::get('/about', function () {
    return view('about');
})->name('about');

Route::get('/contact', function () {
    return view('contact');
})->name('contact');

Route::get('/admissions', function () {
    return view('admissions');
})->name('admissions');

// PWA routes
Route::get('/manifest.json', function () {
    return response()->file(public_path('manifest.json'));
})->name('manifest');

Route::get('/sw.js', function () {
    return response()->file(public_path('sw.js'));
})->name('service-worker');

// API routes for AJAX requests
Route::prefix('api')->group(function () {
    // Chatbot API
    Route::post('/chat', function (Illuminate\Http\Request $request) {
        $message = $request->input('message');
        
        // Simple chatbot response logic
        $responses = [
            'courses' => 'We offer various courses including Computer Science, Business Administration, Digital Media, Environmental Science, Data Science, and Healthcare Management. Would you like to know more about any specific course?',
            'admission' => 'Admissions are open for the next academic year. You can apply online through our website. Requirements vary by program but generally include academic transcripts and personal statements.',
            'campus' => 'Our modern campus features state-of-the-art facilities including a central library, science laboratories, sports complex, and student accommodation. You can take a 3D virtual tour!',
            'fees' => 'Tuition fees vary by program, ranging from $10,000 to $18,000 per year. We offer scholarships and financial aid for eligible students.',
            'contact' => 'You can reach us at info@die.edu or call +94 11 234 5678. We\'re located in Colombo, Sri Lanka.',
            'default' => 'Thank you for your question! For specific information, please contact our admissions office at info@die.edu or call +94 11 234 5678.'
        ];
        
        $lowerMessage = strtolower($message);
        $response = $responses['default'];
        
        foreach ($responses as $keyword => $reply) {
            if ($keyword !== 'default' && strpos($lowerMessage, $keyword) !== false) {
                $response = $reply;
                break;
            }
        }
        
        return response()->json([
            'success' => true,
            'response' => $response,
            'timestamp' => now()->toISOString()
        ]);
    })->name('api.chat');
    
    // Voice search API
    Route::post('/voice-search', function (Illuminate\Http\Request $request) {
        $query = $request->input('query');
        
        // Simple voice search logic
        $results = [];
        $lowerQuery = strtolower($query);
        
        if (strpos($lowerQuery, 'course') !== false) {
            $results[] = ['type' => 'navigation', 'target' => '#courses', 'title' => 'Courses Section'];
        }
        
        if (strpos($lowerQuery, 'campus') !== false) {
            $results[] = ['type' => 'navigation', 'target' => '#campus', 'title' => '3D Campus Tour'];
        }
        
        if (strpos($lowerQuery, 'contact') !== false) {
            $results[] = ['type' => 'navigation', 'target' => '#contact', 'title' => 'Contact Information'];
        }
        
        return response()->json([
            'success' => true,
            'query' => $query,
            'results' => $results,
            'timestamp' => now()->toISOString()
        ]);
    })->name('api.voice-search');
    
    // Campus information API
    Route::get('/campus-info', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'buildings' => [
                    ['name' => 'Main Academic Building', 'description' => 'Houses lecture halls, classrooms, and administrative offices'],
                    ['name' => 'Central Library', 'description' => 'Modern library with digital resources and study spaces'],
                    ['name' => 'Science Laboratory', 'description' => 'State-of-the-art labs for research and practical learning'],
                    ['name' => 'Student Center', 'description' => 'Hub for student activities, dining, and recreation'],
                    ['name' => 'Sports Complex', 'description' => 'Comprehensive sports facilities and fitness center']
                ],
                'facilities' => [
                    'High-speed WiFi throughout campus',
                    '24/7 Security and CCTV monitoring',
                    'Modern dormitory accommodation',
                    'Multiple dining options',
                    'Medical center and counseling services',
                    'Transportation services',
                    'Parking facilities',
                    'Green spaces and recreational areas'
                ]
            ]
        ]);
    })->name('api.campus-info');
});

// Fallback route for SPA
Route::fallback(function () {
    return view('welcome');
});

