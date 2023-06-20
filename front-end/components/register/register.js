import { UserService } from '../../services/user.service.js';
import { HashHelper } from '../../helpers/hash.helper.js';
import { UrlHelper} from '../../helpers/url.helper.js'
import { DataValidationHelper} from '../../helpers/data-validation.helper.js'
import { FormHelper} from '../../helpers/form.helper.js'
import { NotificationService } from "../../services/notification.service.js";

window.register = register;
window.bodyLoaded = bodyLoaded;

const userService = new UserService();
const hashHelper = new HashHelper();
const urlHelper = new UrlHelper();
const dataValidationHelper = new DataValidationHelper();
const formHelper = new FormHelper();
const notificationService = new NotificationService();

function bodyLoaded() {
    const url = urlHelper.constructUrl('login');
    document.getElementById("login-button").setAttribute("href", url);
}

async function register() {
    formHelper.clearFormErrors();
    
    const formData = getFormData();

    const isFormValid = await validateForm(formData);
    if (!isFormValid) {
        return;
    }
    
    const userData = await getUserData(formData);
    const isRegistered = await userService.register(userData);
    
    if (!isRegistered) {
        notificationService.error("There was an error. Please try again later");
        return;
    }

    const url = urlHelper.constructUrl('home');
    window.location.replace(url);
};

async function getUserData(formData) {
    return {
        email: formData.email.value,
        name: formData.name.value,
        familyName: formData.familyName.value,
        passwordHash: await hashHelper.getSHA256Hash(formData.password.value)
    };
}

function clearFormErrors() {
    let errors = document.querySelectorAll('[id*="-error"]');
    errors.forEach(error => {
        error.textContent = '';
    });

    const registerErrorElement = document.getElementById('error');
    registerErrorElement?.remove();

    const registerSuccessElement = document.getElementById('success');
    registerSuccessElement?.remove();
}

function getFormData() {
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

async function validateForm(formData) {
    let isFormValid = true;

    isFormValid &= 
        formHelper.isInputValueValid(
            formData.email, 
            dataValidationHelper.notNullOrEmpty, 
            'Email is required'
        )
        &&
        formHelper.isInputValueValid(
            formData.email, 
            dataValidationHelper.isEmailValid, 
            'Invalid email'
        )
        &&
        (await formHelper.isInputValueValidAsync(
            formData.email, 
            isEmailNotUsed, 
            'User with this email already exists'
        ));

    isFormValid &= 
        formHelper.isInputValueValid(
            formData.name, 
            dataValidationHelper.notNullOrEmpty, 
            'Name is required'
        )
        &&
        formHelper.isInputValueValid(
            formData.name, 
            dataValidationHelper.isNameValid, 
            'Name must be maximum 50 characters'
        );

    isFormValid &= 
        formHelper.isInputValueValid(
            formData.familyName, 
            dataValidationHelper.notNullOrEmpty, 
            'Family name is required'
        )
        &&
        formHelper.isInputValueValid(
            formData.familyName, 
            dataValidationHelper.isNameValid, 
            'Family name must be maximum 50 characters'
        );

    isFormValid &= 
        formHelper.isInputValueValid(
            formData.password, 
            dataValidationHelper.notNullOrEmpty, 
            'Password is required'
        )
        &&
        formHelper.isInputValueValid(
            formData.password, 
            dataValidationHelper.isPasswordValid, 
            'Password must be between 5 and 50 characters, and can contain uppercase letters, lowercase letters, and numbers'
        );

    return isFormValid;
}

async function isEmailNotUsed(email) {
    return !(await userService.emailExists(email));
}