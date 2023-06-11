import React, {useEffect} from "react";
import OrderProvider from "@/contexts/OrderContext";
import {SidebarProvider} from "@/contexts/SidebarContext";
import {AuthProvider, useAuthContext} from "@/contexts/AuthContext";
import {useAppDispatch} from "@/hooks/redux.hook";
import {loadCart} from "@/redux/actions/cart.action";
import {loadProductSites} from "@/redux/actions/product-sites.action";
import {loadCurrentSite} from "@/redux/actions/site.action";
import {setHostSite} from "@/redux/reducer/account.slice";
import {loadProducts} from "@/redux/actions/product.action";

interface InnerAppProps {
  children: React.ReactNode;
}

const InnerAppProvider = (props: InnerAppProps) => {
  const {account} = useAuthContext()
  const {children} = props;
  const dispatch = useAppDispatch();
  useEffect(function onLoad() {
    // dispatch(loadCart({}));
    // dispatch(loadProductSites({}));
    // dispatch(loadProducts({}));
    // dispatch(loadCurrentSite({})).then(res => {
    //   if(res.meta.requestStatus.match("fulfilled")){
    //     const results : any = res.payload
    //     if(account._id === (results.owner)){
    //       dispatch(setHostSite())
    //     }
    //   }
    // })
  }, [])

  return <AuthProvider>
    <SidebarProvider>
      <OrderProvider>
        {children}
      </OrderProvider>
    </SidebarProvider>
  </AuthProvider>
}

export default InnerAppProvider;