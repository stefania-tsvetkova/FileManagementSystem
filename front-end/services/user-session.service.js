export class UserSessionService {
    setCurrentUserId(userId) {
        localStorage.setItem('currentUserId', userId);
    }

    getCurrentUserId() {
        return localStorage.getItem('currentUserId');
    }

    isUserLoggedIn() {
        return this.getCurrentUserId() !== null;
    }

    removeCurrentUser() {
        localStorage.removeItem('currentUserId');
    }
}