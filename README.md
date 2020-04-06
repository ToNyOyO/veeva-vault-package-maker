# Veeva Vault CLM Presentation tool 

## What does it do?  
>This will create the project structure based on the idea of using Shared Resources, and using a pre-defined template structure. 
> 
>As long as all your LESS files are imported into default.less and your JS files are in ./shared/js they will be packaged correctly. 

## Basic use
- `npm install`
- `gulp setup`
- Fill out `config.json`
- Create CLM Presentation and Shared resources: 
  - `gulp createKeyMessage --page --pres`
  - `gulp createKeyMessage --page --shared`
- Then start creating your pages: 
  - `gulp createKeyMessage --page "Page Name"`

## What does it do, specifically? 

#### gulp setup

- Template a `config.json` for your project defaults
- Add a `.gitignore` file
- Template the LESS files in `./shared/css`
- Template the JS files in `./shared/js`
- Create a `build` folder
- Create a `previews` folder

#### Amend the config file!
Fill in the required information in the new `config.json` or **nothing will work!** 

#### gulp createKeyMessage --page --pres
- Generate the CLM Presentation Key Message JSON file for use in the Vault CM Loader .csv file 
- Requires that you have filled in the `config.json` file! 

#### gulp createKeyMessage --page --shared
- Creates the shared resources Key Message JSON file for use in the Vault CM Loader .csv file 
- Requires that you have filled in the `config.json` file!

#### gulp createKeyMessage --page "Page name"
- Creates the shared resources Key Message JSON file for use in the Vault CM Loader .csv file 
- Creates the Key Message HTML file at root 
- Creates template thumb and poster images in the `./previews` folder
- Adds a Key Message LESS file for this page in `./shared/css/pages` (you'll need to add a link into `default.less`)

## Once you've added all your Key Messages you can start adding your CLM Presentation content

#### gulp default
- Starts Watches for the LESS and JS files

#### gulp dev 
As above but DIY.. 
- Combine LESS files, minify css and minify JS

#### gulp build
- Packages all the project files into the `./build` folder ready for upload to Vault
- This means: 
  - Pull all the shared resources (CSS, JS, Fonts, Images) into a ZIP and place into the `./build` folder
  - Package each Key Message in it's own ZIP, along with it's thumb and poster images, and place in the `./build` folder
  
*ToDo: Use the Key Messages JSON file instead of the HTML files in the root!!* 

#### gulp generateVaultCsv
- Uses the Key Message JSON files to generate a Vault CM Loader file (this will appear in the `./build` folder)

## And now? 
- Chuck the CSV file in the `./build` folder at the Valut CM Loader and watch it successfully get verified
- Upload your ZIP files from the `./build` folder 
- Sit back and relax 
