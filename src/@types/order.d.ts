
type OrderStatus = "new" | "processing" | "completed"

interface IOrder {
  _id:string
  status:OrderStatus
  orderItems: { productSite: IProductSite, quantity: number }[]
  total:number,
  account:IAccount,
  site:ISite
  createdAt:string
}

interface ICreateOrder {
  orderItems: { productSite: string, quantity: number }[]
}

interface ICreateSiteOrder {
  orderItems: { productSite: string, quantity: number }[]
  orderFor:string
}

interface IUpdateOrder {
  id: string;
  status: OrderStatus;
}

interface ILoadOrderResults {
  data: IOrder[],
  paginationOptions: IApiPagination
}