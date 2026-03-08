export type Patient = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  birthdate: string | null;
  social_security_number: string | null;
  gender: string | null;
  roles: string[];
};

export type SearchPatientsParams = {
  institutionId: string;
  search?: string;
  first_name?: string;
  last_name?: string;
  social_security_number?: string;
  email?: string;
  limit?: number;
};
