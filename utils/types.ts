export type CandidateType = {
  first_name: string;
  middle_name: string;
  last_name: string;
  portfolio: string;
  image: string;
  created_at?: string;
  id?: number | string;
  votes: number;
  yes_votes?: number;
  no_votes?: number;
  vote?: string;
};

export type UserType = {
  id?: number;
  pin: string;
  has_voted: boolean;
  created_at?: string;
  updated_at?: string;
};
