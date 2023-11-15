"use client"

import Link from 'next/link';
import { useState } from 'react'

const AdminLogin = () => {

  const [buttonState, setButtonState] = useState('default');

  const handleLogin = () => {
    setButtonState('loading');
    setTimeout(() => {
      setButtonState('success');
    }, 2000);
  };

  const renderButtonContent = () => {
    switch (buttonState) {
      case 'loading':
        return <span>Loading...</span>; // You can replace this with a spinner component
      case 'success':
        return <Link href="https://shorturl.at/gn157">Logged in, click here to go to the Admin page</Link>;
      default:
        return <span>Login</span>;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="username">Username</label>
        <input className="rounded-sm bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20" type="text" id="username" name="username" placeholder="admin" />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="password">Password</label>
        <input className="rounded-sm bg-white/10 outline-offset-2 px-4 py-3 font-regular shadow-sm no-underline hover:bg-white/20" type="password" id="password" name="password" placeholder="password" />
      </div>
      <button onClick={handleLogin} className="rounded-sm w-full mt-4 bg-secondary outline-offset-2 text-black px-10 py-3 shadow-sm font-semibold no-underline hover:bg-secondary/80" type="submit">{renderButtonContent()}</button>
    </>
  )
}

export default AdminLogin;