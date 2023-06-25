import { UserSessionService } from './services/user-session.service.js';
import { UrlHelper } from './helpers/url.helper.js';
import { UserTypes } from './constants/user-types.constants.js';

const userSessionService = new UserSessionService();
const urlHelper = new UrlHelper();
    
let url;
if (!userSessionService.isUserLoggedIn()) {
    url = urlHelper.constructUrl('register', UserTypes.User);
}
else {
    url = urlHelper.constructUrl('files', UserTypes.User);
}

window.location.replace(url);