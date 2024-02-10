//imports
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseAuth } from './BaseConfig';
import { LoginFormValues, UserFormValues } from '../interfaces';

// ```
// #### Sign in and Sign up functions
// ```ts

//required if you want to keep logged in after user exits the browser or closes tab
setPersistence(firebaseAuth,  browserLocalPersistence);

//Sign in functionality
export const signIn = async ({ email, password }: LoginFormValues) => {
 const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
 return result;
};

//Sign up functionality
export const signUp = async ({ email, password }: UserFormValues) => {
 const  userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

 const user  = userCredential.user
 
 return user;
};

// Update Profile
// export const UpdateProfile = async ({ email, password }: UserFormValues) => {
//   const  result = await updateProfile(firebaseAuth, email);
//   return result;
//  };
 

//Sign out functionality
export const  SignOut  =  async () => {
 await  signOut(firebaseAuth);
};