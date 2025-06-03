// TypeScript interface definitions
// Disse hjælper med type safety i hele applikationen

export interface Bolche {
  id: number;
  navn: string;
  farve: string;
  vaegt: number;
  smagSurhed: string;
  smagStyrke: string;
  smagType: string;
  raavarepris: number;
  createdAt: string;
  updatedAt: string;
}

// Type til at oprette en ny bolche (uden ID og timestamps)
export type CreateBolche = Omit<Bolche, 'id' | 'createdAt' | 'updatedAt'>;

// Type til at opdatere en bolche (alle felter optional undtagen ID)
export type UpdateBolche = Partial<CreateBolche> & { id: number };