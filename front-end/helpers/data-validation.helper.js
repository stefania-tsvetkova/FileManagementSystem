export class DataValidationHelper {
    notNullOrEmpty(value) {
        return value !== null && value !== '';
    }
    
    isEmailValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isNameValid(name) {
        return name.length <= 50;
    }
    
    isPasswordValid(password) {
        const passwordRegex = /^[a-zA-Z0-9]{5,50}$/;
        return passwordRegex.test(password);
    }

    isPasswordConfirmationValid(password, confirmPassword) {
        return password === confirmPassword;
    }
}