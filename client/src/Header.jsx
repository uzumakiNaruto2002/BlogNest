// eslint-disable-next-line
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './userContext'

const Header = () => {

  const {setUserInfo, userInfo} = useContext(UserContext);

  useEffect(() => {
      fetch("http://localhost:4000/profile", {
          credentials: 'include',
      }).then(response => {
        if(response.status !== 400){ 
            setUserInfo(userInfo);
        }
      })
  }, [])

  const logout = () => {
      fetch("http://localhost:4000/logout", {
          credentials : 'include',
          method : 'POST',
      })
      setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
        <Link to="/" className="logo">MyBlog</Link>
        <nav>
            {username && (
                <>
                  <Link to = "/create">Create new post</Link>
                  <Link onClick={logout}>Logout</Link>
                </>
            )}
            {!username && (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    </header>
  )
}

export default Header