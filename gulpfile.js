const { series, src, dest } = require("gulp")
const gClean = require('gulp-clean')
const gNodemon = require('gulp-nodemon')
const gts = require("gulp-typescript");

const tsProject = gts.createProject("tsconfig.json");

const clean = () => src('build/*', { read: false }).pipe(gClean())
const build = () => src('src/**/*.ts').pipe(tsProject()).pipe(dest('build', { allowEmpty: true }))

const nodemon = () => gNodemon({
  inspect: true,
  script: 'src/app.ts',
  watch: ['src']
}).on('crash', () => console.error('app has crashed \n'))

exports.start = nodemon
exports.build = series(clean, build)
exports.default = nodemon