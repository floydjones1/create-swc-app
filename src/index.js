import fs from "fs";
import path from "path";
import chalk from "chalk";
import ncp from "ncp";
import { promisify } from "util";
import { fileURLToPath } from "url";
import Listr from "listr";

const access = promisify(fs.access);
const copy = promisify(ncp);
const log = console.log;

const argList = [
  { flag: "template", default: "react-ts", templateDir: "/template/react-ts" },
];

export const cli = (args) => {
  const dest = args._[0] ? args._[0] : "my-app";

  validateArgs(args);
  const options = { targetDir: dest, ...getOptions(args) };

  createProject(options).catch((err) => console.error(err));
};

const createProject = async (opts) => {
  const templateDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../templates",
    opts.template.toLowerCase()
  );
  opts.templateDir = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    log(chalk.bgRed(`\nInvalid tempalte directory`, err));
    process.exit(1);
  }

  if (fs.existsSync(opts.targetDir)) {
    log(
      chalk.bgRed(
        `\nFolder "${opts.targetDir}" already exist, please delete and run this command again\n`
      )
    );
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: "Copying project files",
      task: () => copyTemplateFiles(opts),
    },
  ]);
  await tasks.run();
  log(
    `\nDone project setup, please install packages and then run:\n 
    ${chalk.green("npm start")} or ${chalk.green("yarn start")}`
  );
};

const getOptions = (args) => {
  let options = {};
  for (const arg of argList) {
    if (!args[arg.flag]) {
      options[arg.flag] = arg.default;
      continue;
    }
    options[arg.flag] = args[arg.flag];
  }
  return options;
};

const validateArgs = (args) => {
  const { _, ...rest } = args;
  const userArgs = Object.keys(rest);
  for (const userArg of userArgs) {
    const found = argList.find((arg) => arg.flag === userArg);
    if (!found) {
      log(chalk.bgRed(`\nUnknown arg ${userArg}`));
      process.exit();
    }
  }
};

const copyTemplateFiles = (opts) => {
  return copy(opts.templateDir, opts.targetDir, {
    clobber: false,
    stopOnErr: true,
  });
};
