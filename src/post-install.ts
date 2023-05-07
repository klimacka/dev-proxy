import { fileNames, prepareLocalCopy } from "./example-files";

(function () {
  fileNames.forEach((path) => {
    prepareLocalCopy(`${path}.ts.example`, `${path}.local.ts`);
  });
})();
