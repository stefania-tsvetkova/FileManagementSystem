import { UserService } from '../../services/user.service.js';
import { EmployeeService } from '../../services/employee.service.js';
import { HashHelper } from '../../helpers/hash.helper.js';
import { DataValidationHelper} from '../../helpers/data-validation.helper.js'
import { FormHelper} from '../../helpers/form.helper.js'
import { UserTypes } from '../../constants/user-types.constants.js';
import { UserSessionService } from '../../services/user-session.service.js';
import { NotificationService } from '../../services/notification.service.js';

window.bodyLoaded = bodyLoaded;
window.validateOldPassword = validateOldPassword;
window.validateNewPassword = validateNewPassword;
window.validateConfirmNewPassword = validateConfirmNewPassword;
window.changePassword = changePassword;

const userService = new UserService();
const employeeService = new EmployeeService();
const hashHelper = new HashHelper();
const dataValidationHelper = new DataValidationHelper();
const formHelper = new FormHelper();
const userSessionService = new UserSessionService();
const notificationService = new NotificationService();

async function bodyLoaded() {
    await fetch('../../../common/change-password-page/change-password-page.html')
        .then(response => response.text())
        .then(pageHtml => document.body.insertAdjacentHTML('afterbegin', pageHtml));
}

async function changePassword() {
    formHelper.clearFormErrors();

    const isFormValid = await validateForm();
    if (!isFormValid) {
        return;
    }
    
    const newPassword = document.getElementById('new-password').value;
    const newPasswordHash = await hashHelper.getSHA256Hash(newPassword);

    const service = userSessionService.getCurrentUserType() == UserTypes.User ? userService : employeeService;
    let isPasswordChanged = await service.changePassword(userSessionService.getCurrentUserId(), newPasswordHash);
    
    isPasswordChanged ?
        notificationService.success('Password changed') :
        notificationService.error('Error changing password');
};

async function validateForm() {
    const isOldPasswordValid = await validateOldPassword();
    const isNewPasswordValid = validateNewPassword();
    const isConfirmNewPasswordValid = validateConfirmNewPassword();

    return isOldPasswordValid && isNewPasswordValid && isConfirmNewPasswordValid;
}

async function validateOldPassword() {
    const oldPasswordInput = document.getElementById('old-password');

    return formHelper.isInputValueValid(
        oldPasswordInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Old password is required'
    )
    &&
    (await formHelper.isInputValueValidAsync(
        oldPasswordInput, 
        isOldPasswordCorrect, 
        'Old password is incorrect'
    ));
}

function validateNewPassword() {
    const newPasswordInput = document.getElementById('new-password');

    return formHelper.isInputValueValid(
        newPasswordInput, 
        dataValidationHelper.notNullOrEmpty, 
        'New password is required'
    )
    &&
    formHelper.isInputValueValid(
        newPasswordInput, 
        dataValidationHelper.isPasswordValid, 
        'Password must be between 5 and 50 characters, and can contain uppercase letters, lowercase letters, and numbers'
    );
}

function validateConfirmNewPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');

    return formHelper.isInputValueValid(
        confirmNewPasswordInput, 
        dataValidationHelper.notNullOrEmpty, 
        'New password confirmation is required'
    )
    &&
    formHelper.isInputValueValid(
        confirmNewPasswordInput, 
        password => dataValidationHelper.isPasswordConfirmationValid(newPassword, password), 
        'Password confirmation doesn\'t match the new password'
    );
}

async function isOldPasswordCorrect(oldPassword) {
    const oldPasswordHash = await hashHelper.getSHA256Hash(oldPassword);

    const service = userSessionService.getCurrentUserType() == UserTypes.User ? userService : employeeService;

    return (await service.validatePassword(userSessionService.getCurrentUserId(), oldPasswordHash)) != false;
}