/******************************************************************************************************
 *
 * For any of this to work you need to create a config.json in the project root
 * Add an empty object to the file like so... {}
 *
 * Then run "gulp createConfigFile" to pre-generate the required fields
 *
 * Once the required fields are filled in, and you have created you HTML files in the root,
 * you can run "gulp addKeyMessagesToConfig" to create some default json
 *
 * This default json will be used to generate the csv file for Vault using "gulp generateVaultCsv"
 *
 * */

const gulp = require('gulp');
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
        gulp.watch(['./shared/css/*.less'], gulp.series(combineLess, minifyCss));
        gulp.watch(['./shared/js/*.js', '!./shared/js/*.min.js'], minJs);
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

    // copy .gitignore file
    gulp.src('./templates/.gitignore')
        .pipe(gulp.dest('./'));

    // copy shared folder structure
    gulp.src(['./templates/shared/**', '!./templates/shared/css/pages/less-template-file.less'])
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
 *    > gulp createKeyMessage --page --pres "presentation name"
 *    > gulp createKeyMessage --page --shared "shared resource name"
 *    > gulp createKeyMessage --page "key message name"
 *
 * This will strip spaces for use in files names but won't handle stupid characters
 */
function createKeyMessage(cb) {

    if (arg.page) {
        jsonfile.readFile('./keymessages.json', function (err, obj) {
            if (err) {
                jsonfile.writeFile('./keymessages.json', {}, { spaces: 4, EOL: '\r\n' }, function (err) {
                    if (err) console.error(err);
                    createNewKeyMessage();
                });
            } else {
                createNewKeyMessage();
            }
        });
    } else {
        console.log("\x1b[31m%s\x1b[0m", "\r\n>> Hey! Try gulp createKeyMessage --page --pres");
        console.log("\x1b[31m%s\x1b[0m", ">> Hey! Try gulp createKeyMessage --page --shared \"new shared resource\"");
        console.log("\x1b[31m%s\x1b[0m", ">> Hey! Try gulp createKeyMessage --page \"new key message name\"\r\n");
    }

    cb();
}

/*********************************************
 * This is called by createKeyMessage - it has to wait for a file to be created
 */
function createNewKeyMessage() {

    let error = false;

    if (!('presentationName' in config) || config.presentationName === '') {
        console.log("config requires 'presentationName'");
        error = true;
    }
    if (!('externalId' in config) || config.externalId === '') {
        console.log("config requires 'externalId'");
        error = true;
    }
    if (!('presentationStartDate' in config)) {
        console.log("config requires 'presentationStartDate'");
        error = true;
    }
    if (!('presentationEndDate' in config)) {
        console.log("config requires 'presentationEndDate'");
        error = true;
    }
    if (!('productName' in config) || config.productName === '') {
        console.log("config requires 'productName'");
        error = true;
    }
    if (!('countryName' in config) || config.countryName === '') {
        console.log("config requires 'countryName'");
        error = true;
    }
    if (!('sharedResourceFilename' in config) || config.sharedResourceFilename === '') {
        console.log("config requires 'sharedResourceFilename'");
        error = true;
    }
    if (!('sharedResourceExternalId' in config) || config.sharedResourceExternalId === '') {
        console.log("config requires 'sharedResourceExternalId'");
        error = true;
    }

    if (error) {
        //cb();
        return;
    }

    if (arg.pres) {
        arg.page = config.presentationName;
    }
    if (arg.shared) {
        arg.page = config.sharedResourceFilename;
    }
    let newFileName = arg.page.replace(/ /g, "-");
    let kmData = {};

    jsonfile.readFile('./keymessages.json', function (err, obj) {
        if (err) console.error(err);

        // append new key message to obj
        obj[arg.page] = true;

        // write out to file
        jsonfile.writeFile('./keymessages.json', obj, { spaces: 4, EOL: '\r\n' }, function (err) {
            if (err) console.error(err);
        });

        if (arg.pres) {
            // create key message config file
            kmData = templateKMdata('Presentation', '', '',
                arg.page, config.externalId,
                config.sharedResourceExternalId, config.productName,
                config.countryName, '');
        }

        if (arg.shared) {
            // create key message config file
            kmData = templateKMdata('Shared', '', '',
                arg.page, config.externalId,
                config.sharedResourceExternalId, config.productName,
                config.countryName, config.sharedResourceFilename);
        }

        if (!arg.pres && !arg.shared) {
            // copy page template
            gulp.src('./templates/template-keymessage.html')
                .pipe(rename(newFileName + '.html'))
                .pipe(gulp.dest('./'));

            // add page less template
            gulp.src('./templates/shared/css/pages/less-template-file.less')
                .pipe(rename(newFileName + '.less'))
                .pipe(gulp.dest('./shared/css/pages/'));

            // add page previews
            gulp.src('./templates/previews/*')
                .pipe(gulp.dest('./previews/' + newFileName));

            // create key message config file
            kmData = templateKMdata('Slide', '', '',
                arg.page, config.externalId,
                config.sharedResourceExternalId, config.productName,
                config.countryName, newFileName);
        }

        //  - create folder
        gulp.src('*.*', {read: false})
            .pipe(gulp.dest('./keymessages'));

        //  - create the json file
        jsonfile.writeFile('./keymessages/' + newFileName + '.json', kmData, { spaces: 4, EOL: '\r\n' }, function (err) {
            if (err) console.error(err);
        });

    });
}

