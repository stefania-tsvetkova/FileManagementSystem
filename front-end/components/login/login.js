import { UserService } from '../../services/user.service.js';
import { HashHelper } from '../../helpers/hash.helper.js';
import { UrlHelper} from '../../helpers/url.helper.js'
import { DataValidationHelper} from '../../helpers/data-validation.helper.js'
import { FormHelper} from '../../helpers/form.helper.js'
import { UserSessionService } from "../../services/user-session.service.js";

window.login = login;
window.bodyLoaded = bodyLoaded;

const userService = new UserService();
const hashHelper = new HashHelper();
const urlHelper = new UrlHelper();
const dataValidationHelper = new DataValidationHelper();
const formHelper = new FormHelper();
const userSessionService = new UserSessionService();

function bodyLoaded() {
    const url = urlHelper.constructUrl('register');
    document.getElementById("register-button").setAttribute("href", url);
}

async function login() {
    formHelper.clearFormErrors();
    
    const formData = getFormData();

    const isFormValid = await validateForm(formData);
    if (!isFormValid) {
        return;
    }
    
    const userData = await getUserData(formData);
    const userId = await userService.login(userData);
    
    if (userId === '') {
        formHelper.displayError('login-button', 'Username or password is incorrect');
        return;
    }

    userSessionService.setCurrentUserId(userId);

    const url = urlHelper.constructUrl('home');
    window.location.replace(url);
};

async function getUserData(formData) {
    return {
        email: formData.email.value,
        passwordHash: await hashHelper.getSHA256Hash(formData.password.value)
    };
}

function getFormData() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    return {
        email: emailInput,
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
        );

    isFormValid &= 
    formHelper.isInputValueValid(
            formData.password, 
            dataValidationHelper.notNullOrEmpty, 
            'Password is required'
        );

    return isFormValid;
}