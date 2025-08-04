"use client"
import {useState} from 'react'
import { useParams } from "next/navigation";

export default function ResetPasswordPage(){
  const {token} = useParams();
    const [password,setPassword]=useState("");
    const [msg,setMsg]=useState("");

const handleReset=async(e)=>{
    e.preventDefault();
try{
    const res=await fetch(`http://localhost:5000/reset-pswd/${token}`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({password}),
  });
  
  const data=await res.json();

if (res.ok) {
setMsg(data.message);
} else {
setMsg(data.message);
}
}
catch(err){
     setMsg("Invalid or expired token");
}

};
return(
<div style={{ padding: 20 }}>
      <h2>Reset Password</h2>
    <form onSubmit={handleReset}>
    <input
    type="password"
    placeholder="Enter new password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}//e.target.value is the current value of the input.
    required
    />
    <button type="submit">Reset Password</button>
    </form>
      <p>{msg}</p>
    </div>
);
}