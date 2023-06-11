import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useProducts = () => {
  const products = useAppSelector(state => state.products.entities);
  const loading = useAppSelector(state => state.products.isLoading);
  const pagination = useAppSelector(state => state.products.pagination);
  return useMemo(() => {
    return {products, loading, pagination} as const
  }, [products, loading, pagination])
}