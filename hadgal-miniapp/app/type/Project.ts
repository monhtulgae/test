export interface Projects {
  id: number;
  name: string;
  type: string;
  sector: string;
  location?: string;
  start_date?: string;
  status?: string;
  description?: string;
  stakeholders?: string[];
  budget?: number;
  irr?: number;
  current?: number;
  outcomes?: string[];
  contact?: {
    organization: string;
    email: string;
  };
  website?: string;
}