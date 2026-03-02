import firebaseInitialization from "./firebase.init";
import { getAuth,createUserWithEmailAndPassword,updateProfile, 
onAuthStateChanged,signInWithEmailAndPassword,signOut,sendPasswordResetEmail} from 'firebase/auth';

firebaseInitialization();

const auth = getAuth();

export {auth,createUserWithEmailAndPassword,updateProfile,
onAuthStateChanged,signInWithEmailAndPassword,signOut,sendPasswordResetEmail}