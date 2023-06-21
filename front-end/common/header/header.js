import { UrlHelper} from '../../helpers/url.helper.js'
import { UserSessionService} from '../../services/user-session.service.js'

window.addHeader = addHeader;

const urlHelper = new UrlHelper();
const userSessionService = new UserSessionService();

async function addHeader() {
    await fetch('../../common/header/header.html')
        .then(response => response.text())
        .then(headerHtml => document.body.insertAdjacentHTML("afterbegin", headerHtml));

    const uploadUrl = urlHelper.constructUrl('upload-file');
    document.getElementById("upload-button").setAttribute("href", uploadUrl);
    
    const filesUrl = urlHelper.constructUrl('files');
    document.getElementById("files-button").setAttribute("href", filesUrl);
    
    document.getElementById("logout-button").addEventListener("click", function() {
        userSessionService.removeCurrentUser();
        window.location.replace('../../index.html');
    });
}