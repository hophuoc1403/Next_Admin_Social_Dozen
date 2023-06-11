import React, {createContext, useContext, useEffect, useState} from "react";
import {accountService} from "@/services/account.service";
import LoadingScreen from "@/content/Applications/LoadingScreen";

interface IAuthProvider {
  children: React.ReactNode;
}

const AuthInitialValue: IAccount = {
    id: 0,
    email: "",
    updatedAt: "",
}

const AuthContext = createContext({
  account: AuthInitialValue,
  setAccount: (account: IAccount) => {
  },
  resetAccount: () => {
  },
  isSignedIn:false,
  setIsSignedIn:(status:boolean) => {}
})

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = (props: IAuthProvider) => {
  const {children} = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [account, setAccount] = useState<IAccount>(AuthInitialValue);
  const [isSignedIn,setIsSignedIn] = useState(false)

  const resetAccount = () => {
    setAccount(AuthInitialValue);
  }

  useEffect(function onLoad() {
    accountService.getAccountInfo().then((account) => {
      setAccount(account as any);
      setIsSignedIn(true)
      setIsLoading(false);
    }).catch(() => {
      // window.location.replace("/auth/sign-in")
      setAccount(AuthInitialValue);
    })
  }, [])

  return <AuthContext.Provider
    value={{
      setIsSignedIn,
      isSignedIn,
      account,
      setAccount: setAccount,
      resetAccount: resetAccount,
    }}
  >
    {isLoading ? <LoadingScreen/> : children}
  </AuthContext.Provider>
}