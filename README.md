<div align="center">

# Puppeteer IDE Extension

![lint](https://github.com/gajananpp/puppeteer-ide-extension/actions/workflows/lint.yml/badge.svg) 
![build](https://github.com/gajananpp/puppeteer-ide-extension/actions/workflows/build.yml/badge.svg) 

A standalone extension to develop, test and execute puppeteer scripts from browser's developer tools.

[Installation](#installation) •
[Usage](#usage) •
[Screenshots](#screenshots) •
[Privacy](#privacy) •
[Build From Source](#build-from-source) •
[FAQs](#faq)

<img src="assets/pptr-ide-extension.webp" alt="Demo GIF" width="800" style="box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;" />


</div>



## Installation
This extension is published on chrome web store.

<a class="btn" href="https://chrome.google.com/webstore/detail/puppeteer-ide/ilehdekjacappgghkgmmlbhgbnlkgoid" style="width: 250px;display: flex;flex-direction: row;justify-content: space-around;align-items: center;">
<svg viewbox="0 0 192 192" style="width: 50px;"><defs><path id="a" d="M8 20v140c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12V20H8zm108 32H76c-4.42 0-8-3.58-8-8s3.58-8 8-8h40c4.42 0 8 3.58 8 8s-3.58 8-8 8z"></path></defs><clippath id="b"><use xlink:href="#a" overflow="visible"></use></clippath><path clip-path="url(#b)" fill="#eee" d="M8 20h176v152H8z"></path><path fill="#fff" d="M116 36H76c-4.42 0-8 3.58-8 8s3.58 8 8 8h40c4.42 0 8-3.58 8-8s-3.58-8-8-8z" clip-path="url(#b)"></path><g clip-path="url(#b)"><defs><circle id="c" cx="96" cy="160" r="76"></circle></defs><clippath id="d"><use xlink:href="#c" overflow="visible"></use></clippath><path d="M32.07 84v93.27h34.01L96 125.45h76V84zm0 0v93.27h34.01L96 125.45h76V84z" clip-path="url(#d)" fill="#DB4437"></path><path d="M20 236h72.34l33.58-33.58v-25.14l-59.84-.01L20 98.24zm0 0h72.34l33.58-33.58v-25.14l-59.84-.01L20 98.24z" clip-path="url(#d)" fill="#0F9D58"></path><path d="M96 125.45l29.92 51.82L92.35 236H172V125.45zm0 0l29.92 51.82L92.35 236H172V125.45z" clip-path="url(#d)" fill="#FFCD40"></path></g><g clip-path="url(#d)"><circle fill="#F1F1F1" cx="96" cy="160" r="34.55"></circle><circle fill="#4285F4" cx="96" cy="160" r="27.64"></circle></g><path clip-path="url(#b)" fill="#212121" fill-opacity=".05" d="M8 20h176v76H8z"></path><path fill="#212121" fill-opacity=".02" d="M8 95h176v1H8z"></path><path fill="#fff" fill-opacity=".05" d="M8 96h176v1H8z"></path><path fill="#212121" fill-opacity=".02" d="M116 52H76c-4.25 0-7.72-3.32-7.97-7.5-.02.17-.03.33-.03.5 0 4.42 3.58 8 8 8h40c4.42 0 8-3.58 8-8 0-.17-.01-.33-.03-.5-.25 4.18-3.72 7.5-7.97 7.5zM8 20v1h176v-1H8z"></path><path fill="#231F20" fill-opacity=".1" d="M76 36h40c4.25 0 7.72 3.32 7.97 7.5.01-.17.03-.33.03-.5 0-4.42-3.58-8-8-8H76c-4.42 0-8 3.58-8 8 0 .17.01.33.03.5.25-4.18 3.72-7.5 7.97-7.5zm96 135H20c-6.6 0-12-5.4-12-12v1c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12v-1c0 6.6-5.4 12-12 12z"></path><radialgradient id="e" cx="7.502" cy="19.344" r="227.596" gradientunits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".1"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></radialgradient><path fill="url(#e)" d="M8 20v140c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12V20H8zm108 32H76c-4.42 0-8-3.58-8-8s3.58-8 8-8h40c4.42 0 8 3.58 8 8s-3.58 8-8 8z"></path><path fill="none" d="M0 0h192v192H0z"></path></svg>
  <div style="display: flex;flex-direction: column;justify-content: space-around;align-items: center;">
  <span style="font-weight: lighter;font-size: 12px;">Add from</span><span style="white-space: nowrap;font-weight: bold;font-size: 18px;">Chrome Web Store</span>   
  </div>
</a>

## Usage

This extension will add an extra tab named "Puppeteer IDE" in browser's developer tools from where you can write and execute puppeteer scripts.

You can access [page](https://pptr.dev/#?product=Puppeteer&version=v13.0.0&show=api-class-page) instance variable directly for the tab in which developer tools is opened. 

On clicking `Execute` button, the script will be executed on the inspected tab.

The script will be auto saved as you are editing it.

## Screenshots

The editor will take the theme of developer tools. [Here is a guide](https://developer.chrome.com/docs/devtools/customize/dark-theme/) which shows how to customize developer tool's theme.

Dark theme :- 
<img alt="Dark Theme" src="assets/screenshots/screen-1.webp" style="box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;" />

<br>

Light theme :- 
<img alt="Light Theme" src="assets/screenshots/screen-2.webp" style="box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;" />


## Build From Source

To build extension from source :-
```
git clone https://github.com/gajananpp/puppeteer-ide-extension

cd puppeteer-ide-extension

npm install

npm run dist
```
This will output extension in dist folder which you can load in your browser by following this [steps](https://developer.chrome.com/docs/extensions/mv3/getstarted/#:~:text=The%20directory%20holding%20the%20manifest%20file%20can%20be%20added%20as%20an%20extension%20in%20developer%20mode%20in%20its%20current%20state.).

## Privacy
This extension is standalone. **It doesn't make any external api calls**. You can inspect network of page/extension and source code in this repo.


## FAQ

**Q: Does this extension have any external dependency ?**
<br>
No. This extension internally uses [chrome.debugger](https://developer.chrome.com/docs/extensions/reference/debugger/) api and is standalone, so there is no requirement of starting browser with remote debugging cli flag or having nodejs or any other service running. 

<br>

**Q: On which browsers can this extension be installed ?**
<br>
This extension only works with chrome and other chromium based browsers like edge, brave etc.

<br>

**Q: Execution stops abruptly when page navigates ?**
<br>
Some other extensions may cause this issue, especially 3rd party extensions which are added by desktop applications. One particular extension is `Adobe Acrobat` which is added by Adobe's desktop application.
You can disable this extension and try again executing.

<br>

**Q: From where can this extension be installed ?**
<br>
This extension is published on chrome web store.

<a class="btn" href="https://chrome.google.com/webstore/detail/puppeteer-ide/ilehdekjacappgghkgmmlbhgbnlkgoid" style="width: 250px;display: flex;flex-direction: row;justify-content: space-around;align-items: center;">
<svg viewbox="0 0 192 192" style="width: 50px;"><defs><path id="a" d="M8 20v140c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12V20H8zm108 32H76c-4.42 0-8-3.58-8-8s3.58-8 8-8h40c4.42 0 8 3.58 8 8s-3.58 8-8 8z"></path></defs><clippath id="b"><use xlink:href="#a" overflow="visible"></use></clippath><path clip-path="url(#b)" fill="#eee" d="M8 20h176v152H8z"></path><path fill="#fff" d="M116 36H76c-4.42 0-8 3.58-8 8s3.58 8 8 8h40c4.42 0 8-3.58 8-8s-3.58-8-8-8z" clip-path="url(#b)"></path><g clip-path="url(#b)"><defs><circle id="c" cx="96" cy="160" r="76"></circle></defs><clippath id="d"><use xlink:href="#c" overflow="visible"></use></clippath><path d="M32.07 84v93.27h34.01L96 125.45h76V84zm0 0v93.27h34.01L96 125.45h76V84z" clip-path="url(#d)" fill="#DB4437"></path><path d="M20 236h72.34l33.58-33.58v-25.14l-59.84-.01L20 98.24zm0 0h72.34l33.58-33.58v-25.14l-59.84-.01L20 98.24z" clip-path="url(#d)" fill="#0F9D58"></path><path d="M96 125.45l29.92 51.82L92.35 236H172V125.45zm0 0l29.92 51.82L92.35 236H172V125.45z" clip-path="url(#d)" fill="#FFCD40"></path></g><g clip-path="url(#d)"><circle fill="#F1F1F1" cx="96" cy="160" r="34.55"></circle><circle fill="#4285F4" cx="96" cy="160" r="27.64"></circle></g><path clip-path="url(#b)" fill="#212121" fill-opacity=".05" d="M8 20h176v76H8z"></path><path fill="#212121" fill-opacity=".02" d="M8 95h176v1H8z"></path><path fill="#fff" fill-opacity=".05" d="M8 96h176v1H8z"></path><path fill="#212121" fill-opacity=".02" d="M116 52H76c-4.25 0-7.72-3.32-7.97-7.5-.02.17-.03.33-.03.5 0 4.42 3.58 8 8 8h40c4.42 0 8-3.58 8-8 0-.17-.01-.33-.03-.5-.25 4.18-3.72 7.5-7.97 7.5zM8 20v1h176v-1H8z"></path><path fill="#231F20" fill-opacity=".1" d="M76 36h40c4.25 0 7.72 3.32 7.97 7.5.01-.17.03-.33.03-.5 0-4.42-3.58-8-8-8H76c-4.42 0-8 3.58-8 8 0 .17.01.33.03.5.25-4.18 3.72-7.5 7.97-7.5zm96 135H20c-6.6 0-12-5.4-12-12v1c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12v-1c0 6.6-5.4 12-12 12z"></path><radialgradient id="e" cx="7.502" cy="19.344" r="227.596" gradientunits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".1"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></radialgradient><path fill="url(#e)" d="M8 20v140c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12V20H8zm108 32H76c-4.42 0-8-3.58-8-8s3.58-8 8-8h40c4.42 0 8 3.58 8 8s-3.58 8-8 8z"></path><path fill="none" d="M0 0h192v192H0z"></path></svg>
  <div style="display: flex;flex-direction: column;justify-content: space-around;align-items: center;">
  <span style="font-weight: lighter;font-size: 12px;">Add from</span><span style="white-space: nowrap;font-weight: bold;font-size: 18px;">Chrome Web Store</span>   
  </div>
</a>


<br>

**Q: How can be puppeteer script executed in extension ?**
<br>
Check out [puppeteer-extension-transport](https://github.com/gajananpp/puppeteer-extension-transport) package.

<br>

