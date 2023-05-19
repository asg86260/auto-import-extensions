# auto-import-extensions
Script to help with moving from webpack to vite. The script analyzes imports without file extensions and auto detects and updates the import with their extension.

This is a very barebones script that I wrote to help with upgrading our project from vue 2 and webpack to vue 3 and vite. Since vite requires all imports to have file extensions (.vue|.js, etc)
and I didn't want to manually update all our imports this script auto detected the imported modules filetype and updates the import.

We only have .vue and .js files so thats all i needed to handle. this could be updated to find the file, read the ext from `fs` and use that instead to support more .ts, .cjs, whatever else.

This also reads your aliases from your `vite.config.js` which it's assuming is in the root of your project. 

to run, just slap the script in your project next to your vite.config.js file and run it with node.


### running
- copy paste script next to your vite.config.js if you have one, or just the root of your project.
- if your code doesn't live in `src/` then you'll want to update the script to point at your path.
- `node index.js` will run it and output what files have been updated.


### whats supported
if you have files 
```
path/to/foo.vue
path/to/bar.js
path/to/fobar/index.js
```
and import them like this in vue 2 in webpack
```js
import foo from 'path/to/foo'
import { bar } from 'path/to/bar'
import { 
  foo,
  bar
} from 'path/to/foobar'
const comp = import('path/to/foo')
```

The result will be vite friendly
```js
import foo from 'path/to/foo.vue'
import { bar } from 'path/to/bar.js'
import { 
  foo,
  bar
} from 'path/to/foobar' // this will stay the same since its importing the index.js module.

const comp = import('path/to/foo.vue')
```
