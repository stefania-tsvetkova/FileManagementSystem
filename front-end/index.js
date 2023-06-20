import { UserSessionService } from './services/user-session.service.js';
import { UrlHelper } from './services/url.service.js';

const userSessionService = new UserSessionService();
const urlHelper = new UrlHelper();
    
if (!userSessionService.isUserLoggedIn()) {
    const url = urlHelper.constructUrl('register');
    window.location.replace(url);
}