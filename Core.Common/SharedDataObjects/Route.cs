using Core.Common.Interfaces;
using System;

namespace Core.Common.SharedDataObjects
{
    public class Route: IIdentifiable
    {
        public Guid Id { get; set; }

        public string RouteName { get; set; }

        public float RouteLength { get; set; }

        public int RouteDifficulty { get; set; }

        //.gpx, .geojson, .etc.
        public string OrigFileExtension { get; set; }

        public byte[] OrigFileContent { get; set; }

        public byte[] GeoJsonFileContent { get; set; }

        public double StartLat { get; set; }

        public double StartLng { get; set; }

        public double EndLat { get; set; }

        public double EndLng { get; set; }
    }
    public enum FileExtension{ NotSupported, Gpx, GeoJson, Kml}
}