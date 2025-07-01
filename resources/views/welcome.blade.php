<!DOCTYPE html>
<html lang="{{ str_replace(\'_\', \'-\\' , app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel Vue Integration</title>

        <!-- Styles -->
        <link href="{{ asset(\'css/app.css\') }}" rel="stylesheet">
    </head>
    <body>
        <div id="app" class="flex items-center justify-center min-h-screen bg-gray-100">
            <course-card
                title="Introduction to Vue.js"
                description="Learn the fundamentals of Vue.js, a progressive JavaScript framework for building user interfaces."
            ></course-card>
        </div>

        <!-- Scripts -->
        <script src="{{ asset(\'js/app.js\') }}"></script>
    </body>
</html>


