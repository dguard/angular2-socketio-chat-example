'use strict';

const connect           = require('gulp-connect');
const del               = require('del');
const dotenv            = require('dotenv');
const gulp              = require('gulp');
const gulpUtil          = require('gulp-util');
const historyApi        = require('connect-history-api-fallback');
const karma             = require('karma');
const nodemon           = require('gulp-nodemon');
const sourcemaps        = require('gulp-sourcemaps');
const tslint            = require('gulp-tslint');
const webpack           = require('webpack');


//=========================================================
//  ENVIRONMENT
//---------------------------------------------------------
dotenv.config();


//=========================================================
//  PATHS
//---------------------------------------------------------
const paths = {
    src: {
        client: ['src/client.ts', 'src/client/**/*.ts'],
        server: ['src/server.ts', 'src/server/**/*.ts'],
        common: ['src/models/**/*.ts', 'src/data/*.json', 'src/styles/**/*.scss']
    },

    target: 'target'
};


//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {
    karma: {
        configFile: __dirname + '/karma.conf.js'
    },

    tslint: {
        report: {
            options: {emitError: true},
            type: 'verbose'
        }
    },

    webpack: {
        prod: './config/webpack.prod',
        dev: './config/webpack.dev',
        server: './config/webpack.server'
    }
};


//=========================================================
//  TASKS
//---------------------------------------------------------
gulp.task('clean', () => del(paths.target));


gulp.task('lint:client', () => {
  return gulp.src(paths.src.client)
    .pipe(tslint())
    .pipe(tslint.report(
      config.tslint.report.type,
      config.tslint.report.options
    ));
});

gulp.task('lint:server', () => {
  return gulp.src(paths.src.server)
    .pipe(tslint())
    .pipe(tslint.report(
      config.tslint.report.type,
      config.tslint.report.options
    ));
});

gulp.task('lint', gulp.series(
    'lint:client',
    'lint:server'
))

// Webpack
gulp.task('webpack:client-prod', done => {
    let conf = require(config.webpack.prod);
    webpack(conf).run((error, stats) => {
        if (error) throw new gulpUtil.PluginError('webpack:client-prod', error);
        gulpUtil.log(stats.toString(conf.stats));
        done();
    });
});

gulp.task('webpack:client-dev', done => {
    let conf = require(config.webpack.dev);
    webpack(conf).watch(100, (error, stats) => {
        if (error) throw new gulpUtil.PluginError('webpack:client-dev', error);
        gulpUtil.log(stats.toString(conf.stats));
    });
    done();
});

gulp.task('webpack:server-prod', done => {
    let conf = require(config.webpack.server);
    webpack(conf).run((error, stats) => {
        if (error) throw new gulpUtil.PluginError('webpack:server-prod', error);
        gulpUtil.log(stats.toString(conf.stats));
        done();
    });
});

gulp.task('webpack:server-dev', done => {
    let conf = require(config.webpack.server);
    webpack(conf).watch(100, (error, stats) => {
        if (error) throw new gulpUtil.PluginError('webpack:server-dev', error);
        gulpUtil.log(stats.toString(conf.stats));
        done();
    });
});

gulp.task('webpack:dev', gulp.series(
    'webpack:server-dev',
    'webpack:client-dev'
));

gulp.task('webpack', gulp.series(
    'webpack:server-prod',
    'webpack:client-prod'
));


// Watch
gulp.task('watch', done => {
    nodemon({
        script: paths.target + '/assets/js/server.js',
        watch: paths.target + '/assets/js/server.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' },
        ignore: [
           paths.target + '/assets/js/client.js',
           paths.target + '/assets/js/vendor.js',
           paths.target + '/assets/js/polyfills.js',
           paths.assets
        ]
    })
    .on('restart', function () {
        console.log('Server restarted!');
    });

    console.log("Server started!");

    done();
});


//===========================
//  TEST
//---------------------------
function karmaServer(options, done) {
   let server = new karma.Server(options, error => {
      if (error) process.exit(error);
      done();
  });
  server.start();
}


gulp.task('test', done => {
    config.karma.singleRun = true;
    karmaServer(config.karma, done);
});


gulp.task('test.watch', done => {
    karmaServer(config.karma, done);
});


//===========================
//  DEVELOPMENT
//---------------------------
gulp.task('compile', gulp.series(
    'clean',
    'webpack'
));


//===========================
//  RELEASE
//---------------------------
gulp.task('build', gulp.series(
    'lint',
    'test',
    'compile'
));


//===========================
//  DEFAULT
//---------------------------
gulp.task('default', gulp.series(
    'clean',
    'webpack:dev',
    'watch'
));
