interface IProduct {
  _id: string;
  name: string;
  description: string;
  specs: {k: string, v: string}[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  id: string;
}

interface ICreateProduct {
  name: string;
  description: string;
  specs: {k: string, v: string}[];
}

interface IUpdateProduct {
  name?: string;
  description?: string;
  specs?: {k: string, v: string}[];
}

interface IFilter {
  k?: string,
  name?: string,
  slug?: string,
  v?: string
}

interface LoadProductResults {
  data: IProduct[],
  paginationOptions: IApiPagination
}