import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContextProvider'
import { Rings } from 'react-loader-spinner'

export default function Dashboard() {

  const router = useRouter()

  // user form context
  const { loggedInUser } = useContext(AuthContext)

  useEffect(() => {

    // if user is not authenticated, push --> homepage
    if (!loggedInUser) router.push('/')

  }, [loggedInUser])


  return !loggedInUser
    ? <Rings ariaLabel="loading-indicator" />
    : <h2>{loggedInUser.username}'s dashboard</h2>
}
