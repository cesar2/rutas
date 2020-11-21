import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { Observable } from 'rxjs';
import { PostI } from 'src/app/shared/models/post.interface';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet-gpx';
import 'src/assets/leaflet-elevation.js';
//import 'src/assets/leaflet-ui.js';




@Component({
  selector: 'app-details-post',
  templateUrl: './details-post.component.html',
  styleUrls: ['./details-post.component.scss']
})
export class DetailsPostComponent implements OnInit, AfterViewInit{
  public post$: Observable<PostI>;
  private mapList = GV_Background_Map_List();
  private baseMaps = new Map();

  private inge = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
    layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
    format: 'image/jpeg',
    transparent: true,
    version: '1.3.0',//wms version (ver get capabilities)
    attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España"
  });

  constructor(private route: ActivatedRoute, private postSvc: PostService) { }

  ngOnInit(){
    const id = this.route.snapshot.params.id;
    this.post$ = this.postSvc.getOnePost(id);
  }

  ngAfterViewInit(): void {
    this.initBackMaps(this.mapList);
    this.initMap();
  }

  private initBackMaps(mapList):void{
    console.log("initBackMaps");
    for (let i = 0; i < mapList.length; i++) {
      let item = mapList[i];
      let layer = L.tileLayer(item.url, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: item.credit});
      this.baseMaps.set(item.menu_name, layer); 
    }

    this.baseMaps.set("PNOA WMS",this.inge);
  }


  private initMap(): void {

    var elevation_options = {
      // Default chart colors: theme lime-theme, magenta-theme, ...
      theme: "lightblue-theme",
      // Chart container outside/inside map container
      detached: true,
      // if (detached), the elevation chart container
      elevationDiv: "#elevation-div",
      // if (!detached) autohide chart profile on chart mouseleave
      autohide: false,
      // if (!detached) initial state of chart profile control
      collapsed: false,
      // if (!detached) control position on one of map corners
      position: "topright",
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
      time: false,
      // Summary track info style: "line" || "multiline" || false
      summary: 'multiline',
      // Toggle chart ruler filter.
      ruler: true,
      // Toggle chart legend filter.
      legend: true,
    };

    let bMaps = Array.from(this.baseMaps).reduce((obj, [key, value]) => (
      Object.assign(obj, { [key]: value })
    ), {});

    var map = L.map('map', {
        center: [39.73, -104.99],
        zoom: 10,
        layers: []
    });

    // Instantiate elevation control.
    var controlElevation = L.control.elevation(elevation_options).addTo(map);

    
    
    this.post$.subscribe( post => {
      // Load track from url (allowed data types: "*.geojson", "*.gpx")
    controlElevation.load(post.gpxPost);
      new L.GPX(post.gpxPost, {async: true,
        marker_options: {
          wptIconUrls: {
            '': '../../assets/pin-icon-wpt.png',
            'Geocache Found': 'img/gpx/geocache.png',
            'Park': 'img/gpx/tree.png'
          },
          startIconUrl: '../../assets/pin-icon-start.png',
          endIconUrl: '../../assets/pin-icon-end.png',
          shadowUrl: '../../assets/pin-shadow.png'
        }
      }).on('loaded', function(e) {
        document.getElementsByClassName("distance")[0].textContent = (e.target.get_distance()/1000).toFixed(2);
        document.getElementsByClassName("duration")[0].textContent = e.target.get_duration_string_iso(e.target.get_total_time(), false).toString();
        document.getElementsByClassName("elevationGain")[0].textContent = e.target.get_elevation_gain().toString();
        document.getElementsByClassName("elevationLoss")[0].textContent = e.target.get_elevation_loss().toString();
        document.getElementsByClassName("elevationMax")[0].textContent = e.target.get_elevation_max().toString();
        document.getElementsByClassName("elevationMin")[0].textContent = e.target.get_elevation_min().toString();
        map.fitBounds(e.target.getBounds());
      }).addTo(map);
    });
    
    L.control.layers(bMaps).addTo(map);
    L.control.zoom();
  }

  
  downloadFile(){
    this.post$.subscribe( post => {
      window.open(post.gpxPost);
    });
  }

}

