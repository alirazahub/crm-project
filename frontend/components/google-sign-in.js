
import {handleGoogleSignIn} from '../lib/actions' ;
 
export default function GoogleSignIn() {
  return (
    <form
      action={handleGoogleSignIn}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
} 