import { apiClient } from "../../../services/apiClient";

export interface ResourceRecord {
  id: string;
  isDelete: boolean;
}

export function createResourceApi<T extends ResourceRecord>(endpoint: string) {
  let cachedList: T[] | undefined;
  let pendingList: Promise<T[]> | undefined;

  async function list(force = false) {
    if (!force && cachedList) return cachedList;
    if (!force && pendingList) return pendingList;

    const request = apiClient
      .get<T[]>(endpoint)
      .then((records) => {
        cachedList = records;
        return records;
      })
      .finally(() => {
        pendingList = undefined;
      });
    pendingList = request;
    return request;
  }

  return {
    list,
    getById: (id: string) =>
      apiClient.get<T>(`${endpoint}/${encodeURIComponent(id)}`),
    create: async (values: Record<string, unknown>) => {
      const record = await apiClient.post<T>(endpoint, values);
      cachedList = undefined;
      return record;
    },
    update: async (id: string, values: Record<string, unknown>) => {
      const record = await apiClient.put<T>(
        `${endpoint}/${encodeURIComponent(id)}`,
        values,
      );
      cachedList = undefined;
      return record;
    },
  };
}
