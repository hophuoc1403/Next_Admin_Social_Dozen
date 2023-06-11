import React, {createContext, Dispatch, SetStateAction, useState} from "react";

interface OrderContextVal {
  title:string,
  setTitle:Dispatch<SetStateAction<string>>
}

export const OrderContext = createContext({} as OrderContextVal)

const OrderProvider = ({children}:{children:React.ReactNode}) => {

  const [title,setTitle] = useState('')

  return <OrderContext.Provider value={{title,setTitle}}>
    {children}
  </OrderContext.Provider>
}

export default OrderProvider