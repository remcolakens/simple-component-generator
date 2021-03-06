#!/usr/bin/env node

const fs = require("fs-extra");
const inquirer = require("inquirer");
const replace = require("replace-in-file");
const pkgDir = require('pkg-dir');

let BLUEPRINT_DIR, COMPONENT_DIR, WITH_COMPONENT_TYPE, TYPE_DIR;

async function initGenerator() {
  fs.readJson(".blueprint.json")
    .then(async (config) => {
      await getPackage();

      if (config.blueprintDir && config.componentDir) {
        BLUEPRINT_DIR = config.blueprintDir.replace(/\/$|$/, "/");
        COMPONENT_DIR = config.componentDir.replace(/\/$|$/, "/");
        WITH_COMPONENT_TYPE = Boolean(config.withTypeDir);

        startInquirer();
      } else {
        console.warn(
          "\x1b[31m",
          "\n ERROR: .blueprint config was found, but values are incorrect \n"
        );
      }
    })
    .catch(async () => {
      const rootDir = await pkgDir(__dirname);
      await getPackage(rootDir);

      console.warn(
        "\x1b[31m",
        "\n WARNING: .blueprint not found, using default settings \n"
      );
      BLUEPRINT_DIR = `${rootDir}/blueprint`.replace(/\/$|$/, "/");
      COMPONENT_DIR = `./components`.replace(/\/$|$/, "/");
      WITH_COMPONENT_TYPE = true;

      startInquirer();
    });
}

function startInquirer() {
  // question data
  const data = [
    {
      name: "component-type",
      type: "list",
      message: "What template would you like to generate?",
      choices: ["atoms", "molecules", "organisms"],
    },
    {
      name: "component-name",
      type: "input",
      message: "Component name:",
      validate: function (input) {
        if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
        else
          return "Component name may only include letters, numbers, underscores and dashes.";
      },
    },
  ];

  // init questionnaire
  inquirer.prompt(data).then((answers) => {
    const name = answers["component-name"];
    const type = answers["component-type"];

    TYPE_DIR = WITH_COMPONENT_TYPE ? `${type}/` : "";

    if (!fs.existsSync(`${COMPONENT_DIR}${TYPE_DIR}${name}`)) {
      fs.mkdirSync(`${COMPONENT_DIR}${TYPE_DIR}${name}`, { recursive: true });

      createComponent(name, type);

      console.log(
        "\x1b[36m%s\x1b[0m",
        `Congratulations, your component has been generated in ${COMPONENT_DIR}${TYPE_DIR}${name}`
      );
    } else {
      console.error("\x1b[31m", "The directory already exist");
    }
  });
}

function createComponent(name, type) {
  const files = fs.readdirSync(BLUEPRINT_DIR);

  files.forEach((file) => {
    const fileExtension = RegExp(/\.(.*)$/).exec(file)[1];

    if (file === "types.ts") {
      fs.copyFile(
        `${BLUEPRINT_DIR}${file}`,
        `${COMPONENT_DIR}${TYPE_DIR}${name}/${file}`,
        (err) => {
          if (err) throw err;
        }
      );

      renameContent(
        `${COMPONENT_DIR}${TYPE_DIR}${name}/${file}`,
        [/FILENAME/g],
        [capitalizeFirstLetter(name)]
      );
    } else {
      fs.copyFile(
        `${BLUEPRINT_DIR}${file}`,
        `${COMPONENT_DIR}${TYPE_DIR}${name}/${name}.${fileExtension}`,
        (err) => {
          if (err) throw err;
        }
      );

      renameContent(
        `${COMPONENT_DIR}${TYPE_DIR}${name}/${name}.${fileExtension}`,
        [/PLACEHOLDER/g, /FILENAME/g, /COMPONENTTYPE/g],
        [name, capitalizeFirstLetter(name), capitalizeFirstLetter(type)]
      );
    }
  });
}

// rename placeholder strings
function renameContent($files, $from, $to) {
  replace({
    files: $files,
    from: $from,
    to: $to,
  }).catch((err) => {
    throw err;
  });
}

// return first letter in capital
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// read package.json
async function getPackage(directory) {
  try {
    const data = await fs.readJson(`${directory}/package.json`);
    console.log(`\n  Simple Component Generator ${data.version} \n`);
  } catch (err) {
    console.log(`\n Simple Component Generator \n`);
  }
}

// start your app
initGenerator();
