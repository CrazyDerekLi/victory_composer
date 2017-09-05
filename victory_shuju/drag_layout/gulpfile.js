const gulp = require('gulp');
const zip = require('gulp-zip');
 
gulp.task('zip', function() {
    return gulp.src(['DragLayoutCom/**/*.*'])
        .pipe(gulp.dest('DragLayoutCom'));
});
