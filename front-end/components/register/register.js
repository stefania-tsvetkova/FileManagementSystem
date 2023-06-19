import { UserService } from '../../services/user.service.js';
import { HashService } from '../../services/hash.service.js';
import { UrlService} from '../../services/url.service.js'

window.register = register;
window.bodyLoaded = bodyLoaded;

const userService = new UserService();
const hashService = new HashService();
const urlService = new UrlService();

function bodyLoaded() {
    const url = urlService.constructUrl('login');
    document.getElementById("login-button").setAttribute("href", url);
}

async function register() {
    clearFormErrors();
    
    const formData = getFormData();

    const isFormValid = await validateForm(formData);
    if (!isFormValid) {
        return false;
    }
    
    const userData = await getUserData(formData);
    userService.register(userData);
};

async function getUserData(formData) {
    return {
        email: formData.email.value,
        name: formData.name.value,
        familyName: formData.familyName.value,
        passwordHash: await hashService.getSHA256Hash(formData.password.value)
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
        isInputValueValid(
            formData.email, 
            notNullOrEmpty, 
            'Email is required'
        )
        &&
        isInputValueValid(
            formData.email, 
            isEmailValid, 
            'Invalid email'
        )
        &&
        (await isInputValueValidAsync(
            formData.email, 
            isEmailNotUsed, 
            'User with this email already exists'
        ));

    isFormValid &= 
        isInputValueValid(
            formData.name, 
            notNullOrEmpty, 
            'Name is required'
        )
        &&
        isInputValueValid(
            formData.name, 
            isNameValid, 
            'Name must be maximum 50 characters'
        );

    isFormValid &= 
        isInputValueValid(
            formData.familyName, 
            notNullOrEmpty, 
            'Family name is required'
        )
        &&
        isInputValueValid(
            formData.familyName, 
            isNameValid, 
            'Family name must be maximum 50 characters'
        );

    isFormValid &= 
        isInputValueValid(
            formData.password, 
            notNullOrEmpty, 
            'Password is required'
        )
        &&
        isInputValueValid(
            formData.password, 
            isPasswordValid, 
            'Password must be between 5 and 50 characters, and can contain uppercase letters, lowercase letters, and numbers'
        );

    return isFormValid;
}

function isInputValueValid(input, isValidFunction, errorMessage) {
    if (!isValidFunction(input.value)) {
        displayError(input.id, errorMessage);
        return false;
    }

    return true;
}

async function isInputValueValidAsync(input, isValidFunction, errorMessage) {
    if (!(await isValidFunction(input.value))) {
        displayError(input.id, errorMessage);
        return false;
    }

    return true;
}

function notNullOrEmpty(value) {
    return value !== null && value !== '';
}

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function isEmailNotUsed(email) {
    return !(await userService.emailExists(email));
}

function isNameValid(name) {
    return name.length <= 50;
}

function isPasswordValid(password) {
    const passwordRegex = /^[a-zA-Z0-9]{5,50}$/;
    return passwordRegex.test(password);
}

function displayError(inputId, errorMessage) {
    const errorElement = document.getElementById(`${inputId}-error`);
    errorElement.textContent = errorMessage;
}