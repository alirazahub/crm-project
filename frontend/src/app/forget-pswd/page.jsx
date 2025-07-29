"use client"
import {useState} from 'react'

export default function ForgetPasswordPage(){
const [email,setEmail]=useState("");
const [message,setMessage]=useState("");

const handleSubmit=async(e)=>{
    e.preventDefault();
try{
    const res=await fetch(`http://localhost:5000/forget-pswd`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email}),
  });
  console.log("Sending to backend:", email);

const data=await res.json();

if(res.ok){
    setMessage(data.message);
    console.log("Reset Link:", data.reset);}
else { setMessage(data.message);}

}
catch (err) {
      setMessage("Error sending reset link"); }

};
return(

    <div style={{ padding: 20 }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <p>{message}</p>
    </div>
);
}