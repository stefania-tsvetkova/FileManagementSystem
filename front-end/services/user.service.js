import { RequestService } from "./request.service.js";
import { NotificationService } from "./notification.service.js";
import { UrlService } from "./url.service.js";

const requestService = new RequestService();
const notificationService = new NotificationService();
const urlService = new UrlService();

export class UserService {
    async emailExists(email) {
        let data = new URLSearchParams({
            email: email
        });

        return await requestService.get('../../../back-end/emailExists.php', data)
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

        const isSuccessful = requestService.post('../../../back-end/register.php', data)
            .then(response => response == '1')
            .catch(error => notificationService.error(error));

        if (!isSuccessful) {
            notificationService.error(error);
        }

        const url = urlService.constructUrl('home');
        window.location.replace(url);
    }
}