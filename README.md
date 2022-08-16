<p align="center">
    <img align="center" src="/images/logo.png" width="150" height="150"></img>
</p>

<h1 align="center">1clickNFT</h1>

<div align="center">
    <img src="https://img.shields.io/vscode-marketplace/v/1clickNFT.1clicknft.svg?style=flat-square&color=blue&label=vscode%20marketplace" alt="Version" />
    <img src="https://img.shields.io/vscode-marketplace/d/1clickNFT.1clicknft.svg?style=flat-square&color=green&label=installs" alt="Installs"/>
    <img src="https://img.shields.io/vscode-marketplace/r/1clickNFT.1clicknft.svg?style=flat-square&color=green&label=rating" alt="Rating"/>
    <img src="https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square" alt="License">
</div><br>

<p align="center">1clickNFT allows you to instantly upload NFT data to <a href="https://ipfs.io/">IPFS</a> right from VS Code by using <a href="https://nft.storage/">nft.storage</a>.

## Steps to use

Open command palette

- Windows & Linux: `Ctrl + Shift + P`
- MacOS: `Command + Shift + P`

### 1. Select the folder

Select the folder of your NFT data by using `nft.select` command.

<img align="center" src="/images/select_command.png"></img>

After selecting the folder, the "Folder selected!" popup will appear.

<img align="center" src="/images/folder_selected.png"></img>

### 2. upload to IPFS

Now, upload your NFT data by using `nft.upload` command.

<img align="center" src="/images/upload_command.png"></img>

It'll take a few seconds to upload.

<img align="center" src="/images/uploading_to_ipfs.png"></img>

After uploading successfully, it'll show the IPFS `CID` of your NFT data and an option to open the IPFS gateway link.

<img align="center" src="/images/uploaded.png"></img>

## Working

1clickNFT uses nft.storage, basically it makes the content available over IPFS and permanently pins the content with the help of [Filecoin](https://filecoin.io/) infrastructure. Read more about nft.storage and how it works [here](https://nft.storage/docs/).

After uploading your NFT data to IPFS, nft.storage returns a [CID](https://docs.ipfs.io/concepts/content-addressing/) `Qmeq5NxNX644KHNji..`, which is a hash for an array of files stored on IPFS, and that later is combined with IPFS gateway link `https://nftstorage.link/ipfs/` to access your NFT data.

## License

1clickNFT is licensed under the [MIT License](https://github.com/akhileshthite/1clicknft/blob/main/LICENSE).
