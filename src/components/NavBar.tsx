import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { AuthContext } from '../context/AuthContextProvider'
import { isAdmin } from '../helpers/authHelpers'

// Styled-components
import {
  Actions,
  HamMenu,
  Header,
  Logo,
  Nav,
  Ul
} from './NavStyles'

interface Props { }

const NavBar: React.FC<Props> = () => {

  // # Context
  const { handleAuthAction, loggedInUser, setAuthUser } = useContext(AuthContext)
  // console.log(loggedInUser);

  const router = useRouter()

  return (
    <Header>
      <Nav>
        <Link href='/'>
          <Logo>
            <a className={router.pathname === '/' ? 'active' : ''}>MyShop</a>
          </Logo>
        </Link>
        <Ul>
          <Link href='/'>
            <a className={router.pathname === '/' ? 'active' : ''}>Home</a>
          </Link>

          <Link href='/products'>
            <a className={router.pathname === '/products' ? 'active' : ''}>
              Products
            </a>
          </Link>

          {loggedInUser && <Link href='/dashboard'>
            <a className={router.pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </a>
          </Link>}

          {loggedInUser && isAdmin(loggedInUser) && <Link href='/admin'>
            <a className={router.pathname === '/admin' ? 'active' : ''}>
              Admin
            </a>
          </Link>}
        </Ul>
        <Actions>

          {loggedInUser
            ? <>
              <button onClick={() => setAuthUser(null)}>Sign Out</button>
            </>
            : <>
              <button onClick={() => handleAuthAction('signin')}>Sign In</button>
              <button onClick={() => handleAuthAction('signup')}>Sign Up</button>
            </>
          }
        </Actions>
        <HamMenu>
          <FontAwesomeIcon icon={['fas', 'bars']} size='2x' />
        </HamMenu>
      </Nav>
    </Header>
  )
}

export default NavBar
