export class UserSessionService {
    setCurrentUser(userId, isAdmin) {
        localStorage.setItem('currentUserId', userId);
        localStorage.setItem('currentUserIsAdmin', isAdmin);
    }

    getCurrentUserId() {
        return localStorage.getItem('currentUserId');
    }

    isCurrentUserAdmin() {
        return localStorage.getItem('currentUserIsAdmin');
    }

    isUserLoggedIn() {
        return this.getCurrentUserId() !== null;
    }

    removeCurrentUser() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserIsAdmin');
    }
}