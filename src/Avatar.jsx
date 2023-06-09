import React from 'react'

function Avatar({userId,username,online}) {
    const colors=['bg-red-200','bg-green-200','bg-purple-200','bg-blue-200','bg-yellow-200','bg-teal-200'];
    const userIdBase10=parseInt(userId,16);
    const colorIndex=userIdBase10%colors.length;
    const color=colors[colorIndex];
  return (
    <div className={'w-10 h-10 relative bg-red-200 rounded-full  flex  items-center content-center'+color} >
<div className='text-center w-full opacity-70'> {username?username[0]:"n"}</div>
{online&&
(
  <div className='absolute w-3 h-3 rounded-full border-white  bg-green-400 bottom-0 right-0' ></div>
)
}
{
  !online&&(
    <div className='absolute w-3 h-3 rounded-full border-white  bg-gray-400 bottom-0 right-0' ></div>
  )
}

    </div>
  )
}

export default Avatar;