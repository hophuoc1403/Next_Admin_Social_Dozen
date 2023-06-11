import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useOrders = () => {
  const orders = useAppSelector(state => state.orders.entities);
  const loading = useAppSelector(state => state.orders.isLoading);
  const pagination = useAppSelector(state => state.orders.pagination);

  return useMemo(() => {
    return {orders, loading, pagination} as const
  }, [orders, loading, pagination])
}