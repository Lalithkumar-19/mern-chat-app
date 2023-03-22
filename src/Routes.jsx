import React from 'react'
import { useContext } from 'react'
import { UserContext } from './Usercontext'
import RegisterandLoginPage from './RegisterandLoginPage';
import ChatPage from './ChatPage';

function Routes() {

    const{username,id}=useContext(UserContext);
    if(username){
        return <ChatPage/>
    }
  return (
    <RegisterandLoginPage/>
  )
}

export default Routes;