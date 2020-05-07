/******************************************************************************************************
 *
 * For any of this to work you need to create a config.json in the project root
 * Add an empty object to the file like so... {}
 *
 * Then run "gulp setup" to pre-generate the required fields
 *
 * This default json will be used to generate the csv file for Vault using "gulp vaultcsv"
 *
 * */

//@ToDo: possibly import the menu from a file? https://github.com/reinerBa/gulp-tag-content-replace

const gulp = require('gulp');
const fs = require('fs');
const glob = require("glob");
const path = require('path');
const jsonfile = require('jsonfile'); // do stuff to json files
const write = require('write'); // write to file
const rename = require('gulp-rename'); // rename a file in stream
const less = require('gulp-less'); // combine LESS and export as CSS
const sourcemaps = require('gulp-sourcemaps'); // create sourcemaps for css
const cleanCSS = require('gulp-clean-css'); // minify CSS
const uglify = require('gulp-uglify'); // minify JS
const zip = require('gulp-zip'); // make a ZIP
const rimraf = require('rimraf'); // delete a folder that contains files
const replace = require('gulp-replace'); // string replace in pipe
const inject = require('gulp-inject-string'); // append/prepend/wrap/before/after/beforeEach/afterEach/replace
const imageResize = require('gulp-image-resize');
const clean = require('gulp-clean'); // delete files/folders

const htmlFiles = glob.sync('./*.html');
let config = {};

try {
    config = require('./config.json');
} catch (ex) {

    (async () => {
        await write('./config.json', "{}");
    })();

    console.log("\x1b[31m%s\x1b[0m", "\r\n>> Hey! You need to run 'gulp setup' then enter the Veeva required data in ./config.json\r\n");
}

function defaultTask(cb) {
    if ('presentationName' in config) {
        gulp.watch([
            './shared/css/**/*.less',
            './shared/js/*.js',
            '!./shared/js/*.min.js'
        ], dev).on('end', function() {console.log('test')});
    }

    cb();
}

/**********************************************************************************************************
 * setup the basic project structure
 *
 *    > gulp setup --project "project name"
 */
function setup(cb) {

    // copy config file
    gulp.src('./templates/template-config.json')
        .pipe(rename('config.json'))
        .pipe(gulp.dest('./'));

    // copy keymessages config file
    gulp.src('./templates/template-keymessages.json')
        .pipe(rename('keymessages.json'))
        .pipe(gulp.dest('./'));

    // copy .gitignore file
    gulp.src('./templates/.gitignore')
        .pipe(gulp.dest('./'));

    // copy shared folder structure
    gulp.src(['./templates/shared/**', '!./templates/shared/css/keymessages/less-template-file.less'])
        .pipe(gulp.dest('./shared'));

    // create build folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./build'));

    // create previews folder
    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./previews'));

    cb();
}


/**********************************************************************************************************
 * add a new key message to the project using...
 *
 *    > gulp keymessage --pres
 *    > gulp keymessage --shared
 *    > gulp keymessage --new "key message name"
 *
 * This will strip spaces for use in files names but won't handle stupid characters
 */
