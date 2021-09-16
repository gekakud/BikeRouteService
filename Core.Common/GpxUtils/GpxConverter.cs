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
                
                var yobtaStr = WriteGeoJson(positions);
                routeToFill.GeoJsonFileContent = Encoding.ASCII.GetBytes(yobtaStr);
            }
        }
        
        private static string WriteGeoJson(List<Position> coordinates)
        {
            var geometry = new LineString(coordinates);
            
            var lineJson = JsonConvert.SerializeObject(new Feature(geometry));
            var featureCollection = new FeatureCollection(new List<Feature> {new Feature(geometry)});

            var featureCollectionJson = JsonConvert.SerializeObject(featureCollection);
            return featureCollectionJson;
        }
    }
}