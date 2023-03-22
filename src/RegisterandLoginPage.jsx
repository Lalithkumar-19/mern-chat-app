import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "./Usercontext";

function RegisterandLoginPage() {

const [username,setUsername]=useState('');
const [password,setPassword]=useState('');
const[isLoginOrRegister,setIsLoginOrRegister]=useState('register')
const {setUsername:setLOggedInUsername,setId}= useContext(UserContext)  ; 

async function handleSubmit(e){
  const url=isLoginOrRegister ==='register'?'register':'login';
  e.preventDefault(); 
  const {data}=await axios.post(url,{username,password})
   setLOggedInUsername(username);
   setId(data.id)



}







  return (
   <div className="bg-green-50 h-screen flex items-center">
    <form className="w-64 mx-auto  mb-12" onSubmit={handleSubmit}>
        <input type="text"
             value={username} onChange={(e)=>setUsername(e.target.value)} className="block w-full p-2 mb-2 border" placeholder="username"/>
        <input type="password"
               value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" className="block w-full rounded-sm p-2 mb-2 border"/>
      <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
         {isLoginOrRegister==='register'?'Regitser':'Login'}
      
      </button>






      <div  className="text-center mt-2">
  
        {isLoginOrRegister==="register"&&(
          <div>
                  Already a member?
                  <button onClick={()=>setIsLoginOrRegister('login')}>Login here</button>
   
            </div>
        )}



        {isLoginOrRegister==='login'&&(
              <div>
             Don't have an account? 
              <button onClick={()=>setIsLoginOrRegister('register')}>Register</button>

        </div>
        )}
         </div>
    </form>
 
   
    </div>



  )
}

export default RegisterandLoginPage;