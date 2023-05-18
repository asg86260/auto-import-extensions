# auto-import-extensions
Script to help with the vue@2 -> vue@3 upgrade. analyze imports without file extensions and auto detect their extension.

This is a very barebones script that I wrote to help with upgrading our project from vue 2 to vue 3. Since vue 3 requires all imports to have file extensions (.vue|.js, etc)
and I didn't want to manually update all our imports this script auto detected the imported modules filetype and updates the import.

We only have .vue and .js files so thats all i needed to handle. this could be updated to find the file, read the ext from `fs` and use that instead to support more .ts, .cjs, whatever else.

This also reads your aliases from your `vite.config.js` which it's assuming is in the root of your project. 

to run, just slap the script in your project next to your vite.config.js file and run it with node.