function keymessage(cb) {

    let error = false;

    if (!('presentationName' in config) || config.presentationName === '') {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'presentationName'");
        error = true;
    }
    if (!('prefix' in config) || config.prefix === '') {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'prefix'");
        error = true;
    }
    if (!('externalId' in config) || config.externalId === '') {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'externalId'");
        error = true;
    }
    if (!('presentationStartDate' in config)) {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'presentationStartDate'");
        error = true;
    }
    if (!('presentationEndDate' in config)) {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'presentationEndDate'");
        error = true;
    }
    if (!('productName' in config) || config.productName === '') {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'productName'");
        error = true;
    }
    if (!('countryName' in config) || config.countryName === '') {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'countryName'");
        error = true;
    }
    if (!('sharedResourceExternalId' in config) || config.sharedResourceExternalId === '') {
        console.log("\x1b[31m%s\x1b[0m", "config requires 'sharedResourceExternalId'");
        error = true;
    }

    if (arg.pres === undefined && arg.shared === undefined && arg.new === undefined) {
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp keymessage --pres');
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp keymessage --shared');
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp keymessage --new "Key message name"');
        error = true;
    }

    if (error) {
        cb();
        return;
    }

    if (arg.pres !== undefined || arg.shared !== undefined) {
        arg.new = config.presentationName;
    }
    let newFileName = arg.new.replace(/ /g, "-");
    let kmData = {};

    if (arg.shared !== undefined) {
        newFileName = newFileName + '-shared-resource';
    }

    jsonfile.readFile('./keymessages.json', function (err, obj) {
        if (err) console.error(err);

        // append new key message to obj
        if (arg.shared !== undefined) {
            obj[arg.new + ' shared resource'] = true;
        } else
            obj[arg.new] = true;

        // write out to file
        jsonfile.writeFile('./keymessages.json', obj, { spaces: 4, EOL: '\r\n' }, function (err) {
            if (err) console.error(err);
        });

        if (arg.pres !== undefined) {
            // create key message config file
            kmData = templateKMdata('Presentation', '', '',
                config.prefix, arg.new, config.externalId,
                config.sharedResourceExternalId, config.productName,
                config.countryName, '');
        }

        if (arg.shared !== undefined) {
            // create key message config file
            kmData = templateKMdata('Shared', '', '',
                config.prefix, arg.new + ' shared resource', config.externalId,
                config.sharedResourceExternalId, config.productName,
                config.countryName, newFileName);
        }

        if (arg.pres === undefined && arg.shared === undefined) {
            // copy new template
            gulp.src('./templates/template-keymessage.html')
                .pipe(inject.replace('ADD PAGE ID HERE', arg.new.toCamelCase()))
                .pipe(rename(newFileName + '.html'))
                .pipe(gulp.dest('./'));

            // add new previews
            gulp.src('./templates/previews/*')
                .pipe(gulp.dest('./previews/' + newFileName));

            // add new less template
            gulp.src('./templates/shared/css/keymessages/less-template-file.less')
                .pipe(inject.replace('PAGE NAME', arg.new))
                .pipe(inject.replace('PageName', arg.new.toCamelCase()))
                .pipe(rename(newFileName + '.less'))
                .pipe(gulp.dest('./shared/css/keymessages/'));

            // append new less template @import to default.less
            gulp.src('./shared/css/default.less')
                .pipe(inject.append('\r\n@import "keymessages/' + newFileName + '.less";'))
                .pipe(gulp.dest('./shared/css/'));

            // insert JS link into app.js
            let js = fs.readFileSync('./templates/template-keymessage.js', 'utf8');
            js = js.replace(/FILENAME/g, newFileName).replace('METHODNAME', arg.new.replace(/-/g, " ").toCamelCase());

            gulp.src('./shared/js/app.js')
                .pipe(inject.before('/** INSERT NEW KEYMESSAGE LINK HERE **/', js + '    '))
                .pipe(gulp.dest('./shared/js/'));

            // create key message config file
            kmData = templateKMdata('Slide', '', '',
                config.prefix, arg.new, config.externalId,
                config.sharedResourceExternalId, config.productName,
                config.countryName, newFileName);
        }

        //  - create folder
        gulp.src('*.*', {read: false})
            .pipe(gulp.dest('./keymessages'));

        setTimeout(function() {
            //  - create the json file
            jsonfile.writeFile('./keymessages/' + newFileName + '.json', kmData, { spaces: 4, EOL: '\r\n' }, function (err) {
                if (err) console.error(err);
            });
        }, 250);

    });

    cb();
}


/**********************************************************************************************************
 * add a new key message to the project using...
 *
 *    > gulp link --km "key-message-name.zip" --method "nameOfMethod" --id "presentation-ID"
 *
 * This will strip spaces for use in files names but won't handle stupid characters
 */
function externalLink(cb) {

    let error = false;

    if (arg.method === undefined) {
        console.log("\x1b[31m%s\x1b[0m", "requires '--method'");
        error = true;
    }
    if (arg.km === undefined) {
        console.log("\x1b[31m%s\x1b[0m", "requires '--km'");
        error = true;
    }
    if (arg.id === undefined) {
        console.log("\x1b[31m%s\x1b[0m", "requires '--id'");
        error = true;
    }

    if (error) {
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp link --km "key-message-name.zip" --method "nameOfMethod" --id "123-presentation-ID"');
        cb();
        return;
    }

    let methodName = arg.method.replace(/-/g, " ").toCamelCase();
    let keyMessage = (arg.km.indexOf('.zip') !== -1) ? arg.km : arg.km + '.zip';
    let presID = arg.id;

    // insert JS link into app.js
    let js = fs.readFileSync('./templates/template-link-to-pres.js', 'utf8');
    js = js.replace(/KEYMESSAGE/g, keyMessage).replace(/PRESENTATION/g, presID).replace('METHODNAME', methodName);

    gulp.src('./shared/js/app.js')
        .pipe(inject.before('/** INSERT LINK TO OTHER PRES HERE **/', js + '    '))
        .pipe(gulp.dest('./shared/js/'));

    cb();
}


