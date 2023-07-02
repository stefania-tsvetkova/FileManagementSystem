import { RequestService } from './request.service.js';
import { NotificationService } from './notification.service.js';
import { UserSessionService } from './user-session.service.js';
import { UserTypes } from '../constants/user-types.constants.js';
import { SERVER_CODE_DIRECTORY } from '../constants/url.constants.js';

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

export class UserService {
    emailExists(email) {
        let data = new URLSearchParams({
            email: email
        });

        return requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/user/emailExists.php`, data)
            .then(response => response == '1')
            .catch(error => notificationService.error(error));
    }

    async register(user) {
        let data = new FormData();
        data.append("email", user.email);
        data.append("name", user.name);
        data.append("familyName", user.familyName);
        data.append("passwordHash", user.passwordHash);

        const response = await requestService.post(`../../../../${SERVER_CODE_DIRECTORY}/user/register.php`, data)
            .catch(_ => notificationService.error('Registration unsuccessful due to a server error'));

        return response === '1';
    }

    async login(user) {
        let data = new URLSearchParams({
            email: user.email,
            passwordHash: user.passwordHash
        });

        const response = await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/user/login.php`, data)
            .catch(_ => notificationService.error('Login unsuccessful due to a server error'));

        if (response === 'false') {
            return false;
        }
        
        const userId = JSON.parse(response).id;
        
        userSessionService.setCurrentUser(userId, UserTypes.User);
        window.location.replace('../../../index.html');

        return true;
    }

    logout() {
        userSessionService.removeCurrentUser();
        window.location.replace('../../../index.html');
    }

    async validatePassword(userId, passwordHash) {
        let data = new URLSearchParams({
            userId: userId,
            passwordHash: passwordHash
        });

        const response = await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/user/validatePassword.php`, data)
            .catch(_ => notificationService.error('Old password validation unsuccessful due to a server error'));

        return response === '1';
    }

    async changePassword(userId, passwordHash) {
        let data = new URLSearchParams({
            userId: userId,
            passwordHash: passwordHash
        });

        const response = await requestService.put(`../../../../${SERVER_CODE_DIRECTORY}/user/changePassword.php`, data)
            .catch(_ => notificationService.error('Change password due to a server error'));

        return response === '1';
    }
}