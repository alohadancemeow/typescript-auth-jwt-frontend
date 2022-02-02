import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@apollo/client'
import { Oval } from 'react-loader-spinner'
import { DELETE_USER, UPDATE_ROLES } from '../apollo/mutations'
import { USERS } from '../apollo/queries'

import { Role, User } from '../types'
import { isSuperAdmin } from '../helpers/authHelpers'

interface Props {
  user: User
  admin: User | null
}

const DeleteBtn = styled.button`
  background: red;
  color: white;

  &:hover {
    background: orange;
  }
`

const AdminRow: React.FC<Props> = ({ user, admin }) => {

  const { roles } = user

  const initialState = {
    CLIENT: roles.includes('CLIENT'),
    ITEMEDITOR: roles.includes('ITEMEDITOR'),
    ADMIN: roles.includes('ADMIN'),
  }

  // # States
  const [isEditing, setIsEditing] = useState(false)
  const [roleState, setRoleState] = useState(initialState)

  // HOOKS: useMutation
  const [updateRoles, { loading, error }] = useMutation<{ updateRoles: User }, { userId: string; newRoles: Role[] }>(UPDATE_ROLES)
  const [deleteUser, deleteUserResponse] = useMutation<{ deleteUser: { message: string } }, { userId: string }>(DELETE_USER)


  // EFFECT: Errors
  useEffect(() => {
    if (error) alert(error.graphQLErrors[0].message || 'Sorry, something went wrong.')
  }, [error])

  useEffect(() => {
    if (deleteUserResponse.error) alert(deleteUserResponse.error.graphQLErrors[0].message || 'Sorry, something went wrong.')
  }, [deleteUserResponse.error])

  // HANDLE: deleteUser, handleSubmitUpdateRoles 
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await deleteUser({ variables: { userId }, refetchQueries: [{ query: USERS }] })
      if (response.data?.deleteUser.message) alert(response.data.deleteUser.message)
    } catch (error) {
      alert((error as Error).message)
    }
  }

  const handleSubmitUpdateRoles = async (userId: string) => {
    try {

      const newRoles: Role[] = []

      // convert Object --> Array
      // push the only key === true --> newRoles
      // ex. {ITEMEDITOR: true, ADMIN: false} ==> [[ITEMEDITOR, true],[ADMIN, false]] --> push "ITEMEDITOR" to newRoles[] 
      Object.entries(roleState).forEach(([k, v]) => v ? newRoles.push(k as Role) : null)

      // check if the roles has not been changed, don't call to backend
      if (user.roles.length === newRoles.length) {
        const checkRoles = user.roles.map(role => newRoles.includes(role))

        if (!checkRoles.includes(false)) {
          alert('Noting change')
          setIsEditing(false)
          return
        }
      }

      // else: update roles, then close editing mode
      const response = await updateRoles({ variables: { userId, newRoles } })
      if (response.data?.updateRoles) {
        setIsEditing(false)
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <tr key={user.id}>
      {/* Name */}
      <td>{user.username}</td>

      {/* Email */}
      <td>{user.email}</td>

      {/* CreatedAt */}
      <td>{user.createdAt}</td>

      {/* Manage Roles Section */}
      {/* client role */}
      {isSuperAdmin(admin) &&
        <>
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
          >
            <FontAwesomeIcon
              icon={['fas', 'check-circle']}
              className='true'
              size='lg'
              style={{ color: 'black', cursor: 'not-allowed' }}
            />
          </td>

          {/* item editor role */}
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
            onClick={
              isEditing
                ? () => setRoleState(prev => ({ ...prev, ITEMEDITOR: !prev.ITEMEDITOR }))
                : undefined
            }
          >
            {roleState.ITEMEDITOR ? (
              <FontAwesomeIcon
                icon={['fas', 'check-circle']}
                className='true'
                size='lg'
                style={{ color: !isEditing ? 'black' : undefined }}
              />
            ) : (
              <FontAwesomeIcon
                icon={['fas', 'times-circle']}
                className='false'
                size='lg'
                style={{ color: !isEditing ? 'lightgray' : undefined }}
              />
            )}
          </td>

          {/* admin role */}
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
            onClick={
              isEditing
                ? () => setRoleState(prev => ({ ...prev, ADMIN: !prev.ADMIN }))
                : undefined
            }
          >
            <>
              {roleState.ADMIN ? (
                <FontAwesomeIcon
                  icon={['fas', 'check-circle']}
                  className='true'
                  size='lg'
                  style={{ color: !isEditing ? 'black' : undefined }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={['fas', 'times-circle']}
                  className='false'
                  size='lg'
                  style={{ color: !isEditing ? 'lightgray' : undefined }}
                />
              )}
            </>
          </td>

          {/* super admin role */}
          <td>
            {isSuperAdmin(user) && (
              <FontAwesomeIcon
                style={{ cursor: 'not-allowed' }}
                icon={['fas', 'check-circle']}
                size='lg'
              />
            )}
          </td>

          {/* action */}
          {loading
            ? <Oval color='teal' width={30} height={30} />
            : isEditing
              ? <td>
                <p className='role_action'>
                  <button>
                    <FontAwesomeIcon
                      icon={['fas', 'times']}
                      color='red'
                      onClick={() => {
                        setRoleState(initialState)
                        setIsEditing(false)
                      }}
                      size='lg'
                    />
                  </button>
                  <button onClick={() => handleSubmitUpdateRoles(user.id)}>
                    <FontAwesomeIcon icon={['fas', 'check']} color='teal' size='lg' />
                  </button>
                </p>
              </td>
              : <td>
                <button onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              </td>
          }
          <td>
            {!isSuperAdmin(user)
              ? <DeleteBtn
                onClick={() => confirm('Are you sure to delete this user ?') ? handleDeleteUser(user.id) : null}
                style={{ cursor: isEditing ? 'not-allowed' : undefined }}
                disabled={isEditing}
              >
                {deleteUserResponse.loading
                  ? <Oval color='teal' width={30} height={30} />
                  : <FontAwesomeIcon icon={['fas', 'trash-alt']} size='lg' />
                }
              </DeleteBtn>
              : null}
          </td>
        </>
      }

    </tr>
  )
}

export default AdminRow
