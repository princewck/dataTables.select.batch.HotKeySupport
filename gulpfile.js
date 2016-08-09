var gulp = require('gulp');
var uglify = require('gulp-minify');

gulp.task('default', function() {
    console.log(gulp);
    gulp.src('js/datatables.batch.multiselect.js')
        .pipe(uglify())
        .pipe(gulp.dest('js/'));
});

