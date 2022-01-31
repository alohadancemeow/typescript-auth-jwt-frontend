import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Oval } from 'react-loader-spinner';
import { useForm } from "react-hook-form";
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router';

import Modal from './modal/Modal'
import { AuthContext } from '../context/AuthContextProvider'
import { SignupInputs, User } from '../types'
import { SIGNUP } from '../apollo/mutations'

// Styled-components
import {
  Button,
  Divider,
  FormContainer,
  Header,
  Input,
  InputContainer,
  StyledError,
  StyledForm,
  StyledInform,
  StyledSocial,
  StyledSwitchAction
} from './SignupStyles'


interface Props { }

const SignUp: React.FC<Props> = () => {

  // router
  const router = useRouter()

  // # Context
  const { handleAuthAction, setAuthUser } = useContext(AuthContext)

  // HOOKS: useMutation
  const [signup, { loading, error }] = useMutation<{ signup: User }, SignupInputs>(SIGNUP)
  console.log(loading, error);

  // HOOKS: use form
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupInputs>();

  // console.log(watch());

  // HANDLE: Sign up
  const submitSignup = handleSubmit(async ({ username, email, password }) => {
    // console.log(username, email, password);

    try {
      const response = await signup({ variables: { username, email, password } })

      if (response.data?.signup) {
        // console.log(response.data?.signup);

        const { signup } = response.data
        if (signup) {
          handleAuthAction('close') // close from
          setAuthUser(signup)       // set logged-in-user in context api
          router.push('/dashboard') // push --> dashboard
        }

      }
    } catch (error) {
      setAuthUser(null)
    }

  })


  return (
    <Modal>
      <FormContainer>
        <Header>
          <h2>Sign Up</h2>
        </Header>

        <StyledSocial>
          <button className='facebook'>
            <FontAwesomeIcon icon={['fab', 'facebook-f']} size='lg' />
            <a>Sign in with Facebook</a>
          </button>
          <button className='google'>
            <FontAwesomeIcon icon={['fab', 'google']} />
            <a>Sign in with Google</a>
          </button>
        </StyledSocial>

        <Divider />

        <StyledForm onSubmit={submitSignup}>
          <p className='email_section_label'>or sign up with an email</p>
          <InputContainer>
            <label>Username</label>
            <Input
              type='text'
              // name='username'
              id='username'
              placeholder='Your username'
              autoComplete='new-password'
              {...register('username', {
                required: 'Username is required.',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters.'
                },
                maxLength: {
                  value: 60,
                  message: 'Username must be not more than 60 characters.'
                }
              })}
            />
            <StyledError>{errors.username?.message}</StyledError>
          </InputContainer>

          <InputContainer>
            <label>Email</label>

            <Input
              type='text'
              // name='email'
              id='email'
              placeholder='Your email'
              autoComplete='new-password'
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email is in wrong format.'
                }
              })}
            />
            <StyledError>{errors.email?.message}</StyledError>
          </InputContainer>

          <InputContainer>
            <label>Password</label>

            <Input
              type='password'
              // name='password'
              id='password'
              placeholder='Your password'
              {...register('password', {
                required: 'Password is required.',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 3 characters.'
                },
                maxLength: {
                  value: 50,
                  message: 'Password must be not more than 60 characters.'
                }
              })}
            />
            <StyledError>{errors.password?.message}</StyledError>
          </InputContainer>
          <Button type='submit' disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading
              ? <Oval color='white' height={30} width={30} ariaLabel="loading-indicator" />
              : 'Submit'
            }
          </Button>

          {/* TODO: error form backend */}
          {error && <StyledError>{error.graphQLErrors[0]?.message || 'Sorry, something went wrong.'}</StyledError>}

        </StyledForm>
        <StyledSwitchAction>
          <p>
            Already have account?{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('signin')}
            >
              sign in
            </span>{' '}
            instead.
          </p>
        </StyledSwitchAction>
      </FormContainer>
    </Modal>
  )
}

export default SignUp
