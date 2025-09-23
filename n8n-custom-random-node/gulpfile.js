import pkg from 'gulp';
const { src, dest, parallel } = pkg;

function buildIcons() {
  console.log('Building icons...');
  return src('resources/*.svg')
    .pipe(dest('dist/nodes/Random/'));
}

function copyToIcons() {
  console.log('Copying to icons folder...');
  return src('resources/*.svg')
    .pipe(dest('dist/icons/'));
}

// Corrija a função buildAll
const buildAll = parallel(buildIcons, copyToIcons);

export const build = buildAll;
export { buildAll as 'build:icons' };
export default buildAll;