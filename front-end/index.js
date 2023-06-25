import { UserSessionService } from './services/user-session.service.js';
import { UrlHelper } from './helpers/url.helper.js';
import { UserTypes } from './constants/user-types.constants.js';

const userSessionService = new UserSessionService();
const urlHelper = new UrlHelper();
    
const url = userSessionService.isUserLoggedIn() ?
urlHelper.constructUrl('files', UserTypes.User) : 
urlHelper.constructUrl('register', UserTypes.User);

window.location.replace(url);