// LoginForm.js
import styles from './LoginForm.module.scss';

import React, {useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {useAuth} from '../../providers/AuthProvider';
import Button from '../Button';
import LinkButton from "../LinkButton";

const LoginForm = () => {
    const {login} = useAuth();
    const [errorCode, setErrorCode] = useState<string | null>(null); // Specify the type as string | null

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values: { email: any; password: any; }, {setSubmitting, setErrors}: any) => {
        try {
            await login(values.email, values.password);
            // Clear errors and error code on successful login
            setErrors({});
            setErrorCode(null);
        } catch (error: any) {
            const errorCode = error.code;
            console.log(error.code);
            if (errorCode === 'auth/user-not-found') {
                console.log('User not found.');
                setErrors({email: 'User not found.'});
                setErrorCode(errorCode);
            } else if (errorCode === 'auth/wrong-password') {
                setErrors({password: 'Incorrect password.'});
                setErrorCode(errorCode);
            } else {
                setErrors({general: 'An error occurred. Please try again later.'});
                setErrorCode(errorCode);
            }
        }

        setSubmitting(false);
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form className={'form max-w-sm mx-auto'}>
                <ErrorMessage name="general" component="div" className={'error'}/>
                <div className={'form-row'}>
                    <Field type="email" id="email" name="email" placeholder="Email"/>
                    <ErrorMessage name="email" component="div" className={'error'}/>
                </div>
                <div className={'form-row'}>
                    <Field type="password" id="password" name="password" placeholder="Password"/>
                    <ErrorMessage name="password" component="div" className={'error'}/>
                </div>
                <div className={'form-footer'}>
                    <Button
                        type="submit"
                        variant="primary"
                        full={true}
                    >
                        Login
                    </Button>
                    <LinkButton
                        href="/register"
                        variant="primary"
                        full={true}
                    >
                        Sign up
                    </LinkButton>
                </div>
            </Form>
        </Formik>
    );
};

export default LoginForm;
