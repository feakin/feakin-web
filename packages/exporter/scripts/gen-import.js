const glob = require('glob');
const path = require('path');

function notSpecFile(file) {
  return !file.endsWith('.spec.ts');
}

new Promise((resolve, reject) => {
  const parent = path.resolve(__dirname, '..');
  glob(parent + '/src/**/*.ts', function (err, res) {

    if (err) {
      reject(err)
    } else {
      Promise.all(
        res
          .filter(file => notSpecFile(file))
          .map(file => {
            const relativePath = path.relative(path.resolve(parent, "src"), file);

            if (relativePath === 'index.ts') {
              return '';
            }

            const string = relativePath.replace(__dirname, '.').replace('.ts', '');
            return `export * from './${ string }';`;
          })
      ).then(modules => {
        resolve(modules)
      })
    }
  })
}).then(modules => {
  console.log(modules.join("\n"));
})
