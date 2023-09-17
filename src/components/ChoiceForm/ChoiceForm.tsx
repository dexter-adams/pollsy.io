import styles from './ChoiceForm.module.css';

import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {addDoc, collection} from 'firebase/firestore';
import {firestore} from '../../config/firestore';
import {useParams} from 'react-router-dom';
import {IonIcon} from '@ionic/react';
import {closeOutline, addOutline} from 'ionicons/icons';
import Button from '../Button';
import LinkButton from "../LinkButton";

interface ChoiceFormProps {
    id: string;
}

const ChoiceForm: React.FC<ChoiceFormProps> = () => {
    const {id} = useParams<{ id: string }>(); // Get the poll ID from the route params
    const [choicesSubmitted, setChoicesSubmitted] = useState(false); // Define choicesSubmitted state
    const formik = useFormik({
        initialValues: {
            choices: [''],
        },
        validationSchema: Yup.object({
            choices: Yup.array()
                .of(Yup.string().required('Choice field cannot be empty. Add answer or remove field.'))
                .required('At least one choice is required'),
        }),
        onSubmit: async (values) => {
            const choicesRef = collection(firestore, `polls/${id}`, 'choices');

            if (values.choices) {
                const saveChoices = async () => {
                    values.choices.forEach((choice) => {
                        addDoc(choicesRef, {choiceText: choice})
                            .then((result) => {
                            })
                            .catch((error) => {
                                console.error('Error submitting choices:', error);
                            });
                    });
                };

                saveChoices().then(() => {
                    console.log('Choices added successfully.');
                    setChoicesSubmitted(true); // Set choicesSubmitted to true
                });
            }
        },
    });

    const addAnswerField = () => {
        formik.setFieldValue('choices', [...formik.values.choices, '']);
    };

    const removeAnswerField = (index: number) => {
        formik.setFieldValue('choices', formik.values.choices.filter((_, i) => i !== index));
    };

    // Reset choicesSubmitted when "View Poll" is clicked
    const resetChoicesSubmitted = () => {
        setChoicesSubmitted(false);
    };

    return (
        <>
            {choicesSubmitted ? (
                <div>
                    <p>Choices successfully submitted</p>
                    <Button
                        variant="primary"
                        full={true}
                        onClick={() => {
                            setChoicesSubmitted(false);
                        }}
                    >
                        Add More Choices
                    </Button>
                    <LinkButton href={`/poll/${id}`} full={true} onClick={resetChoicesSubmitted}>
                        View Poll
                    </LinkButton>
                </div>
            ) : (
                <form className={`p-5`} onSubmit={formik.handleSubmit}>
                    <div>
                        <div className={`${styles['choice-form__fields']} p-5 flex flex-col gap-8 rounded-md`}>
                            <h3 className={'mb-0'}>Submit Answers</h3>
                            <div className={'flex flex-col gap-5'}>
                                {formik.values.choices.map((choice, index) => (
                                    <div className={styles['choice-form__row']} key={index}>
                                        <div className={styles['choice-form__field-wrapper']}>
                                            <input
                                                type="text"
                                                name={`choices.${index}`}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={choice}
                                            />
                                            <Button type="button" onClick={() => removeAnswerField(index)}>
                                                <IonIcon icon={closeOutline}></IonIcon>
                                            </Button>
                                        </div>
                                        {formik.touched.choices &&
                                            formik.errors.choices &&
                                            formik.errors.choices[index] && <div className={'error'}>{formik.errors.choices[index]}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`${styles['choice-form__actions']}`}>
                            <Button full={true} type="submit">
                                Submit Answers
                            </Button>
                            <Button type="button" onClick={addAnswerField}>
                                <IonIcon icon={addOutline}></IonIcon>
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default ChoiceForm;
