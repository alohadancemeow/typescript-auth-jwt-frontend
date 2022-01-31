import React from 'react'
import { useForm } from 'react-hook-form'
import { Oval } from 'react-loader-spinner'
import { useMutation } from '@apollo/client'
import { REQUEST_RESET_PASSWORD } from '../apollo/mutations'

import Modal from './modal/Modal'

// Styled-components
import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledError,
  StyledInform
} from './SignupStyles'

interface Props { }

const RequestResetPassword: React.FC<Props> = () => {

  // HOOKS: useMutation, useForm
  const [requestResetPassword, { data, loading, error }] = useMutation<{ requestResetPassword: { message: string } }, { email: string }>(REQUEST_RESET_PASSWORD)
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>()

  // HANDLE: handleRequestResetPassword
  const handleRequestResetPassword = handleSubmit(async ({ email }) => {
    console.log(email);
    await requestResetPassword({ variables: { email } })

  })

  return (
    <Modal>
      <FormContainer>
        <Header>
          <h4>Enter your email below to reset password.</h4>
        </Header>
        <StyledForm onSubmit={handleRequestResetPassword}>
          <InputContainer>
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
          <p>{data.requestResetPassword.message}</p>
        </StyledInform>}

      </FormContainer>
    </Modal>
  )
}

export default RequestResetPassword
