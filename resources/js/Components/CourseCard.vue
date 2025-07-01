<template>
    <div class="course-card" data-aos="zoom-in">
        <img
            src="/images/course-placeholder.jpg"
            loading="lazy"
            class="h-48 w-full object-cover"
        >
        <div class="p-6 glassmorphism">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ title }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ description }}</p>
        </div>
    </div>
</template>
