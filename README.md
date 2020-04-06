# Veeva Vault CLM Presentation tool 

>*All of this is subject to change as development continues but the idea was to create something simple that just works* 

## What does it do?  
>This will create the project structure based on the idea of using Shared Resources, and using a pre-defined template structure. 
> 
>As long as all your LESS files are in `shared`>`css` and are `imported` into `default.less` and your JS files are in `shared`>`js` they will be packaged correctly. 

## Quick start...
- `npm install`
- `gulp setup`
- Fill out `config.json`
- Create CLM Presentation and Shared resources: 
  - `gulp createKeyMessage --page --pres`
  - `gulp createKeyMessage --page --shared`
- Then start creating your pages: 
  - `gulp createKeyMessage --page "Page Name"`

## File structure

```
root/
|—— build/
|—— previews/
|—— keymessages/
|—— shared/
|   |—— css/
|   |   |—— pages/
|   |—— fonts/
|   |—— imgs/
|   |—— js/
|—— templates/
|
|—— config.json
|—— gulfile.js
|—— package.json
|
|—— your.html
|—— key.html
|—— messages.html
```

## Options and settings
### *Amend the config file!*
Fill in the required information in the new `config.json` or **nothing will work!** 

## Gulp Tasks and Workflow

### Overview
```
TASKS
_________________________________________________________________________
$ gulp                                        Default task that kicks off development mode
$ gulp setup                                  Setup folders and config.json
$ gulp createKeyMessage --page --pres         Create CLM Presentation json file
$ gulp createKeyMessage --page --shared       Create CLM Pres shared resources json file
$ gulp createKeyMessage --page "page name"    Add a Key Message to the project
$ gulp dev                                    Stage task
$ gulp build                                  Deploy task
$ gulp generateVaultCsv                       Generates a Veeva Vault MC Loader .CSV file
```

### In depth

```
$ gulp setup
```
- Template a `config.json` for your project defaults
- Add a `.gitignore` file
- Template the LESS files in `shared`>`css`
- Template the JS files in `shared`>`js`
- Create a `build` folder for Vault content ZIPs
- Create a `previews` folder for thumbs and posters


```
$ gulp createKeyMessage --page --pres
```
- Generate the CLM Presentation Key Message JSON file for use in the Vault CM Loader .csv file 
- Requires that you have filled in the `config.json` file! 

> *ToDo: lose the --page from this command*

```
$ gulp createKeyMessage --page --shared
```
- Creates the shared resources Key Message JSON file for use in the Vault CM Loader .csv file 
- Requires that you have filled in the `config.json` file!

> *ToDo: lose the --page from this command*

```
$ gulp createKeyMessage --page "Page name"
```
- Creates the shared resources Key Message JSON file for use in the Vault CM Loader .csv file 
- Creates the Key Message HTML file at root 
- Creates template thumb and poster images in the `previews` folder
- Adds a Key Message LESS file for this page in `shared`>`css`>`pages` (you'll need to add a link into `default.less`)

### Once you've added all your Key Messages you can start adding your CLM Presentation content

## 

```
$ gulp 
```
- Starts Watching the LESS and JS files

```
$ gulp dev
``` 
As above but DIY.. 
- Combine LESS files, minify css and minify JS

```
$ gulp build
```
- Packages all the project files into the `build` folder ready for upload to Vault
- This means: 
  - Pull all the shared resources (CSS, JS, Fonts, Images) into a ZIP and place into the `build` folder
  - Package each Key Message in it's own ZIP, along with it's thumb and poster images, and place in the `build` folder
  
> *ToDo: Use the Key Messages JSON file instead of the HTML files in the root!!* 

```
$ gulp generateVaultCsv
```
- Uses the Key Message JSON files to generate a Vault CM Loader file (this will appear in the `build` folder)

## And now? 
- Chuck the CSV file, found in the `build` folder, at the Vault CM Loader and watch it successfully get verified
- Upload your ZIP files from the `build` folder too
- Sit back and relax 