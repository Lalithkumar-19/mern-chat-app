import React from 'react'
import Avatar from './Avatar'
function Contact({id,username,onClick,selected,online}) {
  return (
    <div  key={id} onClick={()=>onClick(id)}
               className={`border-b border-grey-100 py-2 flex items-center gap-2 mb-2 cursor-pointer  rounded-full ${selected?"bg-blue-100":" "}`}>
              
              {
              selected&&(
                  <div className='w-1 bg-blue-500 h-6 ml-1 '/>
                )
              }
              <div className='flex gap-2 py-2 pl-4 items-center'>
                <Avatar online={online} username={username} userId={id}/>
                
              <span className='text-gray-800  font-bold'>{username}</span>  
               </div> 
               </div>
  )
}

export default Contact