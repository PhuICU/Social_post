import { useSearchParams } from "react-router-dom";

export default function useQueryParam() {
  const [searchParams] = useSearchParams();
  const queryParam = Object.fromEntries(searchParams);
  return queryParam;
}
