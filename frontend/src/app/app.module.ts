// Main route
import { routes } from './app.routes';
// service worker
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// Pipes
import { KeyPipe } from './components/forum/forum.component';
import { DatePipe } from '@angular/common';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Components
import { AppComponent } from './app.component';
import { TrendingComponent } from './components/trending/trending.component';
import { AdsComponent } from './components/ads/ads.component';
import { PostComponent } from './components/forum/post/post.component';
import { PollComponent } from './components/forum/poll/poll.component';
import { QuestionComponent } from './components/forum/question/question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/app/header/header.component';
import { FooterComponent } from './components/app/footer/footer.component';
import { SidebarComponent } from './components/app/sidebar/sidebar.component';
import { MostConnectedComponent } from './components/most-connected/most-connected.component';
import { LoginComponent } from './components/login/login.component';
import { ForumComponent } from './components/forum/forum.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { LogoutComponent } from './components/logout/logout.component';

// Services
import { AdsService } from './services/ads.service';
import { TrendingService } from './services/trending.service';
import { MostConnectedService } from './services/most-connected.service';
import { AuthenticationService } from './services/authentication.service';
import { GlobalService } from './services/global.service';
import { UserdataService } from './services/userdata.service';
import { NotificationService } from './services/notification.service';
// Modules
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GridStackModule } from 'ng2-gridstack';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgxEditorModule } from 'ngx-editor';
import { ClickOutsideModule } from 'ng4-click-outside';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TagInputModule } from 'ngx-chips';
import {
  TranslateModule,
  TranslateLoader
} from './modules/internationalization/internationalization.module';
import { TranslateHttpLoader } from './modules/internationalization/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { SharedService } from './services/shared.service';
import { PostdetailsComponent } from './components/postdetails/postdetails.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ForumComponent,
    LoginComponent,
    MostConnectedComponent,
    TrendingComponent,
    KeyPipe,
    AdsComponent,
    PostComponent,
    PollComponent,
    QuestionComponent,
    SearchInputComponent,
    LogoutComponent,
    PostdetailsComponent
  ],
  imports: [
    BrowserModule,
    OAuthModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: true }),
    ToastrModule.forRoot(),
    HttpClientModule,
    GridStackModule,
    MatListModule,
    MatCardModule,
    FormsModule,
    NgxEditorModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    AngularFontAwesomeModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatInputModule,
    ClickOutsideModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    TagInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],

  providers: [
    GlobalService,
    AuthenticationService,
    AuthGuard,
    MostConnectedService,
    TrendingService,
    AdsService,
    UserdataService,
    NotificationService,
    DatePipe,
    SharedService
  ],
  bootstrap: [AppComponent, SearchInputComponent]
})
export class AppModule {}