function generateVaultCsv(cb) {

    let loadedKMs = require('./keymessages.json');
    let addHeaders = true;
    let csvData = '';

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

    cb();
}

function combineLess(cb) {
    gulp.src('./shared/css/default.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./shared/css'));

    cb();
}

function minifyCss(cb) {
    setTimeout(function () {
        gulp.src('./shared/css/default.css')
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(rename(function (path) {path.extname = '.min.css'}))
            .pipe(gulp.dest('./shared/css'));
    }, 250);

    cb();
}

function copyCss(cb) {
    setTimeout(function () {
        gulp.src('./shared/css/default.min.css')
            .pipe(gulp.dest('./build/TMP/shared/css'));
    }, 500);

    cb();
}

function minJs(cb) {
    gulp.src(['./shared/js/*.js', '!./shared/js/*.min.js'])
        .pipe(uglify())
        .pipe(rename(function (path) {path.extname = '.min.js'}))
        .pipe(gulp.dest('./shared/js'));

    cb();
}

function copyJs(cb) {
    gulp.src('./shared/js/*.min.js')
        .pipe(gulp.dest('./build/TMP/shared/js'));

    cb();
}

function copyFonts(cb) {
    gulp.src('./shared/fonts/*')
        .pipe(gulp.dest('./build/TMP/shared/fonts'));

    cb();
}

function copyImages(cb) {
    gulp.src('./shared/imgs/*')
        .pipe(gulp.dest('./build/TMP/shared/imgs'));

    cb();
}

function zipSharedFiles(cb) {
    setTimeout(function () {
        gulp.src('./build/TMP/shared/**')
            .pipe(zip(config.sharedResourceFilename + '.zip'))
            .pipe(gulp.dest('./build'));

        cb();
    }, 1000);
}

function copyPreviewImages(cb) {
    gulp.src('./previews/*/*')
        .pipe(gulp.dest('./build/TMP/keymessages'));

    cb();
}

function copyHtmlFiles(cb) {
    setTimeout(function () {

        htmlFiles.forEach(function (htmlFile) {

            gulp.src(htmlFile)
                .pipe(rename(function (path) {path.basename = 'index'}))
                .pipe(gulp.dest('./build/TMP/keymessages/' + path.basename(htmlFile, '.html')));
        });

        cb();
    }, 500);
}

function zipKeyMessages(cb) {

    setTimeout(function () {

        htmlFiles.forEach(function (htmlFile) {

            gulp.src( './build/TMP/keymessages/' + path.basename(htmlFile, '.html') + '/*' )
                .pipe(zip(path.basename(htmlFile, '.html') + '.zip'))
                .pipe(gulp.dest('./build'));
        });

        cb();
    }, 1000);
}

function deleteTmpSharedFiles(cb) {
    setTimeout(function () {
        rimraf('./build/TMP', function () {  });
        cb();
    }, 2000);
}


exports.default = defaultTask;

exports.setup = setup;

exports.createKeyMessage = createKeyMessage;

exports.generateVaultCsv = generateVaultCsv;


exports.combineLess = combineLess;

exports.minifyCss = minifyCss;

exports.copyCss = copyCss;

exports.minJs = minJs;

exports.copyJs = copyJs;

exports.copyFonts = copyFonts;

exports.copyImages = copyImages;

exports.zipSharedFiles = zipSharedFiles;

exports.copyPreviewImages = copyPreviewImages;

exports.copyHtmlFiles = copyHtmlFiles;

exports.zipKeyMessages = zipKeyMessages;

exports.deleteTmpSharedFiles = deleteTmpSharedFiles;

exports.dev =gulp.series(
    combineLess,
    minifyCss,
    minJs
);

exports.build = gulp.series(
    combineLess,
    minifyCss,
    copyCss,
    minJs,
    copyJs,
    copyFonts,
    copyImages,
    zipSharedFiles,
    copyPreviewImages,
    copyHtmlFiles,
    zipKeyMessages,
    deleteTmpSharedFiles
);


// template data for key message file
function templateKMdata(type, startDate, endDate, page, externalId, sharedResourceExternalId, productName, countryName, newFileName) {

    let lifecycle = '', mediaType = '', presProductName = '', presCountry = '', presExternalId = '', training = '', hidden = '', shared = '', fieldsOnly = '';

    if (type === 'Presentation') {
        presProductName = productName;
        presCountry = countryName;
        presExternalId = externalId;
        lifecycle = 'Binder Lifecycle';
        training = hidden = fieldsOnly = 'FALSE';

        productName = countryName = externalId = sharedResourceExternalId = newFileName = '';
    }

    if (type === 'Slide') {
        lifecycle = 'CRM Content Lifecycle';
        newFileName = newFileName + ".zip";
        mediaType = 'HTML';
    }

    if (type === 'Shared') {
        lifecycle = 'CRM Content Lifecycle';
        presExternalId = sharedResourceExternalId;
        externalId = sharedResourceExternalId = '';
        newFileName = newFileName + ".zip";
        shared = 'TRUE';
    }

    return {
        "document_id__v" : "",
        "external_id__v" : presExternalId,
        "name__v" : page,
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

// fetch command line arguments
const arg = (argList => {

    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {

        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {

            // argument value
            if (curOpt) arg[curOpt] = opt;
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
