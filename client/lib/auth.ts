export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export function getCurrentUser(): CurrentUser {
  return {
    id: "user-1",
    name: "Jhon Doe",
    email: "jhon@example.com",
  };
}
