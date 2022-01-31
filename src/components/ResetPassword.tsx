import React, { useContext } from 'react'
import Modal from './modal/Modal'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import { useMutation } from '@apollo/client'
import { RESET_PASSWORD } from '../apollo/mutations'
import { AuthContext } from '../context/AuthContextProvider'

// Styled-components
import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledError,
  StyledInform,
} from './SignupStyles'

const ResetPassword: React.FC<{ token: string }> = ({ token }) => {

  // Context
  const { handleAuthAction } = useContext(AuthContext)

  // HOOKS: useForm, useMutation
  const { register, handleSubmit, formState: { errors } } = useForm<{ password: string }>()
  const [resetPassword, { data, loading, error }] = useMutation<{ resetPassword: { message: string } }, { token: string; password: string }>(RESET_PASSWORD)

  // HANDLE: handleSubmitRestPassword
  const handleSubmitRestPassword = handleSubmit(async ({ password }) => {
    console.log(password);

    await resetPassword({ variables: { token, password } })
  })

  return (
    <Modal>
      <FormContainer>
        <Header>
          <h4>Enter your new password below.</h4>
        </Header>
        <StyledForm onSubmit={handleSubmitRestPassword}>
          <InputContainer>
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
              disabled={data ? true : false} // disable when finished resetting
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

        {data && <StyledInform>
          <p>
            {data.resetPassword.message} {" "}
            <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleAuthAction('signin')}>Sign in</span>
          </p>
        </StyledInform>}

      </FormContainer>
    </Modal>
  )
}

export default ResetPassword
