import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/router";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleUser = (rawUser) => {
    if (rawUser) {
      setUser(rawUser);
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  };
  const signInWithGoogle = async (fn) => {
    setLoading(true);
    const response = await signInWithPopup(auth, new GoogleAuthProvider());
    handleUser(response.user);
    if (fn) {
      await fn(response);
    }
    router.back();
  };
  const createUserWithEmail = async (email, password, username, fn) => {
    setLoading(true);
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    handleUser(response.user);
    if (fn) {
      await fn(response, username);
    }
    router.back();
  };

  const signInWithEmail = async (email, password) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    handleUser(response.user);
    router.back();
  };
  const logout = () => {
    return signOut(auth).then(() => handleUser(false));
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => {
      unsubscribe();
    };
  }, []);
  return {
    user,
    logout,
    loading,
    signInWithGoogle,
    signInWithEmail,
    createUserWithEmail,
  };
};
const UserContext = createContext();
export const UserContextProvider = ({ children }) => {
  const auth = useAuth();
  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
};
const useUser = () => useContext(UserContext);
export default useUser;
