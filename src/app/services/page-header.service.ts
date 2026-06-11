import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {filter} from 'rxjs/operators';
import { BreadCrumbI } from '../interfaces/breadcrumbI.interface';
// import { BreadCrumb } from '../interfaces/breadcrumbI';

@Injectable({
  providedIn: 'root'
})
export class PageHeaderService {

   // Subject emitting the breadcrumb hierarchy
   private readonly _breadcrumbs$ = new BehaviorSubject<BreadCrumbI[]>([]);
   private readonly  _titlePage$ = new BehaviorSubject<any>({});

   // Observable exposing the breadcrumb hierarchy
   readonly breadcrumbs$ = this._breadcrumbs$.asObservable();
   readonly titlePage$ = this._titlePage$.asObservable();

  constructor(private router: Router) {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe((event) => {
        // Construct the breadcrumb hierarchy
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: BreadCrumbI[] = [];
        this.addBreadcrumb(root, breadcrumbs);
        const titles:any = {};
        this.addTitlePage(root,titles);
        // Emit the new hierarchy
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot | null,
    breadcrumbs: any[]
  ) {
    if (route) {
      // Add an element for the current route part
      if (route.data['breadcrumb']) {
        const breadcrumb = {
          label: this.getLabel(route.data),
        };
        breadcrumbs.push(breadcrumb);
      }
      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, breadcrumbs);
    }
  }

  private addTitlePage(route: ActivatedRouteSnapshot | null,titles:any){
    if(route){
      if(Object.entries(route.data).length>0){
        const titlesData = {
          title:route.data['title'],
          subtitle:route.data['subtitle']
        }
        this._titlePage$.next(titlesData);
      }
      this.addTitlePage(route.firstChild,titles);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function'
      ? data['breadcrumb'](data)
      : data['breadcrumb'];
  }
}
