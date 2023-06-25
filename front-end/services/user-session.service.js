export class UserSessionService {
    setCurrentUser(userId, isAdmin) {
        localStorage.setItem('currentUserId', userId);
        localStorage.setItem('currentUserIsEmployee', isAdmin);
    }

    getCurrentUserId() {
        return localStorage.getItem('currentUserId');
    }

    isCurrentUserEmployee() {
        return localStorage.getItem('currentUserIsEmployee');
    }

    isUserLoggedIn() {
        return this.getCurrentUserId() !== null;
    }

    removeCurrentUser() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserIsEmployee');
    }
}