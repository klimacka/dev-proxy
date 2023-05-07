import fs from "fs";
import path from "path";

export const fileNames = [
  "./config",
  "./data/known-api-targets",
  "./data/rules-collection",
  "./data/mockDb",
  "./data/api-response-snapshot/accounts",
  "./data/api-response-snapshot/features",
  "./data/api-response-snapshot/organizations",
];

export const prepareLocalCopy = (sourcePath: string, targetPath: string): void => {
  const source = path.resolve(sourcePath);
  const target = path.resolve(targetPath);

  if (!fs.existsSync(target) && fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    console.info(`Created ${target} from ${source}`);
  }
};

export const prepareExampleCopy = (sourcePath: string, targetPath: string): void => {
  const source = path.resolve(sourcePath);
  const target = path.resolve(targetPath);

  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
    console.info(`Removed old ${target}`);
  }

  if (!fs.existsSync(target) && fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    console.info(`Created ${target} from ${source}`);
  }
};
