import { UserService } from '../../../services/user.service.js';
import { HashHelper } from '../../../helpers/hash.helper.js';
import { UrlHelper} from '../../../helpers/url.helper.js'
import { DataValidationHelper} from '../../../helpers/data-validation.helper.js'
import { FormHelper} from '../../../helpers/form.helper.js'
import { NotificationService } from "../../../services/notification.service.js";
import { UserTypes } from '../../../constants/user-types.constants.js';

window.register = register;
window.bodyLoaded = bodyLoaded;

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

    const employeeLoginUrl = urlHelper.constructUrl('login', UserTypes.Employee);
    const employeeLoginButtonElement = document.getElementById("employee-login-button");
    employeeLoginButtonElement.setAttribute("href", employeeLoginUrl);
}

async function register() {
    formHelper.clearFormErrors();
    
    const data = getRegisterData();

    const isFormValid = await validateForm(data);
    if (!isFormValid) {
        return;
    }
    
    const userData = await getUserData(data);
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

async function getUserData(data) {
    return {
        email: data.email.value,
        name: data.name.value,
        familyName: data.familyName.value,
        passwordHash: await hashHelper.getSHA256Hash(data.password.value)
    };
}

function getRegisterData() {
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const familyNameInput = document.getElementById('family-name');
    const passwordInput = document.getElementById('password');

    return {
        email: emailInput,
        name: nameInput,
        familyName: familyNameInput,
        password: passwordInput
    };
}

async function validateForm(data) {
    let isFormValid = true;

    isFormValid &= 
        formHelper.isInputValueValid(
            data.email, 
            dataValidationHelper.notNullOrEmpty, 
            'Email is required'
        )
        &&
        formHelper.isInputValueValid(
            data.email, 
            dataValidationHelper.isEmailValid, 
            'Invalid email'
        )
        &&
        (await formHelper.isInputValueValidAsync(
            data.email, 
            isEmailNotUsed, 
            'User with this email already exists'
        ));

    isFormValid &= 
        formHelper.isInputValueValid(
            data.name, 
            dataValidationHelper.notNullOrEmpty, 
            'Name is required'
        )
        &&
        formHelper.isInputValueValid(
            data.name, 
            dataValidationHelper.isNameValid, 
            'Name must be maximum 50 characters'
        );

    isFormValid &= 
        formHelper.isInputValueValid(
            data.familyName, 
            dataValidationHelper.notNullOrEmpty, 
            'Family name is required'
        )
        &&
        formHelper.isInputValueValid(
            data.familyName, 
            dataValidationHelper.isNameValid, 
            'Family name must be maximum 50 characters'
        );

    isFormValid &= 
        formHelper.isInputValueValid(
            data.password, 
            dataValidationHelper.notNullOrEmpty, 
            'Password is required'
        )
        &&
        formHelper.isInputValueValid(
            data.password, 
            dataValidationHelper.isPasswordValid, 
            'Password must be between 5 and 50 characters, and can contain uppercase letters, lowercase letters, and numbers'
        );

    return isFormValid;
}

async function isEmailNotUsed(email) {
    return !(await userService.emailExists(email));
}