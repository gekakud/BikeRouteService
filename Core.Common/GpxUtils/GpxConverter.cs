using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using GeoJSON.Net.Feature;
using GeoJSON.Net.Geometry;
using Newtonsoft.Json;

namespace Core.Common.GpxUtils
{
    public static class GpxConverter
    {
        public static byte[] ConvertGpxToGeoJson(Stream gpxFileStream)
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
                
                var yobtaStr = WriteGeoJson(positions);
                return Encoding.ASCII.GetBytes(yobtaStr);
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