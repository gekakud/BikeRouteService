using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Core.Common.SharedDataObjects;
using GeoJSON.Net;
using GeoJSON.Net.Feature;
using GeoJSON.Net.Geometry;
using Geolocation;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SharpKml.Engine;

namespace Core.Common.GpxUtils
{
    public static class GeoConverter
    {
        public static void ConvertGpxToGeoJson(Stream gpxFileStream, Route routeToFill)
        {
            if (gpxFileStream.Position > 0)
            {
                gpxFileStream.Position = 0;
            }
            using (StreamReader sr = new StreamReader(gpxFileStream))
            {

                GpxReader gpxReader = new GpxReader(sr.BaseStream);
                
                var track = gpxReader.Track;
                var trackPoints = gpxReader.Track.ToGpxPoints();
                

                List<Position> positions = trackPoints.Select(gpxPoint =>
                    new Position(gpxPoint.Latitude, gpxPoint.Longitude, gpxPoint.Elevation)).ToList();

                routeToFill.RouteLength = (float) track.GetLength();
                
                routeToFill.StartLat = positions.First().Latitude;
                routeToFill.StartLng = positions.First().Longitude;

                routeToFill.EndLat = positions.Last().Latitude;
                routeToFill.EndLng = positions.Last().Longitude;
                
                routeToFill.MinAltitude = (double)positions.Select(p => p.Altitude ?? 0).Min();
                routeToFill.MaxAltitude = (double) positions.Select(p => p.Altitude ?? 0).Max();

                string gjString = CreateGeoJsonStringForGpxRoute(positions, routeToFill);
                routeToFill.GeoJsonFileContent = Encoding.ASCII.GetBytes(gjString);
            }
        }

        public static void MapGeoJsonToRoute(Route routeToFill)
        {
            string rawGeoJsonString = ConvertBytesToAsciiString(routeToFill.OrigFileContent);
            FeatureCollection featureCollectionObject =
                JsonConvert.DeserializeObject<FeatureCollection>(rawGeoJsonString);

            IGeometryObject geometryObject = featureCollectionObject.Features
                .Find(feature => feature.Geometry.Type == GeoJSONObjectType.LineString).Geometry;

            if(geometryObject == null)
            {
                throw new Exception("GeoJson must contain LineString geometry. Currently only LineString is supported.");
            }

            LineString line = (LineString)geometryObject;

            routeToFill.ElevationGain = GetElevationForLineString(line);
            routeToFill.RouteLength = GetLengthForLineString(line) / 1000;

            routeToFill.StartLat = line.Coordinates.First().Latitude;
            routeToFill.StartLng = line.Coordinates.First().Longitude;

            routeToFill.EndLat = line.Coordinates.Last().Latitude;
            routeToFill.EndLng = line.Coordinates.Last().Longitude;

            routeToFill.MinAltitude = (double)line.Coordinates.Select(c => c.Altitude ?? 0).Min();
            routeToFill.MaxAltitude = (double)line.Coordinates.Select(c => c.Altitude ?? 0).Max();

            routeToFill.GeoJsonFileContent = routeToFill.OrigFileContent;
        }

        public static void MapKmlToRoute(Route routeToFill)
        {
            string kmlXmlString = ConvertBytesToAsciiString(routeToFill.OrigFileContent);

            //SharpKml.Base.Parser parser = new SharpKml.Base.Parser();

            //parser.ParseString(kmlXmlString, false);

            //routeToFill.RouteLength = (float)track.GetLength();

            //routeToFill.StartLat = positions.First().Latitude;
            //routeToFill.StartLng = positions.First().Longitude;

            //routeToFill.EndLat = positions.Last().Latitude;
            //routeToFill.EndLng = positions.Last().Longitude;

            //routeToFill.MinAltitude = (double)positions.Select(p => p.Altitude).Min();
            //routeToFill.MaxAltitude = (double)positions.Select(p => p.Altitude).Max();

            //string gjString = CreateGeoJsonStringForGpxRoute(positions, routeToFill);
            //routeToFill.GeoJsonFileContent = Encoding.ASCII.GetBytes(gjString);
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
        
        public static string GetRouteObjectFromGeoJsonBytes(Route route)
        {
            string featureCollectionStr = ConvertBytesToAsciiString(route.GeoJsonFileContent);
            return featureCollectionStr;
        }

        public static double CalculateElevationGainFromRouteGeoJson(Route route)
        {
            string featureCollectionStr = ConvertBytesToAsciiString(route.GeoJsonFileContent);
            FeatureCollection featureCollectionObject =
                JsonConvert.DeserializeObject<FeatureCollection>(featureCollectionStr);

            IGeometryObject geometryObject = featureCollectionObject.Features.Find(feature => feature.Geometry.Type == GeoJSONObjectType.LineString).Geometry;

            LineString line = (LineString) geometryObject;

            return GetElevationForLineString(line);
        }

        private static double GetLengthForLineString(LineString line)
        {
            Coordinate origin;
            Coordinate destination;

            if(line.Coordinates.Count == 1)
            {
                return 0;
            }
            if (line.Coordinates.Count == 2)
            {
                origin = new Coordinate(line.Coordinates[0].Latitude, line.Coordinates[0].Longitude);
                destination = new Coordinate(line.Coordinates[1].Latitude, line.Coordinates[1].Longitude);
                return GeoCalculator.GetDistance(origin, destination, distanceUnit:DistanceUnit.Kilometers);
            }

            double length = 0;
            for (int i = 1; i < line.Coordinates.Count; i++)
            {
                origin = new Coordinate(line.Coordinates[i-1].Latitude, line.Coordinates[i-1].Longitude);
                destination = new Coordinate(line.Coordinates[i].Latitude, line.Coordinates[i].Longitude);
                length += GeoCalculator.GetDistance(origin, destination, decimalPlaces: 1, distanceUnit: DistanceUnit.Meters);
            }

            return length;
        }

        private static double GetElevationForLineString(LineString line)
        {
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

        private static string ConvertBytesToAsciiString(byte[] bytesArray)
        {
            return Encoding.ASCII.GetString(bytesArray, 0, bytesArray.Length);
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