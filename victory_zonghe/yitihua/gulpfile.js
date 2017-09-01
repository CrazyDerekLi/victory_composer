const gulp = require('gulp');
const zip = require('gulp-zip');
 
gulp.task('zip', function() {
    return gulp.src(['WebJsComposer/**/*.*'])
        .pipe(gulp.dest('WebJsComposer'));
});
