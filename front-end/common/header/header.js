import { UserTypes } from '../../constants/user-types.constants.js';
import { UrlHelper} from '../../helpers/url.helper.js'
import { UserService} from '../../services/user.service.js'

window.addHeader = addHeader;

const urlHelper = new UrlHelper();
const userService = new UserService();

async function addHeader() {
    await fetch('../../../common/header/header.html')
        .then(response => response.text())
        .then(headerHtml => document.body.insertAdjacentHTML("afterbegin", headerHtml));

    const filesUrl = urlHelper.constructUrl('files', UserTypes.User);
    document.getElementById("files-button").setAttribute("href", filesUrl);
    
    document.getElementById("logout-button").addEventListener("click", function() {
        userService.logout()
    });
}