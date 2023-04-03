// Dependencies
const vscode = require("vscode");
const { NFTStorage } = require("nft.storage");
const dotenv = require("dotenv");
const { selectFolder } = require("./options");
const { getFilesFromPath } = require("files-from-path");
const fs = require("fs");

// Environment variable paths
const folderPath = __dirname + "/.folderPath.env";
dotenv.config({ path: folderPath });
const apiToken = __dirname + "/.env";
dotenv.config({ path: apiToken });

// nft.storage API token
function getToken() {
  return process.env.API_TOKEN;
}

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

// Validate nft.storage API token
function isValidNFTStorageApiKey(apiKey) {
  const pattern = /^eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
  return pattern.test(apiKey);
}

// Set nft.storage API token
async function setApiToken() {
  const userToken = await vscode.window.showInputBox({
    placeHolder: "Enter your nft.storage API token",
    prompt: "API Token",
    ignoreFocusOut: true,
  });

  if (userToken && isValidNFTStorageApiKey(userToken)) {
    process.env.API_TOKEN = userToken;
    try {
      fs.writeFileSync(apiToken, `API_TOKEN=${userToken}`);
      vscode.window.showInformationMessage("API token saved!");
      // Set nft.storage API token
      const client = new NFTStorage({ token: getToken() });
    } catch (e) {
      console.log(e);
    }
  } else {
    vscode.window.showWarningMessage(
      "Invalid API key. Please enter a valid nft.storage API key."
    );
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Set nft.storage API token
  context.subscriptions.push(
    vscode.commands.registerCommand("nft.token", async () => {
      await setApiToken();
    })
  );
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
            // Set nft.storage API token
            const client = new NFTStorage({ token: getToken() });
            // Upload to IPFS and return a CID
            try {
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
            } catch (e) {
              const message =
                "Please submit your valid nft.storage API token using the 'nft.token' command before uploading the data. Instructions are provided on the extension homepage.";
              const action = {
                title: "Set API token",
                command: "nft.token",
              };
              const selectedAction = await vscode.window.showWarningMessage(
                message,
                action
              );
              if (selectedAction === action) {
                await vscode.commands.executeCommand("nft.token");
              }
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
