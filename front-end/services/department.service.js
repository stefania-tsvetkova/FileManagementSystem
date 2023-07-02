import { RequestService } from './request.service.js';
import { SERVER_CODE_DIRECTORY } from '../constants/url.constants.js';

const requestService = new RequestService();

export class DepartmentService {
    async getDepartments() {
        return await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/getDepartments.php`)
            .then(response => 
                JSON.parse(response)
                    .sort((a, b) => a.name.localeCompare(b.name)))
            .catch(_ => notificationService.error('Error getting departments'));
    }
}