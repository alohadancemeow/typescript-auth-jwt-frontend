import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client'

import Modal from './modal/Modal'
import { AuthContext } from '../context/AuthContextProvider'
import { SigninInputs, User } from '../types';
import { SIGNIN } from '../apollo/mutations';
import { isAdmin } from '../helpers/authHelpers'

// Styled-components
import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledSwitchAction,
  Divider,
  StyledSocial,
  StyledError,
} from './SignupStyles'
import { Oval } from 'react-loader-spinner';

interface Props { }

const SignIn: React.FC<Props> = () => {

  // router
  const router = useRouter()

  // context
  const { handleAuthAction, setAuthUser } = useContext(AuthContext)

  // HOOKS: 
  const [signin, { loading, error }] = useMutation<{ signin: User }, SigninInputs>(SIGNIN)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SigninInputs>()
  // console.log(watch());

  // HANDLE: Sign in
  const submitSignin = handleSubmit(async ({ email, password }) => {
    // console.log(email, password);

    try {
      const response = await signin({ variables: { email, password } })

      if (response.data?.signin) {
        // console.log(response.data?.signin);

        const { signin } = response.data
        if (signin) {

          handleAuthAction('close')  // close from
          setAuthUser(signin)        // set logged-in-user in context api

          // check if use is admin | superadmin --> admin page,
          // not admin --> dashboard
          isAdmin(signin)
            ? router.push('/admin')
            : router.push('/dashboard')
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
          <h2>Sign In</h2>
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

        <StyledForm onSubmit={submitSignin}>
          <p className='email_section_label'>or sign in with an email</p>
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
                required: 'Password is required.'
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
            Don't have an account yet?{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('signup')}
            >
              sign up
            </span>{' '}
            instead.
          </p>
          <p>
            Forgot password? click{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('request')}
            >
              here.
            </span>
          </p>
        </StyledSwitchAction>
      </FormContainer>
    </Modal>
  )
}

export default SignIn
