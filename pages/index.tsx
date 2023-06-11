import {useRouter} from "next/router";
import {useAuthContext} from "@/contexts/AuthContext";

const Home = () => {

  const router = useRouter()
  const {isSignedIn, account} = useAuthContext()
  if (isSignedIn)
    router.push(account.role.includes("admin") ? '/app/manage/product-site' : '/app/service-price')
  else {
    router.push('/auth/sign-in')
  }

  return <div></div>
}

export default Home
