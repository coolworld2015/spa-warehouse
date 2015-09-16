var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifyHTML = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');

var scripts = [
    './app/vendors/angular/angular.js',
    './app/vendors/angular-bootstrap/ui-bootstrap-tpls.js',
    './app/src/**/!(*.test).js'
];

var getScripts = function () {
    return gulp.src(scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'));
};

gulp.task('index', function () {
    return gulp.src('./app/index.html')
        .pipe(gulp.dest('./build'))
});

gulp.task('styles', function () {
    return gulp.src('./app/**/*.css')
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('scripts', function () {
    return gulp.src(scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('dev:html', function () {
    return gulp.src('./app/src/**/*.html')
        .pipe(templateCache({
            module: 'App'
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('prod:html', function () {
    return gulp.src('./app/src/**/*.html')
        .pipe(minifyHTML())
        .pipe(templateCache({
            module: 'App'
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('dev:scripts', function () {
    return getScripts()
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./build'));
});

gulp.task('prod:scripts', function () {
    return getScripts()
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('test', function (done) {
    require('karma').server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function () {
        done();
    });
});

gulp.task('tdd', function(done){
    return require('karma').server.start({
        configFile: __dirname + '/karma.conf.js'
    }, function () {
        done();
    });
});

gulp.task('dev', ['dev:scripts', 'dev:html', 'styles']);
gulp.task('build', ['index', 'dev']);

gulp.task('prod', ['prod:scripts', 'prod:html', 'styles']);
//gulp.task('release', ['index', 'prod', 'test']);
gulp.task('release', ['index', 'prod']);

gulp.task('watch', ['build'], function () {
    gulp.watch('./app/**', ['build']);
});

gulp.task('default', ['build'], function () {
    gulp.watch('./app/**', ['build']);
    gulp.start('tdd');
});
 
