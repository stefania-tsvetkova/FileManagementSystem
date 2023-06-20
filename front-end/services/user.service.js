import { RequestService } from "./request.service.js";
import { NotificationService } from "./notification.service.js";

const requestService = new RequestService();
const notificationService = new NotificationService();

export class UserService {
    emailExists(email) {
        let data = new URLSearchParams({
            email: email
        });

        return requestService.get('../../../back-end/emailExists.php', data)
            .then(response => response == '1')
            .catch(error => notificationService.error(error));
    }

    register(user) {
        let data = new URLSearchParams({
            email: user.email,
            name: user.name,
            familyName: user.familyName,
            passwordHash: user.passwordHash
        });

        return requestService.post('../../../back-end/register.php', data)
            .then(response => response == '1')
            .catch(error => notificationService.error(error));
    }

    login(user) {
        let data = new URLSearchParams({
            email: user.email,
            passwordHash: user.passwordHash
        });

        return requestService.get('../../../back-end/login.php', data)
            .then(response => response == '1')
            .catch(error => notificationService.error(error));
    }
}