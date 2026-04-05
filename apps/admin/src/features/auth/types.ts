export type AuthMeResponse = {
  account: {
    id: string;
    email: string;
    name: string;
    isSuperAdmin?: boolean;
  };
  tenant: {
    id: string;
    name: string;
  };
  member: {
    id: string;
    roles: string[];
  };
};

export type LoginResponse =
  | {
      mode: "LOGGED_IN";
    }
  | {
      mode: "SELECT_TENANT";
      loginToken: string;
      tenants: Array<{ tenantId: string; tenantName: string }>;
    };
