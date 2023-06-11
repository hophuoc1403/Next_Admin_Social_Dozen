import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useSiteTemplates = () => {
  const siteTemplates = useAppSelector(state => state.siteTemplates.entities);
  const loading = useAppSelector(state => state.siteTemplates.isLoading);
  const pagination = useAppSelector(state => state.siteTemplates.pagination);
  return useMemo(() => {
    return {siteTemplates, loading, pagination} as const
  }, [siteTemplates, loading, pagination])
}