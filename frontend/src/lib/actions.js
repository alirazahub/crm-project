'use server'

import api from "@/utils/api";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';

export async function handleGoogleSignIn(){
    await signIn('google' , {redirectTo : '/dashboard'}) ;
}

export async function createUser(formData){
    try{
        const email = formData.get('email') ;
        const password = formData.get('password') ;
        const role = formData.get('role') ;
        const fullname = formData.get('fullname') ;
        const cookieStore = await cookies() ;
        const token = cookieStore.get('token').value;
        console.log(token) ;
        const res = await api.post('/create-user', { email , password , role , fullname} ,{
            headers: {
          Authorization: `Bearer ${token}`,
        }
    }) ;
    }catch(err){
        console.log(err) ;
        if(err.response.status === 401 || err.response?.status === 403)
            return redirect('/sign-in');
        console.error('Unhandled error:', err);
        throw err; // rethrow to avoid swallowing unexpected errors
    }
    return redirect('/dashboard') ;
}
