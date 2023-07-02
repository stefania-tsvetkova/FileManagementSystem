import { UserService } from '../../../services/user.service.js';
import { HashHelper } from '../../../helpers/hash.helper.js';
import { UrlHelper} from '../../../helpers/url.helper.js'
import { DataValidationHelper} from '../../../helpers/data-validation.helper.js'
import { FormHelper} from '../../../helpers/form.helper.js'
import { NotificationService } from "../../../services/notification.service.js";
import { UserTypes } from '../../../constants/user-types.constants.js';

window.bodyLoaded = bodyLoaded;
window.validateEmail = validateEmail;
window.validateName = validateName;
window.validateFamilyName = validateFamilyName;
window.validatePassword = validatePassword;
window.register = register;

const userService = new UserService();
const hashHelper = new HashHelper();
const urlHelper = new UrlHelper();
const dataValidationHelper = new DataValidationHelper();
const formHelper = new FormHelper();
const notificationService = new NotificationService();

function bodyLoaded() {
    const loginUrl = urlHelper.constructUrl('login', UserTypes.User);
    const loginButtonElement = document.getElementById("login-button");
    loginButtonElement.setAttribute("href", loginUrl);

    const employeeLoginButtonElement = document.getElementById("employee-login-button");
    const employeeLoginUrl = urlHelper.constructUrl('login', UserTypes.Employee);
    employeeLoginButtonElement.setAttribute("href", employeeLoginUrl);
}

async function register() {
    formHelper.clearFormErrors();
    
    const isFormValid = await validateForm();
    if (!isFormValid) {
        return;
    }
    
    const userData = await getUserData();
    const isRegistered = await userService.register(userData);
    
    if (!isRegistered) {
        notificationService.error("There was an error. Please try again later");
        return;
    }

    const isLoggedIn = await userService.login(userData);
    if (!isLoggedIn) {
        notificationService.error("User was registered but can't be logged in. Please try again later");
    }
};

async function getUserData() {
    return {
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        familyName: document.getElementById('family-name').value,
        passwordHash: await hashHelper.getSHA256Hash(document.getElementById('password').value)
    };
}

async function validateForm() {
    const isEmailValid = await validateEmail();
    const isNameValid = validateName();
    const isFamilyNameValid = validateFamilyName();
    const isPasswordValid = validatePassword();

    return isEmailValid && isNameValid && isFamilyNameValid && isPasswordValid;
}

async function validateEmail() {
    const emailInput = document.getElementById('email');

    return formHelper.isInputValueValid(
        emailInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Email is required'
    )
    &&
    formHelper.isInputValueValid(
        emailInput, 
        dataValidationHelper.isEmailValid, 
        'Invalid email'
    )
    &&
    (await formHelper.isInputValueValidAsync(
        emailInput, 
        isEmailNotUsed, 
        'User with this email already exists'
    ));
}

function validateName() {
    const nameInput = document.getElementById('name');

    return formHelper.isInputValueValid(
        nameInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Name is required'
    )
    &&
    formHelper.isInputValueValid(
        nameInput, 
        dataValidationHelper.isNameValid, 
        'Name must be maximum 50 characters'
    );
}

function validateFamilyName() {
    const familyNameInput = document.getElementById('family-name');

    return formHelper.isInputValueValid(
        familyNameInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Family name is required'
    )
    &&
    formHelper.isInputValueValid(
        familyNameInput, 
        dataValidationHelper.isNameValid, 
        'Family name must be maximum 50 characters'
    );
}

function validatePassword() {
    const passwordInput = document.getElementById('password');

    return formHelper.isInputValueValid(
        passwordInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Password is required'
    )
    &&
    formHelper.isInputValueValid(
        passwordInput, 
        dataValidationHelper.isPasswordValid, 
        'Password must be between 5 and 50 characters, and can contain uppercase letters, lowercase letters, and numbers'
    );
}

async function isEmailNotUsed(email) {
    return !(await userService.emailExists(email));
}