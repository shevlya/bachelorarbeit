import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environment';
import {
  RouteCard,
  RouteDetail,
  RouteCreateDto,
  RouteSubmitChangesDto
} from '../models/route.models';

@Injectable({providedIn: 'root'})
export class RouteService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getPublishedRoutes(): Observable<RouteCard[]> {
    return this.http.get<RouteCard[]>(`${this.api}/routes/published`);
  }

  getAllRoutes(): Observable<RouteCard[]> {
    return this.http.get<RouteCard[]>(`${this.api}/routes`);
  }

  getRouteById(id: number): Observable<RouteDetail> {
    return this.http.get<RouteDetail>(`${this.api}/routes/${id}`);
  }

  getRoutesByOrganizer(organizerId: number): Observable<RouteCard[]> {
    return this.http.get<RouteCard[]>(`${this.api}/routes/organizer/${organizerId}`);
  }

  searchRoutes(keyword: string): Observable<RouteCard[]> {
    return this.http.get<RouteCard[]>(`${this.api}/routes/search?keyword=${encodeURIComponent(keyword)}`);
  }

  getPendingRoutes(): Observable<RouteCard[]> {
    return this.http.get<RouteCard[]>(`${this.api}/routes/admin/pending`);
  }

  createRoute(dto: RouteCreateDto): Observable<RouteDetail> {
    return this.http.post<RouteDetail>(`${this.api}/routes`, dto);
  }

  submitChanges(routeId: number, dto: RouteSubmitChangesDto): Observable<RouteDetail> {
    return this.http.put<RouteDetail>(`${this.api}/routes/${routeId}/submit`, dto);
  }

  approveRoute(routeId: number, adminId: number): Observable<RouteDetail> {
    return this.http.post<RouteDetail>(`${this.api}/routes/admin/${routeId}/approve`, {adminId});
  }

  rejectRoute(routeId: number, comment?: string): Observable<void> {
    return this.http.post<void>(`${this.api}/routes/admin/${routeId}/reject`, {comment});
  }

  deleteRoute(routeId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/routes/${routeId}`);
  }
}
