
const fs = require('fs');
const util = require('util');
const fileSize = require('filesize');
const childProcess = require('child_process');

const exec = util.promisify(childProcess.exec);
const fsStat = util.promisify(fs.stat);

module.exports = async function createSubset({
  fontFile,
  unicodeRange,
  flavor,
  outputFile,
  noSubsetTables,
}) {
  const flags = [
    flavor ? ` --flavor="${flavor}"` : '',
    unicodeRange ? ` --unicodes="${unicodeRange}"` : '',
    outputFile ? ` --output-file="${outputFile}"` : '',
    noSubsetTables ? ` --no-subset-tables+="${noSubsetTables}"` : '',
  ];

  const command = `pyftsubset ${fontFile}${flags.join('')}`;
  const { stderr } = await exec(command);
  const { size } = await fsStat(outputFile);

  if (stderr) {
    throw stderr;
  }

  // eslint-disable-next-line no-console
  console.log('+ ', `${outputFile} - ${fileSize(size)}`);
};
