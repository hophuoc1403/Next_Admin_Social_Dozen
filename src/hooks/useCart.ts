import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useCart = () => {
  const allCarts = useAppSelector(state => state.cart.entities)
  const selectedCart = useAppSelector(state => state.cart.selectedEntities)
  const loading = useAppSelector(state => state.cart.isLoading)
  const pagination = useAppSelector(state => state.cart.pagination);
  return useMemo(() => {
    return {allCarts, selectedCart, loading, pagination} as const
  }, [allCarts, selectedCart, pagination])
}