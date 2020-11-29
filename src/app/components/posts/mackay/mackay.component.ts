import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet-gpx';
import 'src/assets/leaflet-elevation.js';
import 'src/assets/leaflet-ui.js';

@Component({
  selector: 'app-mackay',
  templateUrl: './mackay.component.html',
  styleUrls: ['./mackay.component.scss']
})
export class MackayComponent implements OnInit {
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
    detached: false,
    // if (detached), the elevation chart container
    elevationDiv: "#elevation-div",
    // if (!detached) autohide chart profile on chart mouseleave
    autohide: false,
    // if (!detached) initial state of chart profile control
    collapsed: false,
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

  };

  constructor() { }

  ngOnInit(){
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {

    var opts = {
			map: {
				center: [39.73, -104.99],
				zoom: 5,
				mapTypeId: 'topoEspaña',
				// fullscreenControl: false,
				// searchControl: false,
				// loadingControl: false,
				plugins: [
					"https://unpkg.com/d3@4.13.0/build/d3.min.js",
					"https://unpkg.com/leaflet-gpx@1.5.0/gpx.js",
					"https://unpkg.com/leaflet-geometryutil@0.9.1/src/leaflet.geometryutil.js",
					//"https://unpkg.com/@raruto/leaflet-elevation@1.5.0/dist/leaflet-elevation.min.css",
					//"https://unpkg.com/@raruto/leaflet-elevation@1.5.0/dist/leaflet-elevation.min.js",
					"https://unpkg.com/@raruto/leaflet-elevation@1.5.0/libs/leaflet-gpxgroup.min.js",
					"https://unpkg.com/@raruto/leaflet-elevation@1.5.0/libs/leaflet-distance-marker.min.css",
					"https://unpkg.com/@raruto/leaflet-elevation@1.5.0/libs/leaflet-distance-marker.min.js",
				],
			},
			points: {
				icon: {
					iconUrl: 'https://unpkg.com/@raruto/leaflet-elevation@1.3.5/images/elevation-poi.png',
					iconSize: [12, 12],
				},
			},
			// elevation: {
			// 	theme: "yellow-theme",
			// 	detachedView: false,
			// 	elevationDiv: '#elevation-div',
			// 	followPositionMarker: true,
			// 	zFollow: 15,
      //   legend: false,
			// },
		};

		var tracks = [
      "../../../../assets/Ruta 1 longitud 18 km.gpx",
      "../../../../assets/Ruta 2 longitud 6,3 km.gpx",
      "../../../../assets/Ruta 3 longitud 15  km.gpx",
      "../../../../assets/Ruta 4 longitud 18,6 km.gpx",
      "../../../../assets/Ruta 5 longitud 12,6 km.gpx",
      "../../../../assets/Ruta 6 longitud 26,6 Km.gpx",
      "../../../../assets/Ruta 7 longitud 15,9 km.gpx",
      "../../../../assets/Ruta 8 longitud 19 km.gpx",
      "../../../../assets/Ruta 9 longitud 22,4 km.gpx",
      "../../../../assets/Ruta 10 longitud 8 km.gpx",
      "../../../../assets/Ruta 11 longitud 18,2 km.gpx",
      "../../../../assets/Ruta 12 longitud 14,3 km.gpx",
      "../../../../assets/Ruta 13 longitud 12,5 km.gpx",
      "../../../../assets/Ruta 14 longitud 13 km.gpx",
      "../../../../assets/Ruta 15 longitud 14 km.gpx",
      "../../../../assets/Ruta 16 longitud 26 km.gpx",
      "../../../../assets/Ruta 17 longitud 14,8 km.gpx",
      "../../../../assets/Ruta 18 1 CF Hornico a CF La Bolera 2,1 km.gpx",
		];

		var points = [
			{latlng:[47.5854438, 18.8260240], name:"Éles-kő"},
			{latlng:[47.5838863, 18.8235221], name:"Ilona-lak"},
			{latlng:[47.5689002, 18.8909285], name:"Bronz-barlang"},
			{latlng:[47.5574055, 18.8954788], name:"Karády-lak"},
			{latlng:[47.5860042, 18.8590258], name:"Kereszt a Kutya-hegyi kőfejtőnél"},
			{latlng:[47.5946092, 18.8383717], name:"Kutya-hegyi zsomboly"},
			{latlng:[47.5852204, 18.8420916], name:"vaditató"},
			{latlng:[47.5675421, 18.8644739], name:"mészégető"},
			{latlng:[47.5568284, 18.8683407], name:"festékégető"},
			{latlng:[47.5627022, 18.8804863], name:"festékégető"},
			{latlng:[47.5825126, 18.8512647], name:"kőfejtő"},
			{latlng:[47.5966170, 18.8405121], name:"barlang"},
			{latlng:[47.5692769, 18.9233352], name:"vaslelőhely"},
			{latlng:[47.5609284, 18.9319601], name:"Hét-lyuk zsomboly"},
			{latlng:[47.5532424, 18.8973270], name:"festékégető"},
			{latlng:[47.5372269, 18.8914775], name:"katonasírok"},
			{latlng:[47.5934486, 18.8812427], name:"Fülkés-kő"},
		];

		var map = L.map('map', opts.map);
		var routes;

		map.on('plugins_loaded', function(e) {

			routes = L.gpxGroup(tracks, {
				//points: points,
				//points_options: opts.points,
				//elevation: false,
				//elevation_options: this.elevation_options,
				legend: true,
        distanceMarkers: false,
          marker_options: {
             startIconUrl: '../../../../assets/pin-icon-start.png',
             endIconUrl: '../../../../assets/pin-icon-end.png',
             shadowUrl: '../../../../assets/pin-shadow.png',
             wptIconUrls: {
              '': '../../../../assets/elevation-pushpin.png',
            },
          },
			});

			map.on('eledata_added eledata_clear', function(e) {
				// var p = document.getElementById(".chart-placeholder");
				// if(p) {
				// 	p.style.display = e.type=='eledata_added' ? 'none' : '';
				// }
			});

			routes.addTo(map);

			map.attributionControl.addAttribution('Map Data: &copy; <a href="https://github.com/adoroszlai">Attila Doroszlai</a> (<a href="https://github.com/adoroszlai/joebed/blob/gh-pages/LICENSE.md">MIT License</a>)');

		});

}
}