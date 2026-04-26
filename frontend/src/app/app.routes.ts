import {Routes} from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {EventsPageComponent} from './pages/events/events-page/events-page.component';
import {EventDetailPageComponent} from './pages/events/event-detail-page/event-detail-page.component';
import {CreateEventComponent} from './pages/events/create-event/create-event.component';
import {ManageEventsComponent} from './pages/events/manage-events/manage-events.component';
import {EditEventComponent} from './pages/events/edit-event/edit-event.component';
import {MyEventsComponent} from './pages/events/my-events/my-events.component';
import {AdminComponent} from './pages/admin/admin.component';
import {InfoCenterComponent} from './pages/info-center/info-center.component';
import {authGuard} from './guards/auth.guard';
import {roleGuard} from './guards/role.guard';
import {PrivacyPolicyComponent} from './pages/privacy-policy/privacy-policy.component';
import {RoutesPageComponent} from './pages/routes/routes-page/routes-page.component';
import {RouteDetailPageComponent} from './pages/routes/route-detail-page/route-detail-page.component';
import {CreateRouteComponent} from './pages/routes/create-route/create-route.component';
import {EditRouteComponent} from './pages/routes/edit-route/edit-route.component';
import {ManageRoutesComponent} from './pages/routes/manage-routes/manage-routes.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'info-center', component: InfoCenterComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  // Events
  {path: 'events', component: EventsPageComponent},
  {path: 'events/create', component: CreateEventComponent, canActivate: [roleGuard(['ORGANIZER', 'ADMIN'])]},
  {path: 'events/manage', component: ManageEventsComponent, canActivate: [roleGuard(['ORGANIZER', 'ADMIN'])]},
  {path: 'events/edit/:id', component: EditEventComponent, canActivate: [roleGuard(['ORGANIZER', 'ADMIN'])]},
  {path: 'events/:id', component: EventDetailPageComponent},
  // Routes section
  {path: 'routes', component: RoutesPageComponent},
  {path: 'routes/create', component: CreateRouteComponent, canActivate: [roleGuard(['ORGANIZER', 'ADMIN'])]},
  {path: 'routes/manage', component: ManageRoutesComponent, canActivate: [roleGuard(['ORGANIZER', 'ADMIN'])]},
  {path: 'routes/edit/:id', component: EditRouteComponent, canActivate: [roleGuard(['ORGANIZER', 'ADMIN'])]},
  {path: 'routes/:id', component: RouteDetailPageComponent},
  // User
  {path: 'profile', component: ProfilePageComponent, canActivate: [authGuard]},
  {path: 'my-events', component: MyEventsComponent, canActivate: [authGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [roleGuard(['ADMIN'])]},
  {path: '**', redirectTo: ''}
];
