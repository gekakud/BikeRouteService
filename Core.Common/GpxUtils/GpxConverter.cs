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

                routeToFill.RouteLength = (float) track.GetLength();
                
                //var route = gpxReader.ObjectType;
                // var routePoints = route.ToGpxPoints();

                List<Position> positions = trackPoints.Select(gpxPoint =>
                    new Position(gpxPoint.Latitude, gpxPoint.Longitude, gpxPoint.Elevation)).ToList();
                
                var yobtaStr = WriteGeoJson(positions);
                routeToFill.GeoJsonFileContent = Encoding.ASCII.GetBytes(yobtaStr);
            }
        }
        
        private static string WriteGeoJson(List<Position> coordinates)
        {
            var geometry = new LineString(coordinates);

            var lineJson = JsonConvert.SerializeObject(new Feature(geometry));
            var featureCollection = new FeatureCollection(new List<Feature> {new Feature(geometry)});
            var yy = JsonConvert.SerializeObject(featureCollection);
            return yy;
        }
    }
}