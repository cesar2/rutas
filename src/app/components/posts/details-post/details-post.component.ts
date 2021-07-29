import { Component, OnInit , ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { Observable } from 'rxjs';
import { PostI } from 'src/app/shared/models/post.interface';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet-gpx';
import 'src/assets/leaflet-elevation.js';
import 'src/assets/leaflet-ui.js';
import { ElementRef } from '@angular/core';




@Component({
  selector: 'app-details-post',
  templateUrl: './details-post.component.html',
  styleUrls: ['./details-post.component.scss']
})
export class DetailsPostComponent implements OnInit, AfterViewInit{
  public post$: Observable<PostI>;
  public layer: any;
  public controlElevation:any;
  public map:any;
  public mapMinZoom = 9;
  public mapMaxZoom = 14;


  public layeroptions = {
    minZoom: this.mapMinZoom,
    maxZoom: this.mapMaxZoom,
    opacity: 1.0,
    attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
    tms: false
  };

  public elevation_options = {
    // Default chart colors: theme lime-theme, magenta-theme, ...
    theme: "magenta-theme",
    // Chart container outside/inside map container
    detached: true,
    // if (detached), the elevation chart container
    elevationDiv: "#elevation-div",
    // if (!detached) autohide chart profile on chart mouseleave
    autohide: false,
    // if (!detached) initial state of chart profile control
    collapsed: true,
    // if (!detached) control position on one of map corners
    position: "bottomleft",
    // Autoupdate map center on chart mouseover.
    followMarker: true,
    // Chart distance/elevation units.
    imperial: false,
    // [Lat, Long] vs [Long, Lat] points. (leaflet default: [Lat, Long])
    reverseCoords: false,
    // Acceleration chart profile: true || "summary" || "disabled" || false
    acceleration: false,
    // Slope chart profile: true || "summary" || "disabled" || false
    slope: false,
    // speed chart profile: true || "summary" || "disabled" || false
    speed: false,
    // Time stamp labels.
    time: true,
    // Summary track info style: "line" || "multiline" || false
    summary: 'inline',
    // Toggle chart ruler filter.
    ruler: true,
    // Toggle chart legend filter.
    legend: true,
    gpxOptions: {
      marker_options: {
         startIconUrl: '../../../../assets/pin-icon-start.png',
         endIconUrl: '../../../../assets/pin-icon-end.png',
         shadowUrl: '../../../../assets/pin-shadow.png'
      }
    },

  };



  @ViewChild('inputRange') slider: ElementRef;

  constructor(private route: ActivatedRoute, private postSvc: PostService) { }

  ngOnInit(){
    const id = this.route.snapshot.params.id;
    this.post$ = this.postSvc.getOnePost(id); 
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {

    var map = L.map('map', {
        center: [39.73, -104.99],
        zoom: 10,
				resizerControl: true,
        layers: []
    });

    // Elevation
    this.controlElevation = L.control.elevation(this.elevation_options).addTo(map);
    console.log(this.controlElevation.track_info);
    this.post$.subscribe( post => {
      var gpx = new L.GPX(post.gpxPost, {async: true});

      gpx.on("addline", function(e) {
  
        // leaflet-gpx.js
        console.log("Elevation gain " + gpx.get_elevation_gain());
        console.log("Elevation loss " + gpx.get_elevation_loss());
        console.log("Elevation distancia " + gpx.get_distance());
        console.log("Elevation min el" + gpx.get_elevation_min());
        console.log("Elevation max el " + gpx.get_elevation_max());
    });
    

      // leaflet-elevation.js
      console.log(this.controlElevation.track_info);
    });


    // Add imagen
    this.post$.subscribe( post => {
      if(post.titlePost.includes("CZ"))
      {
        this.layer = L.tileLayer('https://rutas.fra1.digitaloceanspaces.com/Cazorla/{z}/{x}/{y}.png', this.layeroptions).addTo(map);
      }
      else if(post.titlePost.includes("SG"))
      {
        this.layer = L.tileLayer('https://rutas.fra1.digitaloceanspaces.com/Segura/{z}/{x}/{y}.png', this.layeroptions).addTo(map);
      }
      else
      {
        this.slider.nativeElement.style.visibility = "hidden";
      }
      this.controlElevation.load(post.gpxPost);

    });

    L.control.zoom();
  }

  setOpacity(value){
    this.layer.setOpacity(value);

    console.log(this.layeroptions);

    this.post$.subscribe( post => {
      if(post.titlePost.includes("CZ"))
      {
        this.layer = L.tileLayer('https://rutas.fra1.digitaloceanspaces.com/Cazorla/{z}/{x}/{y}.png', this.layeroptions).addTo(this.map);
      }
      else if(post.titlePost.includes("SG"))
      {
        this.layer = L.tileLayer('https://rutas.fra1.digitaloceanspaces.com/Segura/{z}/{x}/{y}.png', this.layeroptions).addTo(this.map);
      }
      else
      {
        this.slider.nativeElement.style.visibility = "hidden";
      }
      this.controlElevation.load(post.gpxPost);

    });
  }
 
}

