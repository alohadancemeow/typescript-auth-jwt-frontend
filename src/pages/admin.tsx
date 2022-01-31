import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContextProvider'
import { Rings } from 'react-loader-spinner'

import Admin from '../components/Admin'
import { isAdmin } from '../helpers/authHelpers'

export default function AdminPage() {

  const router = useRouter()

  // user form context
  const { loggedInUser } = useContext(AuthContext)

  useEffect(() => {

    // if user is not authenticated, push --> homepage
    // authenticated, but not admin --> dashborad page
    if (!loggedInUser) {
      router.push('/')
    } else {
      if (!isAdmin(loggedInUser)) {
        alert('No Authorization.')
        router.push('/dashboard')
      }
    }
  }, [loggedInUser])


  return !isAdmin(loggedInUser)
    ? <Rings ariaLabel="loading-indicator" />
    : <Admin />
}
