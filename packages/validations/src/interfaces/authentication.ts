export type AuthType = {
  name?: string;
  email: string;
  password: string;
  confirm_password?: string;
  access_token?: string;
  user_type?: string;
};

export type SignupType = {
  name: string;
  email: string;
  password: string;
  user_type: string;
  access_token?: string;
};
