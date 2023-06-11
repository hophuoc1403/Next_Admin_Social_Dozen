import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useProductSites = () => {
  const productSites = useAppSelector(state => state.productSites.entities);
  const loading = useAppSelector(state => state.productSites.isLoading);
  const pagination = useAppSelector(state => state.productSites.pagination);
  return useMemo(() => {
    return {productSites, loading, pagination} as const
  }, [productSites, loading, pagination])
}