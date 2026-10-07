export interface Incident {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  service: string;
  status: string;
}

export type CreateIncidentRequest = Omit<Incident, 'id' | 'createdAt'>;
export type UpdateIncidentRequest = Omit<Incident, 'id' | 'createdAt'>;