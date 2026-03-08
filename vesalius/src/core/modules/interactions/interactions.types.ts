export type ConversationStatus =
  | "pending"
  | "ongoing"
  | "finished"
  | "planned"
  | "expired"
  | "error"
  | "removed";

export type ConversationListItem = {
  id: string;
  status: ConversationStatus | string;
  due_date: string | null;
  language: string | null;
  has_consultation_notes: boolean;
  is_anamnese_copied: boolean;
  doctor: {
    id: string;
    first_name: string;
    last_name: string;
    title: string | null;
    riziv: string;
    specialty?: unknown;
  } | null;
  patient: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    birthdate: string | null;
  } | null;
  channel: {
    id: string;
    name: string;
    type: string;
  } | null;
  created_at: string | null;
  finished_at: string | null;
};

export type PaginatedConversationsResponse = {
  data: ConversationListItem[];
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
  page?: number;
  page_size?: number;
  sort?: string;
  patient?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  required_fields?: string;
  doctor?: string;
};