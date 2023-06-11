import React, {ComponentType} from "react";
import { useRouter } from "next/router";

function withRoles<T extends Record<string, unknown>>(listRoles: string[]) {
  return (WrappedComponent: ComponentType<T>) => {
    // eslint-disable-next-line react/display-name
    return (hocProps: T) => {
      const router = useRouter();
      // const userRoles = useAppSelector(state => state.auth.account.roles);
      const userRoles = [];
      const checkIsExistRole = (roles: string[]) => {
        let isExist = false;
        listRoles.forEach((role) => {
          if (roles.includes(role)) isExist = true;
        });
        return isExist;
      };
      if (!checkIsExistRole(userRoles)) {
        router.push('/404')
      };
      return <WrappedComponent {...(hocProps as T)} />;
    };
  };
}

export default withRoles;
