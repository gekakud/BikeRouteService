using Core.Common.Interfaces;
using System;

namespace Core.Common.SharedDataObjects
{
    public class Route: IIdentifiable
    {
        public Guid Id { get; set; }

        //this will bset to True after admin review and approve uploaded route
        public bool VisibleToAll { get; set; }

        public string RouteName { get; set; }

        public string RouteDescription { get; set; }
        
        public string Author { get; set; }
        
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

        public double ElevationGain { get; set; }
    }

    public enum FileExtension
    {
        NotSupported,
        Gpx,
        Kml,
        GeoJson
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