function generateImages(cb) {

    // loop through previews folders
    // resize grab and rename as poster
    // copy and resize poster and rename as thumb

    gulp.src(['./previews/*/*.{PNG,png,JPG,jpg}', '!./previews/*/poster.png', '!./previews/*/thumb.png'])
        .pipe(imageResize({
            //imageMagick: true,
            width: 1024,
            height: 768,
            quality: 5,
            format: 'png'
        }))
        .pipe(rename(function (path){
            path.basename = 'poster';
        }))
        .pipe(gulp.dest('./previews'));

    gulp.src(['./previews/*/*.{PNG,png,JPG,jpg}', '!./previews/*/poster.png', '!./previews/*/thumb.png'])
        .pipe(imageResize({
            //imageMagick: true,
            width: 200,
            height: 150,
            quality: 3,
            format: 'png'
        }))
        .pipe(rename(function (path){
            path.basename = 'thumb';
        }))
        .pipe(gulp.dest('./previews'));

    gulp.src(['./previews/*/*.{PNG,png,JPG,jpg}', '!./previews/*/poster.png', '!./previews/*/thumb.png'], {read: false})
        .pipe(clean());

    cb();
}


function renameKeymessage(cb) {

    let error = false;

    if (arg.from === undefined) {
        console.log("\x1b[31m%s\x1b[0m", "requires '--from'");
        error = true;
    }
    if (arg.to === undefined) {
        console.log("\x1b[31m%s\x1b[0m", "requires '--to'");
        error = true;
    }

    if (error) {
        console.log("\x1b[31m%s\x1b[0m", 'EXAMPLE: > gulp rename --from "Key message name" --to "New key message name"');
        cb();
        return;
    }

    console.log("\x1b[31m%s\x1b[0m", "Rename is not implemented yet");

    let oldFileName = arg.from.replace(/ /g, "-");
    let newFileName = arg.to.replace(/ /g, "-");

    //@ToDo: update classname in LESS
    // replace patterns: /*** Homepage ***/ and #Homepage

    //@ToDo: rename LESS

    /* PROPOSED METHOD:
    gulp.src('./templates/shared/css/keymessages/' + oldFileName + '.less')
        .pipe(inject.replace('*** ' + arg.from + ' ***', arg.to))
        .pipe(inject.replace('#' + arg.from.toCamelCase(), arg.to.toCamelCase()))
        .pipe(rename(newFileName + '.less'))
        .pipe(gulp.dest('./shared/css/keymessages/'))
        .on('end', function() {
            gulp.src('./shared/css/keymessages/' + oldFileName + '.less', {read: false}).pipe(clean());
        });
     */



    //@ToDo: update default.less
    // replace pattern: @import "keymessages/Homepage.less"

    /* PROPOSED METHOD:
        // append new less template @import to default.less
        gulp.src('./shared/css/default.less')
            .pipe(inject.replace('@import "keymessages/' + oldFileName, '@import "keymessages/' + newFileName))
            .pipe(gulp.dest('./shared/css/'));
    */



    //@ToDo: update app.js
    // replace patterns: ('.goTo-Homepage') and ('Homepage.zip', '') and href = 'Homepage.html'

    /* PROPOSED METHOD:
    gulp.src('./shared/js/app.js')
        .pipe(inject.replace("('.goTo-" + arg.from.toCamelCase() + "')", "('.goTo-" + arg.to.toCamelCase() + "')"))
        .pipe(inject.replace("('" + arg.from.toCamelCase() + ".zip', '')", "('" + arg.to.toCamelCase() + ".zip', '')"))
        .pipe(inject.replace("href = '" + arg.from.toCamelCase() + ".html'", "href = '" + arg.to.toCamelCase() + ".html'"))
        .pipe(gulp.dest('./shared/js/'));
    */



    //@ToDo: update classname in HTML
    // replace pattern: <body id="Homepage"> and goTo-Homepage

    //@ToDo: rename HTML

    /* PROPOSED METHOD:
    gulp.src('./' + oldFileName + '.html')
        .pipe(inject.replace('<body id="Homepage">', '<body id="' + arg.to.toCamelCase() + '">'))
        .pipe(inject.replace('goTo-' + arg.from.toCamelCase(), 'goTo-' + arg.to.toCamelCase()))
        .pipe(rename(newFileName + '.html'))
        .pipe(gulp.dest('./'))
        .on('end', function() {
            gulp.src('./' + oldFileName + '.html', {read: false}).pipe(clean());
        });
    */



    //@ToDo: update keymessages.json
    // replace pattern: "Homepage"

    /* PROPOSED METHOD:
    gulp.src('./keymessages.json')
        .pipe(inject.replace('"' + arg.from.toCamelCase() + '":', '"' + arg.to.toCamelCase() + '":'))
        .pipe(gulp.dest('./'));
    */




    //@ToDo: update [key message].json
    // replace patterns: "name__v": "Homepage" and "slide.filename": "Homepage.zip"

    //@ToDo: rename [new key message].json

    //@ToDo: rename previews folder

    cb();
}


