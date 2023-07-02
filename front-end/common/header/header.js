import { UserTypes } from '../../constants/user-types.constants.js';
import { UrlHelper} from '../../helpers/url.helper.js';
import { UserService} from '../../services/user.service.js';
import { UserSessionService} from '../../services/user-session.service.js';

window.addHeader = addHeader;

const urlHelper = new UrlHelper();
const userService = new UserService();
const userSessionService = new UserSessionService();

async function addHeader() {
    if (!userSessionService.isUserLoggedIn()) {
        window.location.replace('../../../index.html');
    }

    const userTypeLowercase = userSessionService.getCurrentUserType().toLowerCase();
    await fetch(`../../../common/header/${userTypeLowercase}-header.html`)
        .then(response => response.text())
        .then(headerHtml => document.body.insertAdjacentHTML('afterbegin', headerHtml));

    document.getElementById('logout-button').addEventListener('click', function() {
        userService.logout()
    });

    switch (userSessionService.getCurrentUserType()) {
        case UserTypes.User: addUserHeaderLinks(); break;
        case UserTypes.Employee: addEmployeeHeaderLinks(); break;
        case UserTypes.Admin: addAdminHeaderLinks(); break;
    }
}

function addUserHeaderLinks() {
    const filesUrl = urlHelper.constructUrl('files', UserTypes.User);
    document.getElementById('files-button').setAttribute('href', filesUrl);
    
    const changePasswordUrl = urlHelper.constructUrl('change-password', UserTypes.User);
    document.getElementById('change-password-button').setAttribute('href', changePasswordUrl);
}

function addEmployeeHeaderLinks() {
    const filesUrl = urlHelper.constructUrl('files', UserTypes.Employee);
    document.getElementById('files-button').setAttribute('href', filesUrl);
    
    const changePasswordUrl = urlHelper.constructUrl('change-password', UserTypes.Employee);
    document.getElementById('change-password-button').setAttribute('href', changePasswordUrl);
}

function addAdminHeaderLinks() {
    const filesUrl = urlHelper.constructUrl('files', UserTypes.Employee);
    document.getElementById('files-button').setAttribute('href', filesUrl);
    
    const employeesUrl = urlHelper.constructUrl('employees', UserTypes.Admin);
    document.getElementById('employees-button').setAttribute('href', employeesUrl);
    
    const changePasswordUrl = urlHelper.constructUrl('change-password', UserTypes.Employee);
    document.getElementById('change-password-button').setAttribute('href', changePasswordUrl);
}