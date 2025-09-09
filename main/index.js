import { writeFile, getFiles } from "../utils/Utils.js";

// const files = getFiles("./db/");
// console.log(files);

// files.forEach(file => {
//     writeFile(`./out/${file.replace(".cds", ".md")}`, `./db/${file}`);
// })

writeFile("./files/categoryValueLever-schema.md", "./db/categoryValueLever-schema.cds");