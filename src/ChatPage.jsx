import React, { useState } from 'react'
import { useEffect } from 'react';
import Avatar from './Avatar';
import { useContext } from 'react';
import { UserContext } from './Usercontext';
import {uniqBy} from "lodash";
import { useRef } from 'react';
import axios from 'axios';
import Contact from './Contact';






function ChatPage() {
const [ws,setWs]=useState(null);
const [onlinepeople,setOnlinepeople]=useState({});
const [selecteduserid,setSelecteduserid]=useState('');
const{username,id,setUsername,setId}=useContext(UserContext);
const [Newmessage,setNewmessage]=useState("");
const [messages,setMessages]=useState([]);
const[offlinePeople,setOfflinepeople]=useState({});
const divUndermessages=useRef();







useEffect(()=>{

 connectToWs();


  },[selecteduserid]);


  function  connectToWs(){
    const ws=new WebSocket('ws://localhost:8000');
    setWs(ws);
    ws.addEventListener('message',handleMessage);
    ws.addEventListener("close",()=>{
      setTimeout(() => {
        console.log("disconnected !!,trying to reconnecte ");
        connectToWs();
      }, 1000);
    } )    
    
  }






function showOnlinePeople(peopleArray){
  const people={};
  peopleArray.forEach(({userId,username})=>{
    people[userId]=username;
    
  })
setOnlinepeople(people); 

}







function handleMessage(e){
  const messageData=JSON.parse(e.data);
  if('online' in messageData){
    showOnlinePeople(messageData.online);
  }else if("text" in messageData){
  setMessages(prev=>([...prev,{...messageData}]))
  }





}
 function logout(){
   
  axios.post('http:/localhost:8080/logout').then(()=>{
    setId(null);
    setWs(null);
    setUsername(null);
  })
   
}





function sendMessage(e){
   e.preventDefault();
   ws.send(
     JSON.stringify({
       
         recepient:selecteduserid,
         text:Newmessage,
       
     })
   )
   setNewmessage('')
   setMessages(prev=>([...prev,{
     text:Newmessage,
        sender:id,
      recepient:selecteduserid,
      _id:Date.now(),

      }]));
 
}
  

useEffect(()=>{

  axios.get("/people").then(res=>{
   const offlinePeopleArr= res.data.filter(p=>p._id!==id)
   .filter(p=>!Object.keys(onlinepeople).includes(p._id))
   const offlinePeople={};
   offlinePeopleArr.forEach(p=>{
     offlinePeople[p._id]=p;
   })

   setOfflinepeople(offlinePeople);
  })
  

},[onlinepeople])



useEffect(()=>{
  const div= divUndermessages.current;
  if(div){
    div.scrollIntoView({behavior:'smooth',block:'end'})

  }
   
},[messages] )








useEffect(()=>{
  if(selecteduserid){
     axios.get('/messages/'+selecteduserid).then(res=>{
       setMessages(res.data);
     })

  }
},[selecteduserid])





console.log("selected one is",selecteduserid);
console.log("type is",typeof(selecteduserid));





const onlinepeopleExcludingOuruser={...onlinepeople};
delete onlinepeopleExcludingOuruser[id];

console.log("online people ",onlinepeople);
console.log("online people excluding u",onlinepeopleExcludingOuruser)

const messagesWithoutDupes=uniqBy(messages,'_id');


// console.log("onli",onlinepeopleExcludingOuruser);
console.log("off",offlinePeople);


  return (
    <div className='flex h-screen'> 
        <div className='bg-white w-1/3 pl-6 pt-5 flex flex-col'>

     
    
    <div className='flex-grow' >

     <div className='text-blue-700 font-bold flex gap-2 mb-4'>Lalith chat</div> 
     { 
            Object.keys(onlinepeopleExcludingOuruser) .map(userId=>(
            
              
               <Contact
               key={userId}
               id={userId}
               online={true}
               username={onlinepeople[userId]}
               onClick={()=>setSelecteduserid(userId)}
               selected={userId===selecteduserid}/>

  
              
            ))}
              {
            Object.keys(offlinePeople).map(userId=>(
            
              
               <Contact
               key={userId }
               id={userId}
               online={false}
               username={offlinePeople[userId].username}
               onClick={()=>setSelecteduserid(userId)}
               selected={userId===selecteduserid}/>

  
              
             ))}
    </div>
         
         <div className='p-2 text-center'>
           <span className='mr-2 text-sm text-gray-600' >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>

               {username}</span> 
           <button className='text-sm  bg-blue-200 py-1 px-2 text-gray-500  border rounded-sm'>Logout </button>
         </div>
        </div>



        <div className='flex flex-col bg-blue-50 w-2/3 p-2'>

      <div className='flex-grow'>
        { !selecteduserid &&(
          <div className='flex h-full items-center justify-center text-gary-100'>&larr;  please select a contact to chat </div>
        )
        }
        {
          !!selecteduserid&&(
            <div className='relative h-full'>
            <div  className='overflow-y-scroll absolute inset-0'>
              {messagesWithoutDupes.map(message=>(
             <div  key={message._id} className={(message.sender===id?'text-right':'text-left')}>
              <div className={"inline-block p-2  my-2 rounded-md text-sm "+(message.sender===id ?"bg-blue-500 text-white":"bg-white text-gray-500")}>
           
              {message.text}
              </div>
              </div>
          ))}
          <div   ref={divUndermessages}></div>
              </div>
              </div>
            
          )
        }
          </div>

             {!!selecteduserid&&(

<form className='flex gap-2 ' onSubmit={sendMessage}>
          <input 
          type='text'
          value={Newmessage}
          onChange={(e)=>setNewmessage(e.target.value)}
           placeholder='Type your message ,,'
         className='bg-white flex-grow border p-2'
         />

<button className='bg-blue-500 p-2 text-white' onClick={logout()} type='submit'>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
</svg>

</button>
      </form>
             )
             
        
             
             }
      

  
        </div>
    </div>
  )
}

export default ChatPage;