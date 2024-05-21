/// Filters to pass to the API controlled using the Home page
export interface JobFilter {
  company: string;
  experience: string[];
  location: string[];
  roles: string[];
  salary: string[];
}
