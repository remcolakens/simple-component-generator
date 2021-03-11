#!/usr/bin/env node

const fs = require("fs-extra");
const inquirer = require("inquirer");
const replace = require("replace-in-file");

let BLUEPRINT_DIR, COMPONENT_DIR;

async function initGenerator() {
  fs.readJson(".blueprint.json")
    .then(async (config) => {
      await getPackage();

      if (config.blueprintDir && config.componentDir) {
        BLUEPRINT_DIR = config.blueprintDir.replace(/\/$|$/, "/");
        COMPONENT_DIR = config.componentDir.replace(/\/$|$/, "/");

        startInquirer();
      } else {
        console.warn(
          "\x1b[31m",
          "\n ERROR: .blueprint config was found, but values are incorrect \n"
        );
      }
    })
    .catch(async () => {
      await getPackage();

      console.warn(
        "\x1b[31m",
        "\n WARNING: .blueprint not found, using default settings \n"
      );
      BLUEPRINT_DIR = "./blueprint".replace(/\/$|$/, "/");
      COMPONENT_DIR = "./components".replace(/\/$|$/, "/");

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

    if (!fs.existsSync(`${COMPONENT_DIR}/${type}/${name}`)) {
      fs.mkdirSync(`${COMPONENT_DIR}/${type}/${name}`, { recursive: true });

      createComponent(name, type);

      console.log(
        "\x1b[36m%s\x1b[0m",
        `Congratulations, your component has been generated in ${COMPONENT_DIR}${type}/${name}`
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
        `${COMPONENT_DIR}/${type}/${name}/${file}`,
        (err) => {
          if (err) throw err;
        }
      );

      renameContent(
        `${COMPONENT_DIR}/${type}/${name}/${file}`,
        [/FILENAME/g],
        [capitalizeFirstLetter(name)]
      );
    } else {
      fs.copyFile(
        `${BLUEPRINT_DIR}${file}`,
        `${COMPONENT_DIR}/${type}/${name}/${name}.${fileExtension}`,
        (err) => {
          if (err) throw err;
        }
      );

      renameContent(
        `${COMPONENT_DIR}/${type}/${name}/${name}.${fileExtension}`,
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
async function getPackage() {
  try {
    const data = await fs.readJson("./package.json");
    console.log(`\n  Simple Component Generator ${data.version} \n`);
  } catch (err) {
    console.error(err);
  }
}

// start your app
initGenerator();
