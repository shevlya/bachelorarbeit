export interface RoutePoint {
  idRoutePoint?: number;
  pointName: string;
  pointDescription?: string | null;
  latitude: number;
  longitude: number;
  sortOrder: number;
}

export interface RouteCard {
  idRoute: number;
  routeName: string;
  routeDescription?: string | null;
  imageUrl?: string | null;
  estimatedDurationMinutes: number;
  organizerFio: string;
  verified: boolean;
  moderationStatus: 'PUBLISHED' | 'PENDING' | 'REJECTED';
  pointCount: number;
}

export interface RouteDetail {
  idRoute: number;
  idOrganizer: number;
  organizerFio: string;
  idAdmin?: number | null;
  adminFio?: string | null;
  routeName: string;
  routeDescription?: string | null;
  imageUrl?: string | null;
  estimatedDurationMinutes: number;
  moderationStatus: 'PUBLISHED' | 'PENDING' | 'REJECTED';
  verified: boolean;
  verificationComment?: string | null;
  points: RoutePoint[];
}

export interface RouteCreateDto {
  idOrganizer: number;
  routeName: string;
  routeDescription?: string | null;
  imageUrl?: string | null;
  estimatedDurationMinutes: number;
  points: RoutePointDto[];
}

export interface RoutePointDto {
  pointName: string;
  pointDescription?: string | null;
  latitude: number;
  longitude: number;
  sortOrder: number;
}

export interface RouteSubmitChangesDto {
  routeName?: string;
  routeDescription?: string | null;
  imageUrl?: string | null;
  estimatedDurationMinutes?: number;
  points?: RoutePointDto[];
}
