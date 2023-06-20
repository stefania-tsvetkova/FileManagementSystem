export class FormHelper {
    clearFormErrors() {
        let errors = document.querySelectorAll('[id*="-error"]');
        errors.forEach(error => {
            error.textContent = '';
        });
    
        const registerErrorElement = document.getElementById('error');
        registerErrorElement?.remove();
    
        const registerSuccessElement = document.getElementById('success');
        registerSuccessElement?.remove();
    }
    
    isInputValueValid(input, isValidFunction, errorMessage) {
        if (!isValidFunction(input.value)) {
            this.displayError(input.id, errorMessage);
            return false;
        }
    
        return true;
    }
    
    async isInputValueValidAsync(input, isValidFunction, errorMessage) {
        if (!(await isValidFunction(input.value))) {
            this.displayError(input.id, errorMessage);
            return false;
        }
    
        return true;
    }

    displayError(inputId, errorMessage) {
        const errorElement = document.getElementById(`${inputId}-error`);
        errorElement.textContent = errorMessage;
    }
}