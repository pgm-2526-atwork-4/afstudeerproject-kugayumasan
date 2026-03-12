export type ConversationStatus =
  | "pending"
  | "ongoing"
  | "finished"
  | "planned"
  | "expired"
  | "error"
  | "removed";

export type ConversationPatient = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  birthdate: string | null;
};

export type ConversationDoctor = {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  riziv: string;
  specialty?: {
    id: string;
    name: string;
  } | null;
};

export type ConversationChannel = {
  id: string;
  name: string;
  type: string;
};

export type Conversation = {
  id: string;

  status: ConversationStatus;

  due_date: string | null;
  created_at: string | null;
  finished_at: string | null;

  language: string | null;

  has_consultation_notes: boolean;
  is_anamnese_copied: boolean;

  doctor: ConversationDoctor | null;
  patient: ConversationPatient | null;
  channel: ConversationChannel | null;
};

export type PaginatedConversationsResponse = {
  data: Conversation[];

  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };

  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
};

export type GetConversationsParams = {
  institution: string;

  from_date?: string;
  to_date?: string;

  patient?: string;
  doctor?: string;
  status?: string;

  required_fields?: string;
  sort?: string;

  page?: number;
  page_size?: number;
};