function dev(cb) {
    gulp.src('./shared/css/default.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./shared/css'))
        .on('end', function() {
            gulp.src('./shared/css/default.css')
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(rename(function (path) {path.extname = '.min.css'}))
                .pipe(gulp.dest('./shared/css'));
        });

    gulp.src(['./shared/js/*.js', '!./shared/js/*.min.js'])
        .pipe(uglify())
        .pipe(rename(function (path) {path.extname = '.min.js'}))
        .pipe(gulp.dest('./shared/js'));

    cb();
}

function build(cb) {

    // copy js
    gulp.src(['./shared/js/app.js'])
        .pipe(replace('isPublished = false', 'isPublished = true'))
        .pipe(gulp.dest('./shared/js'))
        .on('end', function () {
            gulp.src(['./shared/js/*.js', '!./shared/js/*.min.js'])
                .pipe(uglify())
                .pipe(rename(function (path) {path.extname = '.min.js'}))
                .pipe(gulp.dest('./shared/js'))
                .on('end', function () {
                    gulp.src('./shared/js/*.min.js')
                        .pipe(gulp.dest('./build/TMP/shared/js'));

                    // reset app.js isPublished var to false
                    gulp.src(['./shared/js/app.js'])
                        .pipe(replace('isPublished = true', 'isPublished = false'))
                        .pipe(gulp.dest('./shared/js'))
                });
        })

    //gulp.src('./shared/js/*.min.js')
      //  .pipe(gulp.dest('./build/TMP/shared/js'));

    // copy fonts
    gulp.src('./shared/fonts/*')
        .pipe(gulp.dest('./build/TMP/shared/fonts'));

    // copy images
    gulp.src('./shared/imgs/*')
        .pipe(gulp.dest('./build/TMP/shared/imgs'));

    // copy preview images
    gulp.src('./previews/*/*')
        .pipe(gulp.dest('./build/TMP/keymessages'));

    // copy html files
    setTimeout(function () {
        htmlFiles.forEach(function (htmlFile) {
            gulp.src(htmlFile)
                .pipe(rename(function (path) {path.basename = 'index'}))
                .pipe(gulp.dest('./build/TMP/keymessages/' + path.basename(htmlFile, '.html')));
        });
    }, 500);

    // copy css
    setTimeout(function () {
        gulp.src('./shared/css/default.min.css')
            .pipe(gulp.dest('./build/TMP/shared/css'));
    }, 750);

    // zip keymessages
    setTimeout(function () {
        htmlFiles.forEach(function (htmlFile) {
            gulp.src( './build/TMP/keymessages/' + path.basename(htmlFile, '.html') + '/*' )
                .pipe(zip(path.basename(htmlFile, '.html') + '.zip'))
                .pipe(gulp.dest('./build'));
        });
    }, 1500);

    // zip shared files
    setTimeout(function () {
        gulp.src('./build/TMP/shared/**')
            .pipe(zip(config.presentationName.replace(/ /g, "-") + '-shared-resource.zip'))
            .pipe(gulp.dest('./build'))
            .on('end', function() {
                setTimeout(function () {
                    rimraf('./build/TMP', function () {  });
                    cb();
                }, 2000);
            });
    }, 2250);

    // make the Vault CM Loader csv
    let loadedKMs = require('./keymessages.json');
    let addHeaders = true;
    let csvData = '';

    setTimeout(function() {
        for (const A of Object.entries(loadedKMs)) {
            let km = A[0];
            let allowKm = A[1];

            if (allowKm) {

                let dd = require('./keymessages/' + km.replace(/ /g, "-") + '.json');

                if (addHeaders) {
                    csvData = Object.keys(dd).toString() + '\r\n';
                    addHeaders = false;
                }
                csvData += Object.values(dd).toString() + '\r\n';
            }
        }

        // save to ./build/vault-cm-loader.csv
        (async () => {
            await write('./build/vault-cm-loader.csv', csvData);
        })();
    }, 1000);

    cb();
}