function GV_Background_Map_List() {
	return [
     { id: 'MAPBOX', menu_name:'Mapbox', credit:'mapbox', url:'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'}
		,{ id:'OPENSTREETMAP',  menu_name:'OSM (OpenStreetMap.org)', description:'OpenStreetMap.org', credit:'Map data from <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap.org</a>', error_message:'OpenStreetMap tiles unavailable', min_zoom:0, max_zoom:19, url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' }
		,{ id:'OPENSTREETMAP_RELIEF', menu_name:'OSM + relief shading', description:'OSM data overlaid with relief shading tiles from ESRI/ArcGIS', credit:'Map data from <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap.org</a>, relief from <a target="_blank" href="//services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS or OSM tiles unavailable', min_zoom:1, max_zoom:19, background:'OPENSTREETMAP', foreground:'ARCGIS_HILLSHADING', foreground_opacity:0.25 }
		,{ id:'OPENSTREETMAP_RELIEF2',  menu_name:'OSM + relief shading', description:'OSM data overlaid with relief shading tiles from ESRI/ArcGIS', credit:'Map data from <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap.org</a>, relief from <a target="_blank" href="http://korona.geog.uni-heidelberg.de/contact.html">OpenMapSurfer</a>', error_message:'OMS or OSM tiles unavailable', min_zoom:1, max_zoom:16, url:'https://korona.geog.uni-heidelberg.de/tiles/asterh/tms_hs.ashx?x={x}&y={y}&z={z}', background:'GV_OSM', opacity:0.25 }
		,{ id:'TF_NEIGHBOURHOOD',  menu_name:'OSM (TF neighbourhood)', description:'OSM "neighborhood" maps from Thunderforest.com', credit:'Maps &copy;<a target="_blank" href="https://www.thunderforest.com/">ThunderForest</a>, Data &copy;<a target="_blank" href="https://openstreetmap.org/copyright">OSM</a> contributors', error_message:'ThunderForest tiles unavailable', min_zoom:1, max_zoom:20, url:'https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}{r}.png?apikey=721a79d25d9040cfbc04bfc07fa43806', api_key:'?apikey={thunderforest}', visible_without_key:true }
		,{ id:'TF_TRANSPORT',  menu_name:'OSM (TF transit)', description:'OSM-based transport data from Thunderforest.com', credit:'OSM data from <a target="_blank" href="https://www.thunderforest.com/">Thunderforest.com</a>', error_message:'Thunderforest tiles unavailable', min_zoom:1, max_zoom:17, url:'//tile.thunderforest.com/transport/{z}/{x}/{y}{r}.png?apikey=721a79d25d9040cfbc04bfc07fa43806', api_key:'?apikey={thunderforest}', visible_without_key:true }
		,{ id:'TF_LANDSCAPE',  menu_name:'OSM (TF landscape)', description:'OSM "landscape" maps from Thunderforest.com', credit:'Maps &copy;<a target="_blank" href="https://www.thunderforest.com/">ThunderForest</a>, Data &copy;<a target="_blank" href="https://openstreetmap.org/copyright">OSM</a> contributors', error_message:'ThunderForest tiles unavailable', min_zoom:1, max_zoom:20, url:'https://tile.thunderforest.com/landscape/{z}/{x}/{y}{r}.png?apikey=721a79d25d9040cfbc04bfc07fa43806', api_key:'?apikey={thunderforest}', visible_without_key:true }
		,{ id:'TF_OUTDOORS',  menu_name:'OSM (TF outdoors)', description:'OSM "outdoors" maps from Thunderforest.com', credit:'Maps &copy;<a target="_blank" href="https://www.thunderforest.com/">ThunderForest</a>, Data &copy;<a target="_blank" href="https://openstreetmap.org/copyright">OSM</a> contributors', error_message:'ThunderForest tiles unavailable', min_zoom:1, max_zoom:20, url:'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=721a79d25d9040cfbc04bfc07fa43806', api_key:'?apikey={thunderforest}', visible_without_key:true }
		,{ id:'OPENTOPOMAP',  menu_name:'OpenTopoMap', description:'OpenTopoMap.org', credit:'Map data from <a target="_blank" href="http://www.opentopomap.org/">OpenTopoMap.org</a>', error_message:'OpenTopoMap tiles unavailable', min_zoom:1, max_zoom:17, url:'https://opentopomap.org/{z}/{x}/{y}.png' }
		,{ id:'KOMOOT_OSM',  menu_name:'OSM topo (Komoot.de)', description:'OpenStreetMap tiles from Komoot.de', credit:'OSM tiles from <a target="_blank" href="http://www.komoot.de/">Komoot</a>', error_message:'Komoot OSM tiles unavailable', min_zoom:1, max_zoom:18, url:'https://{s}.tile.hosted.thunderforest.com/komoot/{z}/{x}/{y}{r}.png' }
		,{ id:'FOURUMAPS_TOPO',  menu_name:'OSM topo (4UMaps)', description:'OSM-based topo maps from 4UMaps.eu', credit:'Map data from <a target="_blank" href="http://www.openstreetmap.org/">OpenStreetMap</a> &amp; <a target="_blank" href="http://www.4umaps.eu/">4UMaps.eu</a>', error_message:'4UMaps tiles unavailable', min_zoom:1, max_zoom:15, url:'https://tileserver.4umaps.com/{z}/{x}/{y}.png' }
		,{ id:'OPENCYCLEMAP',  menu_name:'OpenCycleMap', description:'OpenCycleMap.org via ThunderForest.com', credit:'Maps &copy;<a target="_blank" href="https://www.thunderforest.com/">ThunderForest</a>, Data &copy;<a target="_blank" href="https://openstreetmap.org/copyright">OSM</a> contributors', error_message:'OpenCycleMap tiles unavailable', min_zoom:1, max_zoom:17, url:'//tile.thunderforest.com/cycle/{z}/{x}/{y}{r}.png?apikey=721a79d25d9040cfbc04bfc07fa43806', api_key:'?apikey={thunderforest}', visible_without_key:true }
		,{ id:'OPENSEAMAP',  menu_name:'OpenSeaMap', description:'OpenSeaMap.org', credit:'Map data from <a target="_blank" href="http://www.openseamap.org/">OpenSeaMap.org</a>', error_message:'OpenSeaMap tiles unavailable', min_zoom:1, max_zoom:17, url:['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png','http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'] }
		,{ id:'ARCGIS_STREET',  menu_name:'ArcGIS street map', description:'Global street map tiles from ESRI/ArcGIS', credit:'Street maps from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:19, url:'//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.jpg' }
		,{ id:'ARCGIS_HYBRID',  menu_name:'ArcGIS hybrid', description:'Aerial imagery and labels from ESRI/ArcGIS', credit:'Imagery and map data from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:18, url:['//services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}.png','//services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}.png'],background:'ARCGIS_AERIAL' }
		,{ id:'ARCGIS_AERIAL',  menu_name:'ArcGIS aerial', description:'Aerial imagery tiles from ESRI/ArcGIS', credit:'Aerial imagery from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:19, url:'//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg' }
		,{ id:'ARCGIS_AERIAL2',  menu_name:'ArcGIS aerial ("Clarity")', description:'Clarity Aerial imagery tiles from ESRI/ArcGIS', credit:'Aerial imagery from <a target="_blank" href="http://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:19, url:'//clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg' }
		,{ id:'ARCGIS_RELIEF',  menu_name:'ArcGIS relief/topo', description:'Global relief tiles from ArcGIS', credit:'Relief maps from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:19, url:'//services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg' }
		,{ id:'ARCGIS_OCEANS',  menu_name:'ArcGIS oceans', description:'Sea floor relief and labels from ESRI/ArcGIS', credit:'Map data from <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:0, max_zoom:16, url:['//services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}.jpg','//services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}.png'] }
		,{ id:'ARCGIS_TERRAIN',  menu_name:'ArcGIS terrain', description:'Terrain/relief and labels from ESRI/ArcGIS', credit:'Map data from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:13, url:['//server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.jpg','//server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.png'] }
		,{ id:'ARCGIS_HILLSHADING', menu_name:'ArcGIS hillshading', description:'Global relief shading tiles from ESRI/ArcGIS', credit:'Relief shading from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:13, url:'//server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.jpg' }
		,{ id:'ARCGIS_HILLSHADING_US',  menu_name:'ArcGIS hillshading', description:'Global relief shading tiles from ESRI/ArcGIS', credit:'Relief shading from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer">ESRI/ArcGIS</a>', error_message:'ArcGIS tiles unavailable', min_zoom:1, max_zoom:16, url:'//server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.jpg' }
		,{ id:'OPENMAPSURFER_RELIEF',  menu_name:'OMS hillshading', description:'Global relief shading tiles from ESRI/ArcGIS', credit:'Relief shading from <a target="_blank" href="http://korona.geog.uni-heidelberg.de/contact.html">OpenMapSurfer</a>', error_message:'OpenMapSurfer tiles unavailable', min_zoom:1, max_zoom:16, url:'https://korona.geog.uni-heidelberg.de/tiles/asterh/tms_hs.ashx?x={x}&y={y}&z={z}' }
		,{ id:'NATIONALGEOGRAPHIC',  menu_name:'National Geographic', description:'National Geographic atlas', credit:'NGS maps from <a target="_blank" href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ESRI/ArcGIS</a>', error_message:'National Geographic tiles unavailable', min_zoom:1, max_zoom:16, url:'//services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.jpg' }
		,{ id:'STRAVA_HEATMAP_HYBRID',  menu_name:'Strava track heat map', description:'Strava GPS tracks with hybrid background', credit:'GPS track heat maps from <a target="_blank" href="http://www.strava.com/">Strava</a>', error_message:'Strava data unavailable', min_zoom:2, max_zoom:12, url:'https://heatmap-external-a.strava.com/tiles/all/hot/{z}/{x}/{y}.png?px=256', opacity:0.90, background:'GV_HYBRID' }
		,{ id:'STRAVA_HEATMAP_HYBRID_AUTH',  menu_name:'Strava auth.+hybrid', description:'Strava GPS tracks (authenticated) with hybrid background', credit:'GPS track heat maps from <a target="_blank" href="http://www.strava.com/">Strava</a>', error_message:'Strava data unavailable', min_zoom:2, max_zoom:16, url:'https://heatmap-external-a.strava.com/tiles-auth/all/hot/{z}/{x}/{y}.png?px=256', opacity:0.90, background:'GV_HYBRID' }
		,{ id:'STRAVA_HEATMAP_OSM_AUTH',  menu_name:'Strava auth.+OSM', description:'Strava GPS tracks (authenticated) with OSM background', credit:'GPS track heat maps from <a target="_blank" href="http://www.strava.com/">Strava</a>', error_message:'Strava data unavailable', min_zoom:2, max_zoom:16, url:'https://heatmap-external-a.strava.com/tiles-auth/all/hot/{z}/{x}/{y}.png?px=256', opacity:0.90, background:'GV_OSM_RELIEF' }
		,{ id:'STRAVA_HEATMAP_AUTH',  menu_name:'Strava authenticated', description:'Strava GPS tracks (authenticated)', credit:'GPS track heat maps from <a target="_blank" href="http://www.strava.com/">Strava</a>', error_message:'Strava data unavailable', min_zoom:2, max_zoom:16, url:'https://heatmap-external-a.strava.com/tiles-auth/all/hot/{z}/{x}/{y}.png?px=256', opacity:1 }
		,{ id:'BLUEMARBLE', menu_name:'Blue Marble', description:'NASA "Visible Earth" image', credit:'Map by DEMIS', error_message:'DEMIS server unavailable', min_zoom:3, max_zoom:8, tile_size:256, url:'http://www2.demis.nl/wms/wms.asp?service=WMS&wms=BlueMarble&wmtver=1.0.0&request=GetMap&srs=EPSG:4326&format=jpeg&transparent=false&exceptions=inimage&wrapdateline=true&layers=Earth+Image,Borders' }
		,{ id:'STAMEN_TOPOSM3',  menu_name:'TopOSM (3 layers)', description:'OSM data with relief shading and contours', credit:'Map tiles by <a target="_blank" href="http://maps.stamen.com/">Stamen</a> under <a target="_blank" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_blank" href="https://openstreetmap.org">OSM</a> under <a target="_blank" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA</a>.', error_message:'stamen.com tiles unavailable', min_zoom:1, max_zoom:15, url:['http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg','http://tile.stamen.com/toposm-contours/{z}/{x}/{y}.png','http://tile.stamen.com/toposm-features/{z}/{x}/{y}.png'],opacity:[1,0.75,1] }
		,{ id:'STAMEN_OSM_TRANSPARENT',  menu_name:'Transparent OSM', description:'OSM data with transparent background', credit:'Map tiles by <a href="https://openstreetmap.org">OSM</a> under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA</a>', error_message:'OSM tiles unavailable', min_zoom:1, max_zoom:15, url:'http://tile.stamen.com/toposm-features/{z}/{x}/{y}.png' }
		,{ id:'SKAMANIA_GIS',menu_name:'us-WA: Skamania County GIS', max_zoom:19, url:['http://www.mapsifter.com/MapDotNetUX9.3/REST/9.0/Map/SkamaniaWA/Image/Qkey/{quadkey}/256,256/png8?BleedRatio=1.125&MapBackgroundColor=00000000&MapCacheOption=ReadWrite'], copyright:'Skamania County tiles from MapSifter', tile_function:'function(xy,z){ quad=TileToQuadKey(xy.x,xy.y,z); return "http://www.mapsifter.com/MapDotNetUX9.3/REST/9.0/Map/SkamaniaWA/Image/Qkey/"+quad+"/256,256/png8";}',background:'GV_AERIAL' }
		,{ id:'ES_IGN_BASE',  menu_name:'es: IGN base map', description:'Spanish base map from IGN.es', credit:'Map tiles from <a target="_blank" href="http://www.ign.es/">IGN.es</a>', error_message:'IGN.es base map unavailable', min_zoom:6, max_zoom:20, country:'es', bounds:[-18.4,27.5,4.6,44.0], url:'http://www.ign.es/wmts/ign-base?service=WMTS&request=GetTile&version=1.0.0&format=image/jpeg&layer=IGNBaseTodo&tilematrixset=GoogleMapsCompatible&style=default&tilematrix={z}&tilerow={y}&tilecol={x}' }
		,{ id:'ES_IGN_TOPO', menu_name:'es: Topo (IGN)', description:'Spanish topo maps from IGN.es', credit:'Topo maps from <a target="_blank" href="http://www.ign.es/">IGN.es</a>', error_message:'IGN.es topo tiles unavailable', min_zoom:6, max_zoom:17, country:'es', bounds:[-18.4,27.5,4.6,44.0], url:'http://www.ign.es/wmts/mapa-raster?service=WMTS&request=GetTile&version=1.0.0&format=image/jpeg&layer=MTN&tilematrixset=GoogleMapsCompatible&style=default&tilematrix={z}&tilerow={y}&tilecol={x}' }
		,{ id:'GOOGLE_ROADMAP',  menu_name:'Google map', description:'Google street map', credit:'Map tiles from Google', error_message:'Google tiles unavailable', min_zoom:1, max_zoom:21, url:'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' }
		,{ id:'GOOGLE_HYBRID',  menu_name:'Google hybrid', description:'Google aerial imagery with labels', credit:'Map tiles from Google', error_message:'Google tiles unavailable', min_zoom:1, max_zoom:21, url:'http://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' }
		,{ id:'GOOGLE_SATELLITE',  menu_name:'Google aerial', description:'Google aerial/satellite imagery', credit:'Map tiles from Google', error_message:'Google tiles unavailable', min_zoom:1, max_zoom:21, url:'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' }
    ,{ id:'GOOGLE_TERRAIN', menu_name:'Google terrain', description:'Google terrain map', credit:'Map tiles from Google', error_message:'Google tiles unavailable', min_zoom:1, max_zoom:21, url:'http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}' }
    ,{ id:'Ulti3', menu_name:'Google ulti 3', url:"https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=5FcfHYiC0ylTqSygWEcu"}
    ,{ id:'Ulti4', menu_name:'Google ulti 4', url: "https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=5FcfHYiC0ylTqSygWEcu"}
	];
}