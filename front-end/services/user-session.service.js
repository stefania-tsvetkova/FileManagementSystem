import { CURRENT_USER } from '../constants/user.constants.js';

export class UserSessionService {
    setCurrentUser(user) {
        localStorage.setItem(CURRENT_USER, user);
    }

    getCurrentUser() {
        return localStorage.getItem(CURRENT_USER);
    }

    isUserLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    removeCurrentUser() {
        localStorage.removeItem(CURRENT_USER);
    }
}