exports.default = defaultTask;

exports.setup = setup;

exports.keymessage = keymessage;

exports.link = externalLink;

exports.images = generateImages;

exports.rename = renameKeymessage;

exports.dev = dev;

exports.build = build;


// template data for key message file
function templateKMdata(type, startDate, endDate, prefix, name_v, externalId, sharedResourceExternalId, productName, countryName, newFileName) {

    let lifecycle = '', mediaType = '', presProductName = '', presCountry = '', presExternalId = '', training = '', hidden = '', shared = '', fieldsOnly = '';

    prefix = prefix.toUpperCase();

    if (type === 'Presentation') {
        presProductName = productName;
        presCountry = countryName;
        presExternalId = prefix + 'pres-' + externalId;
        lifecycle = 'Binder Lifecycle';
        training = hidden = fieldsOnly = 'FALSE';

        productName = countryName = externalId = sharedResourceExternalId = newFileName = '';
    }

    if (type === 'Slide') {
        lifecycle = 'CRM Content Lifecycle';
        externalId = prefix + 'pres-' + externalId;
        sharedResourceExternalId = prefix + 'sr-' + sharedResourceExternalId;
        newFileName = newFileName + ".zip";
        mediaType = 'HTML';
    }

    if (type === 'Shared') {
        lifecycle = 'CRM Content Lifecycle';
        presExternalId = prefix + 'sr-' + sharedResourceExternalId;
        externalId = sharedResourceExternalId = '';
        newFileName = newFileName + ".zip";
        shared = 'TRUE';
    }

    return {
        "document_id__v" : "",
        "external_id__v" : presExternalId,
        "name__v" : name_v,
        "Create Presentation" : "FALSE",
        "Type" : type,
        "lifecycle__v" : lifecycle,
        "Presentation Link" : externalId,
        "Fields Only" : fieldsOnly,
        "pres.crm_training__v" : training,
        "pres.crm_hidden__v" : hidden,
        "pres.product__v.name__v" : presProductName,
        "pres.country__v.name__v" : presCountry,
        "pres.clm_content__v" : "TRUE",
        "pres.crm_start_date__v" : startDate,
        "pres.crm_end_date__v" : endDate,
        "slide.name__v" : "",
        "slide.lifecycle__v" : "",
        "slide.crm_media_type__v" : mediaType,
        "slide.related_sub_pres__v" : "",
        "slide.related_shared_resource__v" : sharedResourceExternalId,
        "slide.crm_disable_actions__v" : "",
        "slide.product__v.name__v" : productName,
        "slide.country__v.name__v" : countryName,
        "slide.filename" : newFileName,
        "slide.clm_content__v" : "TRUE",
        "slide.crm_shared_resource__v" : shared
    }
}

// convert string to camelcase
String.prototype.toCamelCase = function() {
    return this
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/\^(.)/g, function($1) { return $1.toLowerCase(); });
}

// fetch command line arguments
const arg = (argList => {

    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {

        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {

            // argument value
            if (curOpt) arg[curOpt] = opt.replace(/([^a-z0-9_-]+)/gi, ' ').trim();
            curOpt = null;

        }
        else {

            // argument name
            curOpt = opt;
            arg[curOpt] = true;

        }

    }

    return arg;

})(process.argv);
