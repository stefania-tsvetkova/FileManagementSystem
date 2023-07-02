import { RequestService } from './request.service.js';
import { NotificationService } from './notification.service.js';
import { UserSessionService } from './user-session.service.js';
import { UserTypes } from '../constants/user-types.constants.js';
import { SERVER_CODE_DIRECTORY } from '../constants/url.constants.js';

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

export class EmployeeService {
    emailExists(email) {
        let data = new URLSearchParams({
            email: email
        });

        return requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/employee/emailExists.php`, data)
            .then(response => response == '1')
            .catch(error => notificationService.error(error));
    }

    async login(user) {
        let data = new URLSearchParams({
            email: user.email,
            passwordHash: user.passwordHash
        });

        const response = await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/employee/login.php`, data)
            .catch(_ => notificationService.error('Login unsuccessful due to a server error'));
    
        if (response === 'false') {
            return false;
        }
        
        const userData = JSON.parse(response);
        const userType = userData.isAdmin ? UserTypes.Admin : UserTypes.Employee;

        userSessionService.setCurrentUser(userData.id, userType);
        window.location.replace('../../../index.html');

        return true;
    }

    async addEmployee(employee) {
        let data = new FormData();
        data.append("email", employee.email);
        data.append("name", employee.name);
        data.append("familyName", employee.familyName);
        data.append("passwordHash", employee.passwordHash);
        data.append("departmentId", employee.departmentId);
        data.append("isAdmin", employee.isAdmin ? 1 : 0);

        const response = await requestService.post(`../../../../${SERVER_CODE_DIRECTORY}/admin/addEmployee.php`, data)
            .catch(_ => notificationService.error('Adding employee unsuccessful due to a server error'));

        return response === '1';
    }

    async validatePassword(userId, passwordHash) {
        let data = new URLSearchParams({
            userId: userId,
            passwordHash: passwordHash
        });

        const response = await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/employee/validatePassword.php`, data)
            .catch(_ => notificationService.error('Old password validation unsuccessful due to a server error'));
            
        return response === '1';
    }

    async changePassword(employeeId, passwordHash) {
        let data = new URLSearchParams({
            employeeId: employeeId,
            passwordHash: passwordHash
        });

        const response = await requestService.put(`../../../../${SERVER_CODE_DIRECTORY}/employee/changePassword.php`, data)
            .catch(_ => notificationService.error('Change password due to a server error'));

        return response === '1';
    }
}