export class UserSessionService {
    setCurrentUser(userId, userType) {
        localStorage.setItem('currentUserId', userId);
        localStorage.setItem('currentUserType', userType);
    }

    getCurrentUserId() {
        return localStorage.getItem('currentUserId');
    }

    getCurrentUserType() {
        return localStorage.getItem('currentUserType');
    }

    isUserLoggedIn() {
        return this.getCurrentUserId() !== null;
    }

    removeCurrentUser() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserType');
    }
}