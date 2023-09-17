// RegistrationForm.tsx
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { firestore } from '../../config/firestore';
import LinkButton from "../LinkButton";
import Button from "../Button";

interface RegistrationFormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

const RegistrationForm: React.FC = () => {
    const initialValues: RegistrationFormValues = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    const [generalError, setGeneralError] = useState<string | null>(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                'Password must contain uppercase, lowercase, numbers, and special characters',
            )
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password', undefined)], 'Passwords must match')
            .required('Required'),
    });

    const handleSubmit = async (values: RegistrationFormValues, { setSubmitting, setErrors }: any) => {
        try {
            // Create a new user with email and password using Firebase Auth
            const result = await createUserWithEmailAndPassword(auth, values.email, values.password);

            // User registration successful
            const user = result.user;
            console.log('User registered successfully');

            // Store additional user information in Firestore
            const userRef = collection(firestore, 'users');
            const userDoc = doc(userRef, user.uid); // Use the user's UID as the document ID
            await setDoc(userDoc, {
                email: user.email,
                // Other user data you may want to store
            });

            // Send email verification
            await sendEmailVerification(user, {
                url: `${window.location.origin}/email-verification`, // Set your verification URL here
            });

            // Handle successful registration and email confirmation
            console.log('Confirmation email sent to', user.email);

            // Set the registration success flag
            setRegistrationSuccess(true);
        } catch (error: any) {
            console.error('Error registering user:', error);
            let errorMessage: string;
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'User already exists.';
                    break;
                default:
                    errorMessage = 'An error occurred. Please try again later.';
                    break;
            }
            setGeneralError(errorMessage); // Set the error message in the shared state
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {registrationSuccess ? (
                <div className="success-message">Registration successful! Check your email for verification.</div>
            ) : (
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className="form max-w-sm mx-auto">
                        {generalError && <div className="error">{generalError}</div>}
                        <div className="form-row">
                            <label className="hidden">Email:</label>
                            <Field type="email" name="email" placeholder="Email" />
                            <ErrorMessage name="email" component="div" className="error" />
                        </div>
                        <div className="form-row">
                            <label className="hidden">Password:</label>
                            <Field type="password" name="password" placeholder="Password" />
                            <ErrorMessage name="password" component="div" className="error" />
                        </div>
                        <div className="form-row">
                            <label className="hidden">Confirm Password:</label>
                            <Field type="password" name="confirmPassword" placeholder="Confirm Password" />
                            <ErrorMessage name="confirmPassword" component="div" className="error" />
                        </div>
                        <div className="form-footer">
                            <Button type="submit" variant="primary">
                                Register
                            </Button>
                            <div className="flex flex-col gap-4 form-peripheral">
                                <div className="flex flex-col gap-4">
                                    <p className="text-center">Already a member?</p>
                                    <p>
                                        <LinkButton variant="outlineSecondary" href="/login" full>Login</LinkButton>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Formik>
            )}
        </>
    );
};

export default RegistrationForm;
