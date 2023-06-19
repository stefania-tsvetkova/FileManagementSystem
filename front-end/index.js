import { UserSessionService } from './services/user-session.service.js';
import { UrlService } from './services/url.service.js';

const userSessionService = new UserSessionService();
const urlService = new UrlService();
    
if (!userSessionService.isUserLoggedIn()) {
    const url = urlService.constructUrl('register');
    window.location.replace(url);
}