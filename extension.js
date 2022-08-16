// Dependencies
const vscode = require("vscode");
const { NFTStorage } = require("nft.storage");
const dotenv = require("dotenv");
const { selectFolder } = require("./options");
const { getFilesFromPath } = require("files-from-path");

// Environment variable paths
const folderPath = __dirname + "/.folderPath.env";
dotenv.config({ path: folderPath });
const apiToken = __dirname + "/.env";
dotenv.config({ path: apiToken });

// nft.storage API token
const token = process.env.API_TOKEN;
const client = new NFTStorage({ token });

// Get files from path
async function getFiles(path) {
  const files = await getFilesFromPath(path);
  files.forEach((file) => {
    if (file.name.charAt(0) === "/") {
      file.name = file.name.split("/").slice(2).join("/");
    } else {
      file.name = file.name.split("/").slice(1).join("/");
    }
  });
  return files;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Select folder
  context.subscriptions.push(
    vscode.commands.registerCommand("nft.select", async () => {
      await selectFolder();
    })
  );
  // Upload NFT data to IPFS
  context.subscriptions.push(
    vscode.commands.registerCommand("nft.upload", async () => {
      let path = process.env.FOLDER_PATH;
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Window,
          cancellable: false,
          title: "Uploading the NFT data to IPFS...",
        },
        async (progress) => {
          progress.report({ increment: 0 });
          let upload = async () => {
            // Get files
            const files = await getFiles(path);
            // Upload to IPFS and return a CID
            const cid = await client.storeDirectory(files);
            progress.report({ increment: 100 });
            const result = await vscode.window.showInformationMessage(
              `Successfully uploaded! Here's the IPFS CID of your NFT data: ${cid}`,
              "Open the link"
            );
            if (result === "Open the link") {
              vscode.env.openExternal(
                vscode.Uri.parse(`https://nftstorage.link/ipfs/${cid}/`)
              );
            }
          };
          await upload();
        }
      );
    })
  );
}
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
