// ==========================================================================
// Copyright (c) 2011-2016, dlg.krakow.pl
// All Rights Reserved
//
// NOTICE: dlg.krakow.pl permits you to use, modify, and distribute this file
// in accordance with the terms of the license agreement accompanying it.
// ==========================================================================

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Xml;
using Core.Common.Extensions;

namespace Core.Common.GpxUtils
{
    public enum GpxObjectType { None, Attributes, Metadata, WayPoint, Route, Track };

    public sealed class GpxReader
    {
        public GpxPointCollection Track { get; private set; }

        public GpxReader(Stream stream)
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(stream);
            string json = JsonConvert.SerializeXmlNode(doc);
            JObject o = JObject.Parse(json);

            string minLon = (string)o["gpx"]["metadata"]["bounds"]["@minlon"];
            string minLat = (string)o["gpx"]["metadata"]["bounds"]["@minlat"];

            string maxLon = (string)o["gpx"]["metadata"]["bounds"]["@maxlon"];
            string maxLat = (string)o["gpx"]["metadata"]["bounds"]["@maxlat"];

            // TODO: handle multiple segments!
            Track = new GpxPointCollection();
            JToken track_points = o["gpx"]["trk"]["trkseg"]["trkpt"];
            foreach (JToken track_point in track_points)
            {
                GpxPoint p = new GpxPoint();
                p.Latitude = ((string)track_point["@lat"]).ToDouble();
                p.Longitude = ((string)track_point["@lon"]).ToDouble();
                p.Elevation = ((string)track_point["ele"]).ToDouble();
                p.Time = DateTime.Parse((string)track_point["time"], CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal);

                Track.Add(p);
            }
        }

    }
}