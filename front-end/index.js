import { UserSessionService } from './services/user-session.service.js';
import { UrlHelper } from './helpers/url.helper.js';

const userSessionService = new UserSessionService();
const urlHelper = new UrlHelper();
    
let url;
if (!userSessionService.isUserLoggedIn()) {
    url = urlHelper.constructUrl('register');
}
else {
    url = urlHelper.constructUrl('home');
}

window.location.replace(url);