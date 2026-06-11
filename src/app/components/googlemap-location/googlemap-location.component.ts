import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { UtilsService } from '../../services/utils.service';

declare const google:any;

@Component({
  selector: 'app-googlemap-location',
  templateUrl: './googlemap-location.component.html',
  styleUrls: ['./googlemap-location.component.css']
})
export class GooglemapLocationComponent implements OnInit,AfterViewInit {

  @ViewChild('mapGoogle') mapGoogle!: ElementRef;

  map: any;
  center: any;

  currentPosition: any;

  @Output() cords:EventEmitter<{lat:number,lng:number}> = new EventEmitter<{lat:number,lng:number}>();
  @Output() mapLoaded:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.configMap();
  }
  // !Metodos de todo lo del mapa---------------------------------
  async getLocation() {
    return Promise.race([
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          this.utilsService.currentPosition.next(position);
          resolve(position)
        },
          () => {
            resolve(null);
          })
      }),
      new Promise((resolve,reject)=>{
        setTimeout(()=>{
          resolve(null)
        },3000);
      })
    ])
  }

  centerMap() {
    this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng))
    this.currentPosition = this.center;
    this.cords.emit(this.currentPosition);
  }

  centerInSpecificCords(lat:any, lng:any) {
    this.map.setCenter(new google.maps.LatLng(lat, lng));
  }

  async configMap() {
    let mapOptions: any = {
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    const currentPosition = this.utilsService.currentPosition.value;

    let position = currentPosition || await this.getLocation() as any;

    if (position) {
      mapOptions.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      mapOptions.zoom = 13;
    } else {
      mapOptions.center = {
        lat: 13.7797,
        lng: -89.233
      };
    }
    this.center = mapOptions.center;

    this.map = new google.maps.Map(this.mapGoogle.nativeElement, mapOptions);
    this.changeDetectorRef.detectChanges();

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.mapLoaded.emit(true);
    });

    this.map.addListener('dragstart', this.checkIfInsideZoneCoverage.bind(this))
    this.map.addListener('drag', this.checkIfInsideZoneCoverage.bind(this))
    this.map.addListener('dragend', () => {
      this.checkIfInsideZoneCoverage();
    })

    this.changeDetectorRef.detectChanges();
  }

  checkIfInsideZoneCoverage() {
    const center = this.map.getCenter()
    const point = {
      lat: center.lat(),
      lng: center.lng()
    };

    this.currentPosition = point;
    this.cords.emit(this.currentPosition);
    this.changeDetectorRef.detectChanges();
  }

  configDefaultCords(lat:number,lng:number){
    if(this.map){
      this.currentPosition = {lat,lng};
      this.changeDetectorRef.detectChanges();
      this.centerInSpecificCords(this.currentPosition.lat,this.currentPosition.lng);
    }
  }
}
