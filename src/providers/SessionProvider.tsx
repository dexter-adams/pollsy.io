import React, {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {getAuth, getIdToken, onAuthStateChanged, signOut, User,} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Initialize Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

// Create a context for the session
export const SessionContext = createContext<{
    user: User | null;
    clearSession: () => Promise<void>;
    getSession: () => Promise<User | null>;
    setSession: (user: User) => Promise<void>;
}>({
    user: null,
    clearSession: () => {
        throw new Error('Method not implemented.');
    },
    getSession: () => {
        throw new Error('Method not implemented.');
    },
    setSession: () => {
        throw new Error('Method not implemented.');
    },
});

// Create a SessionProvider component
export const SessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Check if the user is already authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);

    // Function to clear the user's session
    const clearSession = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    };

    // Function to get the user's session
    const getSession = async (): Promise<User | null> => {
        return user;
    };

    // Function to set the user's session
    const setSession = async (user: User): Promise<void> => {
        try {
            setUser(user);
        } catch (error) {
            console.error('Error setting session:', error);
        }
    };

    return (
        <SessionContext.Provider value={{ user, clearSession, getSession, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};
