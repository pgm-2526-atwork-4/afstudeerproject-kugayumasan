export type InstitutionModule = {
  id: string;
  key: string;
  name: string;
  access_until: string | null;
  is_default: boolean;
};

export type ConversationChannel = {
  id: string;
  name: string;
  type: string;
  settings: Record<string, unknown> | null;
  supported_languages: string[] | null;
};

export type Institution = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  modules: InstitutionModule[];
  conversation_channels: ConversationChannel[];
};

export type Doctor = {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  riziv: string;
  specialty: { id: string; name: string } | null;
  show_not_asked_in_summary: boolean;
};

export type MeResponse = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  username: string;
  phone: string | null;
  language: string;
  birthdate: string | null; // YYYY-MM-DD
  social_security_number: string | null;
  gender: string;
  timezone: string;
  roles: string[];
  institutions: Institution[];
  doctor: Doctor | null;
};