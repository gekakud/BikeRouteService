using Core.Common.Interfaces;
using System;

namespace Core.Common.SharedDataObjects
{
    public class Route: IIdentifiable
    {
        public Guid Id { get; set; }

        public string RouteName { get; set; }

        public double RouteLength { get; set; }

        public RouteDifficulty RouteDifficulty { get; set; }

        //.gpx, .geojson, .etc.
        public string OrigFileExtension { get; set; }

        public byte[] OrigFileContent { get; set; }

        public byte[] GeoJsonFileContent { get; set; }

        public double StartLat { get; set; }

        public double StartLng { get; set; }

        public double EndLat { get; set; }

        public double EndLng { get; set; }

        public double MinAltitude { get; set; }
        
        public double MaxAltitude { get; set; }
    }
    public enum FileExtension{ NotSupported, Gpx, GeoJson, Kml}
    
    public enum RouteDifficulty{ Beginner, Intermediate , Proficient , Beast}
}