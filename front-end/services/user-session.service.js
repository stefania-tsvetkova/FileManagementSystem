export class UserSessionService {
    setCurrentUser(user) {
        localStorage.setItem('currentUserId', user.id);
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