import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useAccounts = () => {

  const accounts = useAppSelector(theme => theme.accounts.entities)
  const loading = useAppSelector(theme => theme.accounts.isLoading)
  const pagination = useAppSelector(theme => theme.accounts.pagination)
  const isHostSite = useAppSelector(theme => theme.accounts.isHostSite)

  return useMemo(() => {
    return {accounts,loading,pagination,isHostSite}
  },[accounts,loading,pagination,isHostSite])
}