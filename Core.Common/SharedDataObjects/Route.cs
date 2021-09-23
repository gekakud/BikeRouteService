using Core.Common.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Common.SharedDataObjects
{
    public class Route: IIdentifiable
    {
        public Guid Id { get; set; }
        
        public string RouteName { get; set; }

        public string RouteDescription { get; set; }
        
        public double RouteLength { get; set; }

        public RouteType RouteType { get; set; }

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

        public double Altitude { get; set; }
    }

    public enum FileExtension
    {
        NotSupported,
        Gpx,
        GeoJson,
        Kml
    }

    public enum RouteType
    {
        Mtb,
        Gravel,
        Road,
        Mixed
    }

    public enum RouteDifficulty
    {
        Beginner,
        Intermediate,
        Proficient,
        Beast
    }
}