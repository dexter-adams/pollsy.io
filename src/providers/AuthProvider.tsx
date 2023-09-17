import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from 'react';
import {auth} from '../config/firebase';
import {getIdToken, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {SessionContext} from './SessionProvider';
import {handleDownloadAndStorePhotoURL, handleUserDoc} from '../helpers/loginHelpers';
import {useHistory} from "react-router";

export const AuthContext = createContext<{
    user: any; // Define the user property
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    getAccessToken: () => Promise<string | null>;
}>({
    user: null, // Initialize user as null
    login: (email: string, password: string) => {
        throw new Error('Method not implemented.');
    },
    logout: () => {
        throw new Error('Method not implemented.');
    },
    isAuthenticated: false,
    getAccessToken: async () => null,
});

export const AuthProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [user, setUser] = useState({}); // Initialize user as null
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {clearSession, getSession, setSession} = useContext(SessionContext);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('User signed in:', user);
                await setSession(user);
                setIsAuthenticated(true);
                setUser(user); // Set the user state
            } else {
                console.log('User signed out');
                setIsAuthenticated(false);
                setUser({}); // Set the user state to null
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const history = useHistory();

            if (result.user) {
                await setSession(result.user);
                setIsAuthenticated(true);

                const {photoURL} = result.user;
                const userDoc = await handleUserDoc(result.user);
                const userData = {
                    photoURL: photoURL,
                };

                // Handle downloading and storing photoURL
                userData.photoURL = await handleDownloadAndStorePhotoURL(result.user);

                // Update user state
                setUser(result.user); // Set the user state

                // Redirect to the "/" route after successful login
                history.push('/');
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            await clearSession();
            setIsAuthenticated(false);
            setUser({}); // Set the user state to null
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getAccessToken = async (): Promise<string | null> => {
        const user = auth.currentUser;

        if (user) {
            try {
                return getIdToken(user);
            } catch (error) {
                console.error('Error getting access token:', error);
            }
        }

        return null;
    };

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout, getAccessToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
