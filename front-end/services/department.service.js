import { RequestService } from './request.service.js';
import { SERVER_CODE_DIRECTORY } from '../constants/url.constants.js';
import { NotificationService } from './notification.service.js';

const requestService = new RequestService();
const notificationService = new NotificationService();

export class DepartmentService {
    async getDepartments() {
        return await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/common/getDepartments.php`)
            .then(response => 
                JSON.parse(response)
                    .sort((a, b) => a.name.localeCompare(b.name)))
            .catch(_ => notificationService.error('Error getting departments'));
    }
}