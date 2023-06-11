import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useSites = () => {
  const sites = useAppSelector(state => state.sites.entities);
  const loading = useAppSelector(state => state.sites.isLoading);
  const pagination = useAppSelector(state => state.sites.pagination);
  const currentSite = useAppSelector(state => state.sites.currentSite);

  return useMemo(() => {
    return {sites, loading, pagination, currentSite} as const
  }, [sites, loading, pagination, currentSite])
}