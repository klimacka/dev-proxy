import { fileNames, prepareExampleCopy } from "./example-files";

(function () {
  fileNames.forEach((path) => {
    prepareExampleCopy(`${path}.local.ts`, `${path}.ts.example`);
  });
})();
