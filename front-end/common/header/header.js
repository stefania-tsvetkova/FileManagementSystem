import { UrlHelper} from '../../helpers/url.helper.js'

window.addHeader = addHeader;

const urlHelper = new UrlHelper();

async function addHeader() {
    await fetch('../../common/header/header.html')
        .then(response => response.text())
        .then(headerHtml => document.body.insertAdjacentHTML("afterbegin", headerHtml));

    const uploadUrl = urlHelper.constructUrl('upload-file');
    document.getElementById("upload-button").setAttribute("href", uploadUrl);
    
    const filesUrl = urlHelper.constructUrl('files');
    document.getElementById("files-button").setAttribute("href", filesUrl);
    
    const logoutUrl = urlHelper.constructUrl('logout');
    document.getElementById("logout-button").setAttribute("href", logoutUrl);
}

document.body.addEventListener("load", function() {
});