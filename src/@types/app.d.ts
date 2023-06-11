type IQueries = Record<string, string | number | boolean>;
type LoadingStatus = "idle" | "pending" | "success" | "fail";

interface IApiPagination {
  totalItems: number,
  itemCount: number,
  itemsPerPage: number,
  totalPages: number,
  currentPage: number
}


