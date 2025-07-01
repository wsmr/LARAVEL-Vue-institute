<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    /**
     * Sample course data
     */
    private $courses = [
        [
            'id' => 1,
            'title' => 'Computer Science & Engineering',
            'description' => 'Comprehensive program covering software development, algorithms, data structures, and emerging technologies.',
            'duration' => '4 years',
            'level' => 'Undergraduate',
            'category' => 'Technology',
            'image' => '/images/courses/computer-science.jpg',
            'features' => ['AI & Machine Learning', 'Web Development', 'Mobile App Development', 'Cybersecurity'],
            'career_prospects' => ['Software Engineer', 'Data Scientist', 'AI Specialist', 'Tech Lead'],
            'admission_requirements' => ['High School Diploma', 'Mathematics Proficiency', 'English Proficiency'],
            'tuition_fee' => '$15,000/year',
            'available_seats' => 50,
            'start_date' => '2024-09-01'
        ],
        [
            'id' => 2,
            'title' => 'Business Administration',
            'description' => 'Strategic business education focusing on management, finance, marketing, and entrepreneurship.',
            'duration' => '3 years',
            'level' => 'Undergraduate',
            'category' => 'Business',
            'image' => '/images/courses/business-admin.jpg',
            'features' => ['Strategic Management', 'Digital Marketing', 'Financial Analysis', 'Leadership Development'],
            'career_prospects' => ['Business Manager', 'Marketing Director', 'Financial Analyst', 'Entrepreneur'],
            'admission_requirements' => ['High School Diploma', 'Basic Mathematics', 'Communication Skills'],
            'tuition_fee' => '$12,000/year',
            'available_seats' => 40,
            'start_date' => '2024-09-01'
        ],
        [
            'id' => 3,
            'title' => 'Digital Media & Design',
            'description' => 'Creative program combining graphic design, video production, and digital marketing strategies.',
            'duration' => '2 years',
            'level' => 'Diploma',
            'category' => 'Creative Arts',
            'image' => '/images/courses/digital-media.jpg',
            'features' => ['Graphic Design', 'Video Production', 'UI/UX Design', 'Social Media Marketing'],
            'career_prospects' => ['Graphic Designer', 'Video Editor', 'UI/UX Designer', 'Content Creator'],
            'admission_requirements' => ['High School Diploma', 'Portfolio Submission', 'Creative Aptitude'],
            'tuition_fee' => '$10,000/year',
            'available_seats' => 30,
            'start_date' => '2024-09-01'
        ],
        [
            'id' => 4,
            'title' => 'Environmental Science',
            'description' => 'Interdisciplinary program addressing environmental challenges and sustainable development.',
            'duration' => '4 years',
            'level' => 'Undergraduate',
            'category' => 'Science',
            'image' => '/images/courses/environmental-science.jpg',
            'features' => ['Climate Change Studies', 'Renewable Energy', 'Conservation Biology', 'Environmental Policy'],
            'career_prospects' => ['Environmental Consultant', 'Conservation Scientist', 'Policy Analyst', 'Research Scientist'],
            'admission_requirements' => ['High School Diploma', 'Science Background', 'Environmental Awareness'],
            'tuition_fee' => '$13,000/year',
            'available_seats' => 25,
            'start_date' => '2024-09-01'
        ],
        [
            'id' => 5,
            'title' => 'Data Science & Analytics',
            'description' => 'Advanced program in data analysis, machine learning, and business intelligence.',
            'duration' => '2 years',
            'level' => 'Postgraduate',
            'category' => 'Technology',
            'image' => '/images/courses/data-science.jpg',
            'features' => ['Machine Learning', 'Big Data Analytics', 'Statistical Modeling', 'Data Visualization'],
            'career_prospects' => ['Data Scientist', 'Business Analyst', 'ML Engineer', 'Research Analyst'],
            'admission_requirements' => ['Bachelor\'s Degree', 'Programming Knowledge', 'Statistics Background'],
            'tuition_fee' => '$18,000/year',
            'available_seats' => 20,
            'start_date' => '2024-09-01'
        ],
        [
            'id' => 6,
            'title' => 'Healthcare Management',
            'description' => 'Specialized program for managing healthcare organizations and improving patient care systems.',
            'duration' => '3 years',
            'level' => 'Undergraduate',
            'category' => 'Healthcare',
            'image' => '/images/courses/healthcare-management.jpg',
            'features' => ['Healthcare Systems', 'Medical Ethics', 'Health Informatics', 'Quality Management'],
            'career_prospects' => ['Hospital Administrator', 'Health Policy Analyst', 'Healthcare Consultant', 'Quality Manager'],
            'admission_requirements' => ['High School Diploma', 'Science Background Preferred', 'Communication Skills'],
            'tuition_fee' => '$14,000/year',
            'available_seats' => 35,
            'start_date' => '2024-09-01'
        ]
    ];

    /**
     * Display a listing of all courses
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->courses,
            'total' => count($this->courses)
        ]);
    }

    /**
     * Display the specified course
     */
    public function show($id): JsonResponse
    {
        $course = collect($this->courses)->firstWhere('id', (int)$id);
        
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    /**
     * Search courses by various criteria
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $category = $request->get('category', '');
        $level = $request->get('level', '');
        $maxFee = $request->get('max_fee', '');

        $filteredCourses = collect($this->courses);

        // Filter by search query
        if ($query) {
            $filteredCourses = $filteredCourses->filter(function ($course) use ($query) {
                return stripos($course['title'], $query) !== false ||
                       stripos($course['description'], $query) !== false ||
                       stripos($course['category'], $query) !== false;
            });
        }

        // Filter by category
        if ($category) {
            $filteredCourses = $filteredCourses->filter(function ($course) use ($category) {
                return stripos($course['category'], $category) !== false;
            });
        }

        // Filter by level
        if ($level) {
            $filteredCourses = $filteredCourses->filter(function ($course) use ($level) {
                return stripos($course['level'], $level) !== false;
            });
        }

        // Filter by maximum fee
        if ($maxFee) {
            $filteredCourses = $filteredCourses->filter(function ($course) use ($maxFee) {
                $courseFee = (int) filter_var($course['tuition_fee'], FILTER_SANITIZE_NUMBER_INT);
                return $courseFee <= (int) $maxFee;
            });
        }

        return response()->json([
            'success' => true,
            'data' => $filteredCourses->values()->all(),
            'total' => $filteredCourses->count(),
            'filters_applied' => [
                'query' => $query,
                'category' => $category,
                'level' => $level,
                'max_fee' => $maxFee
            ]
        ]);
    }

    /**
     * Get course categories
     */
    public function categories(): JsonResponse
    {
        $categories = collect($this->courses)
            ->pluck('category')
            ->unique()
            ->values()
            ->all();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get course levels
     */
    public function levels(): JsonResponse
    {
        $levels = collect($this->courses)
            ->pluck('level')
            ->unique()
            ->values()
            ->all();

        return response()->json([
            'success' => true,
            'data' => $levels
        ]);
    }

    /**
     * Get featured courses (top 3)
     */
    public function featured(): JsonResponse
    {
        $featuredCourses = collect($this->courses)
            ->take(3)
            ->all();

        return response()->json([
            'success' => true,
            'data' => $featuredCourses
        ]);
    }

    /**
     * Submit course application
     */
    public function apply(Request $request, $id): JsonResponse
    {
        $course = collect($this->courses)->firstWhere('id', (int)$id);
        
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        // Validate application data
        $validatedData = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'education_background' => 'required|string|max:1000',
            'motivation' => 'required|string|max:1000',
            'documents' => 'array',
            'documents.*' => 'file|mimes:pdf,doc,docx|max:5120' // 5MB max
        ]);

        // In a real application, you would save this to database
        // For now, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully',
            'data' => [
                'application_id' => 'APP-' . time(),
                'course_title' => $course['title'],
                'applicant_name' => $validatedData['full_name'],
                'status' => 'pending',
                'submitted_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * Get course statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_courses' => count($this->courses),
            'total_seats' => collect($this->courses)->sum('available_seats'),
            'categories' => collect($this->courses)->groupBy('category')->map->count(),
            'levels' => collect($this->courses)->groupBy('level')->map->count(),
            'average_fee' => collect($this->courses)->avg(function ($course) {
                return (int) filter_var($course['tuition_fee'], FILTER_SANITIZE_NUMBER_INT);
            })
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get course recommendations based on user preferences
     */
    public function recommendations(Request $request): JsonResponse
    {
        $interests = $request->get('interests', []);
        $budget = $request->get('budget', 0);
        $level = $request->get('level', '');

        $recommendations = collect($this->courses);

        // Filter by budget if provided
        if ($budget > 0) {
            $recommendations = $recommendations->filter(function ($course) use ($budget) {
                $courseFee = (int) filter_var($course['tuition_fee'], FILTER_SANITIZE_NUMBER_INT);
                return $courseFee <= $budget;
            });
        }

        // Filter by level if provided
        if ($level) {
            $recommendations = $recommendations->filter(function ($course) use ($level) {
                return stripos($course['level'], $level) !== false;
            });
        }

        // Score courses based on interests
        if (!empty($interests)) {
            $recommendations = $recommendations->map(function ($course) use ($interests) {
                $score = 0;
                foreach ($interests as $interest) {
                    if (stripos($course['title'], $interest) !== false ||
                        stripos($course['description'], $interest) !== false ||
                        stripos($course['category'], $interest) !== false) {
                        $score++;
                    }
                    
                    foreach ($course['features'] as $feature) {
                        if (stripos($feature, $interest) !== false) {
                            $score++;
                        }
                    }
                }
                $course['relevance_score'] = $score;
                return $course;
            })->sortByDesc('relevance_score');
        }

        return response()->json([
            'success' => true,
            'data' => $recommendations->take(5)->values()->all(),
            'criteria' => [
                'interests' => $interests,
                'budget' => $budget,
                'level' => $level
            ]
        ]);
    }
}

