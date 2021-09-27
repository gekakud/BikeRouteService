using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Core.Common.SharedDataObjects;
using GeoJSON.Net;
using GeoJSON.Net.Converters;
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

                string gjString = CreateGeoJsonStringForGpxRoute(positions, routeToFill);
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
            string featureCollectionStr = ReadGeoJsonFromBytes(route.GeoJsonFileContent);
            return featureCollectionStr;
        }

        public static double CalculateElevationGainFromRouteGeoJson(Route route)
        {
            string featureCollectionStr = ReadGeoJsonFromBytes(route.GeoJsonFileContent);
            FeatureCollection featureCollectionObject =
                JsonConvert.DeserializeObject<FeatureCollection>(featureCollectionStr);

            IGeometryObject geometryObject = featureCollectionObject.Features.Find(feature => feature.Geometry.Type == GeoJSONObjectType.LineString).Geometry;

            LineString line = (LineString) geometryObject;

            if (line.Coordinates.Count <= 2)
            {
                return 0;
            }

            double elevation = 0;
            for (int i = 1; i < line.Coordinates.Count; i++)
            {
                if (line.Coordinates[i].Altitude > line.Coordinates[i - 1].Altitude)
                {
                    double gain = line.Coordinates[i].Altitude.Value - line.Coordinates[i - 1].Altitude.Value;
                    elevation += gain;
                }
            }
            
            return elevation;
        }
        
        private static string ReadGeoJsonFromBytes(byte[] gsBytes)
        {
            return Encoding.ASCII.GetString(gsBytes, 0, gsBytes.Length);
        }
        
        private static string CreateGeoJsonStringForGpxRoute(List<Position> coordinates, Route route)
        {
            var properties = new Dictionary<string, object>
            {
                {"RouteName", route.RouteName},
                {"RouteType", route.RouteType},
                {"RouteDifficulty", route.RouteDifficulty},
                {"RouteLength", route.RouteLength},
                {"ElevationGain", route.ElevationGain}
            };
            
            var lineGeometry = new LineString(coordinates);
            
            var listOfFeatures = new List<Feature> {new Feature(lineGeometry, properties)};

            var featureCollection = new FeatureCollection(listOfFeatures);

            var featureCollectionJson = JsonConvert.SerializeObject(featureCollection);
            return featureCollectionJson;
        }
    }
}