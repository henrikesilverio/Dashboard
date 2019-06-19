var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var open = require('gulp-open');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rev = require('gulp-rev');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var inject = require('gulp-inject');
var serveStatic = require('serve-static');

gulp.task('styles', function() {
    return gulp.src('src/assets/css/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/assets/css'));
});

gulp.task('bundle-vendor-css', function() {
    return gulp.src([
            'node_modules/@fortawesome/fontawesome-free/css/all.css',
            'node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(cleanCSS())
        .pipe(rev())
        .pipe(gulp.dest('deploy/styles'));
});

gulp.task('bundle-main-css', function() {
    return gulp.src('src/assets/css/main.css')
        .pipe(concat('main.css'))
        .pipe(cleanCSS())
        .pipe(rev())
        .pipe(gulp.dest('deploy/styles'));
});

gulp.task('bundle-vendor-js', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
            'node_modules/datatables.net/js/jquery.dataTables.js',
            'node_modules/datatables.net-bs4/js/dataTables.bootstrap4.js',
            'node_modules/jquery-countdown/dist/jquery.countdown.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(rev())
        .pipe(gulp.dest('deploy/scripts'))
        .pipe(uglify())
        .pipe(gulp.dest('deploy/scripts'));
});

gulp.task('bundle-main-js', function() {
    return gulp.src([
            "src/app.js"
        ])
        .pipe(concat('main.js'))
        .pipe(rev())
        .pipe(gulp.dest('deploy/scripts'))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('deploy/scripts'));
});

gulp.task('clean', function() {
    return gulp.src('deploy').pipe(clean());
});

gulp.task('styles-watch', function() {
    return gulp.watch('src/assets/css/*.scss', gulp.series('styles'));
});

gulp.task('copy', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**', { base: 'node_modules/@fortawesome/fontawesome-free' })
        .pipe(gulp.dest('deploy'));
});

gulp.task('html-inject', function() {
    return gulp.src('index.html')
        .pipe(inject(gulp.src('deploy/styles/vendor*.css', { read: false }), { name: 'vendor', ignorePath: 'deploy', addRootSlash: false }))
        .pipe(inject(gulp.src('deploy/styles/main*.css', { read: false }), { name: 'main', ignorePath: 'deploy', addRootSlash: false }))
        .pipe(inject(gulp.src('deploy/scripts/vendor*.js', { read: false }), { name: 'vendor', ignorePath: 'deploy', addRootSlash: false }))
        .pipe(inject(gulp.src('deploy/scripts/main*.js', { read: false }), { name: 'main', ignorePath: 'deploy', addRootSlash: false }))
        .pipe(gulp.dest('deploy'));
});

gulp.task('deploy', gulp.series(
    'clean',
    'styles',
    'bundle-main-css',
    'bundle-vendor-css',
    'bundle-vendor-js',
    'bundle-main-js',
    'copy',
    'html-inject'
));

gulp.task('host', gulp.series('styles', function() {
    var settings = {
        root: 'src',
        host: 'localhost',
        port: '8080',
        fallback: 'index.html',
        middleware: function(connect) {
            return [
                connect().use('/node_modules', serveStatic('node_modules')),
                connect().use('/src', serveStatic('src'))
            ];
        }
    };
    connect.server(settings);
    gulp.src('index.html')
        .pipe(open({ uri: 'http://' + settings.host + ':' + settings.port, app: 'chrome' }));
}));

gulp.task('host-deploy', function() {
    var settings = {
        root: 'deploy',
        host: 'localhost',
        port: '8080',
        fallback: 'deploy/index.html'
    };
    connect.server(settings);
    gulp.src('deploy/index.html')
        .pipe(open({ uri: 'http://' + settings.host + ':' + settings.port, app: 'chrome' }));
});