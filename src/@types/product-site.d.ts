
interface IProductSite {
  _id:string,
  product:IProduct,
  site:ISite,
  price:number
  createdAt:string,
  updatedAt:string
}

interface ILoadAProductSitesResults{
  data: IProductSite[],
  paginationOptions: IApiPagination
}