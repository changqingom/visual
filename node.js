//node v12.18
const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "./src");

let obj = {
  text: "",
  state: {
    opened: true,
  },
  children: [],
};

async function buildTreeObj(dirPath, temObj) {
  const dir = await fs.promises.opendir(dirPath);
  console.log(dir.path);
  let temArray = dirPath.split(path.sep);
  temObj.text = temArray[temArray.length - 1];
  for await (const dirent of dir) {
    let childObj = {
      text: "",
      state: {
        opened: true,
      },
      children: [],
    };
    if (!dirent.isDirectory()) {
      childObj.text = dirent.name;
      childObj.icon = false;
      delete childObj.state;
      delete childObj.children;
    } else {
      await buildTreeObj(path.join(dirPath, dirent.name), childObj);
    }
    temObj.children.push(childObj);
  }
}
function saveHtml() {
  fs.writeFileSync(
    path.join(__dirname, "dir.html"),
    `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css"
      />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js"></script>
    </head>
    <body>
      <h3>${dirPath} Directory Tree</h3>
      <div id="tree"></div>
    </body>
    <script>
      $(function() {
        $("#tree").jstree({
          core: {
            data: ${JSON.stringify(obj.children)}
          },
        });
      });
    </script>
  </html>
  `
  );
}
async function main() {
  await buildTreeObj(dirPath, obj);
  saveHtml();
}
main();
