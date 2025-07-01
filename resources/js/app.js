require('./bootstrap');

window.Vue = require('vue').default;

Vue.component('course-card', require('./Components/CourseCard.vue').default);

const app = new Vue({
    el: '#app',
});


