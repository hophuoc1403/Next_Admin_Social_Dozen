import {useAppSelector} from "@/hooks/redux.hook";
import {useMemo} from "react";

export const useTheme = () => {
  const {theme} = useAppSelector(state => state.theme)

  return useMemo(() => {
    return {theme} as const
  }, [theme])
}