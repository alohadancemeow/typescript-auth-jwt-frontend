import { useQuery } from '@apollo/client'
import React, { createContext, useState, useEffect } from 'react'
import { User } from '../types'
import { ME } from '../apollo/queries'
import Router from 'next/router'

interface Props { }

type Actions = 'signup' | 'signin' | 'request' | 'reset' | 'close'

type HandleAuthAction = (action: Actions) => void

interface AuthContextValues {
  authAction: Actions
  handleAuthAction: HandleAuthAction
  loggedInUser: User | null
  setAuthUser: (user: User | null) => void
}

const initialState: AuthContextValues = {
  authAction: 'close',
  handleAuthAction: () => { },
  loggedInUser: null,
  setAuthUser: () => { }
}

export const AuthContext = createContext<AuthContextValues>(initialState)

// # AuthContextProvider
const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authAction, setAuthAction] = useState<Actions>('close')
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  console.log(loggedInUser);

  // Query me
  const { data } = useQuery<{ me: User }>(ME)

  useEffect(() => {
    if (data?.me) setLoggedInUser(data.me)
  }, [data?.me])

  // Storage event listener
  useEffect(() => {
    const syncSignout = (e: StorageEvent) => {
      if (e.key === 'signout') {
        setLoggedInUser(null) // log user out
        Router.push('/')      // push --> homepage
      }
    }
    window.addEventListener('storage', syncSignout)

    // then remove storage event and listener
    return () => window.removeEventListener('storage', syncSignout)
  }, [])

  const handleAuthAction: HandleAuthAction = (action) => setAuthAction(action)

  const setAuthUser = (user: User | null) => setLoggedInUser(user)

  return (
    <AuthContext.Provider
      value={{
        authAction,
        handleAuthAction,
        loggedInUser,
        setAuthUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
