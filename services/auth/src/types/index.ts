export type TUserProps = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
};

export type TUserCredentials = Omit<TUserProps, "name" | "phone_number">;

export type TTokenPayload = {
  id: string;
  email: string;
};

export type TUserSessionProps = {
  refreshToken: string;
  ip_address?: string;
  user_agent?: string;
};
