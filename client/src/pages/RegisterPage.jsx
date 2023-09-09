import React, { useState } from 'react'

const RegisterPage = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type':'application/json'}
      });
      if(response.status === 200){
        alert("Registration Successful.");
      }
      else{
        alert("Registration failed.");
      }
  }

  return (
    <form action='' className='register' onSubmit={register}>
      <h1>Register</h1>
      <input 
        type="text"
        value={username}
        placeholder='username' 
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="password" 
        value={password}
        placeholder='password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Register</button>
    </form>
  )
}

export default RegisterPage