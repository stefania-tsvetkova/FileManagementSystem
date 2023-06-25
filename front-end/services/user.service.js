import { RequestService } from './request.service.js';
import { NotificationService } from './notification.service.js';
import { UserSessionService } from './user-session.service.js';
import { UrlHelper } from '../helpers/url.helper.js';
import { UserTypes } from '../constants/user-types.constants.js';
import { SERVER_CODE_DIRECTORY } from '../constants/url.constants.js';

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();
const urlHelper = new UrlHelper();

export class UserService {
    emailExists(email) {
        let data = new URLSearchParams({
            email: email
        });

        return requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/emailExists.php`, data)
            .then(response => response == '1')
            .catch(error => notificationService.error(error));
    }

    async register(user) {
        let data = new FormData();
        data.append("email", user.email);
        data.append("name", user.name);
        data.append("familyName", user.familyName);
        data.append("passwordHash", user.passwordHash);

        const response = await requestService.post(`../../../../${SERVER_CODE_DIRECTORY}/register.php`, data)
            .catch(_ => notificationService.error('Registration unsuccessful due to a server error'));

        return response === '1';
    }

    async login(user) {
        let data = new URLSearchParams({
            email: user.email,
            passwordHash: user.passwordHash
        });

        const response = await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/login.php`, data)
            .catch(_ => notificationService.error('Login unsuccessful due to a server error'));

        if (response === 'false') {
            return false;
        }
        
        const userId = JSON.parse(response).id;
        return setLoggedInUser(userId, false);
    }

    async employeeLogin(user) {
        let data = new URLSearchParams({
            email: user.email,
            passwordHash: user.passwordHash
        });

        const response = await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/employeeLogin.php`, data)
            .catch(_ => notificationService.error('Login unsuccessful due to a server error'));
    
        if (response === 'false') {
            return false;
        }
        
        const userId = JSON.parse(response).id;
        return setLoggedInUser(userId, true);
    }

    logout() {
        userSessionService.removeCurrentUser();
        window.location.replace('../../../index.html');
    }
}

function setLoggedInUser(userId, isAdmin) {
    userSessionService.setCurrentUser(userId, isAdmin);

    const url = isAdmin ?
        urlHelper.constructUrl('files', UserTypes.Employee) :
        urlHelper.constructUrl('files', UserTypes.User);
    
    window.location.replace(url);

    return true;
}