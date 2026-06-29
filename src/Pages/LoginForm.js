import React from 'react';
import CreateForm from '../Forms/CreateForm';
 
function LoginForm(props) {
    let rowWiseFields = 1;
    let template = {
        heading: 'Login',
        fields: [
            {
                title: 'User Name',
                type: 'text',
                name: 'firstname',
                contains:"text",
                validationProps: "Username is Required"
            },
            {
                title: 'Password',
                type: 'text',
                name: 'password',
                contains: 'password',
                validationProps: "Password is required"
            }
        ]
    }

    return (
       <CreateForm
            template={template}
            rowwise={rowWiseFields}
           // watchFields={['firstname','password']}
            validate={validate}
            onSubmit={onSubmit}
            onCancel={props.onCancel}
            buttonName="Login"
        />
    );
}


function onSubmit(values) {
    console.log(values);
}

function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;

    // Firstname validation
    if(watchValues['firstname'] === 'Admin'){
        if(!errors['firstname']){
            setError('firstname', {
                type: 'manual',
                message: 'You cannot use this first name'
            })
        }
    }else{
        if(errors['firstname'] && errors['firstname']['type'] === 'manual'){
            clearErrors('firstname');
        }
    }
}

export default LoginForm;