using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Core.Common.SharedDataObjects;
using GeoJSON.Net.Feature;
using GeoJSON.Net.Geometry;
using Newtonsoft.Json;

namespace Core.Common.GpxUtils
{
    public static class GpxConverter
    {
        public static void ConvertGpxToGeoJson(Stream gpxFileStream, Route routeToFill)
        {
            using (StreamReader sr = new StreamReader(gpxFileStream))
            {
                GpxReader gpxReader = new GpxReader(sr.BaseStream);
                
                gpxReader.Read();
                var track = gpxReader.Track;
                var trackPoints = gpxReader.Track.ToGpxPoints();
                
                //var route = gpxReader.ObjectType;
                // var routePoints = route.ToGpxPoints();

                List<Position> positions = trackPoints.Select(gpxPoint =>
                    new Position(gpxPoint.Latitude, gpxPoint.Longitude, gpxPoint.Elevation)).ToList();

                routeToFill.RouteLength = (float) track.GetLength();
                
                routeToFill.StartLat = positions.First().Latitude;
                routeToFill.StartLng = positions.First().Longitude;

                routeToFill.EndLat = positions.Last().Latitude;
                routeToFill.EndLng = positions.Last().Longitude;
                
                routeToFill.MinAltitude = (double) positions.Select(p => p.Altitude).Min();
                routeToFill.MaxAltitude = (double) positions.Select(p => p.Altitude).Max();

                routeToFill.ElevationGain = routeToFill.MaxAltitude - routeToFill.MinAltitude;
                
                var gjString = WriteGeoJson(positions);
                routeToFill.GeoJsonFileContent = Encoding.ASCII.GetBytes(gjString);
            }
        }

        public static string GetAllRoutesInfoPointsGeoJson(List<Route> routes)
        {
            var geoFeatures = new List<Feature>();
            foreach (Route route in routes)
            {
                var featureProperties = new Dictionary<string, object>
                {
                    {"RouteName", route.RouteName},
                    {"RouteType", route.RouteType},
                    {"RouteDifficulty", route.RouteDifficulty},
                    {"RouteLength", route.RouteLength},
                    {"ElevationGain", route.ElevationGain}
                };
                geoFeatures.Add(new Feature(new Point(new Position(route.StartLat, route.StartLng)),
                    featureProperties));
            }
            
            var featureCollection = new FeatureCollection(geoFeatures);
            
            var featureCollectionJson = JsonConvert.SerializeObject(featureCollection);
            return featureCollectionJson;
        }
        
        public static string GetRouteGeoJson(Route route)
        {
            var featureProperties = new Dictionary<string, object>
            {
                { "RouteName", route.RouteName },
                { "RouteType", route.RouteType},
                { "RouteDifficulty", route.RouteDifficulty },
                { "RouteLength", route.RouteLength }
            };

            var featureCollectionStr = ReadGeoJsonFromBytes(route.GeoJsonFileContent);
            
            FeatureCollection featureCollection = JsonConvert.DeserializeObject<FeatureCollection>(featureCollectionStr);
            
            return featureCollectionStr;
        }
        
        private static string ReadGeoJsonFromBytes(byte[] gsBytes)
        {
            return Encoding.ASCII.GetString(gsBytes, 0, gsBytes.Length);
        }
        
        private static string WriteGeoJson(List<Position> coordinates)
        {
            var line = new LineString(coordinates);
            
            var lineJson = JsonConvert.SerializeObject(new Feature(line));
            var featureCollection = new FeatureCollection(new List<Feature> {new Feature(line)});

            var featureCollectionJson = JsonConvert.SerializeObject(featureCollection);
            return featureCollectionJson;
        }
    }
}