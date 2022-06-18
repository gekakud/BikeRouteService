// ==========================================================================
// Copyright (c) 2011-2016, dlg.krakow.pl
// All Rights Reserved
//
// NOTICE: dlg.krakow.pl permits you to use, modify, and distribute this file
// in accordance with the terms of the license agreement accompanying it.
// ==========================================================================

using System;
using System.Collections.Generic;
using System.Linq;

namespace Core.Common.GpxUtils
{
    public static class GpxNamespaces
    {
        public const string GPX_NAMESPACE = "http://www.topografix.com/GPX/1/1";
        public const string GARMIN_EXTENSIONS_NAMESPACE = "http://www.garmin.com/xmlschemas/GpxExtensions/v3";
        public const string GARMIN_TRACKPOINT_EXTENSIONS_V1_NAMESPACE = "http://www.garmin.com/xmlschemas/TrackPointExtension/v1";
        public const string GARMIN_TRACKPOINT_EXTENSIONS_V2_NAMESPACE = "http://www.garmin.com/xmlschemas/TrackPointExtension/v2";
        public const string GARMIN_WAYPOINT_EXTENSIONS_NAMESPACE = "http://www.garmin.com/xmlschemas/WaypointExtension/v1";
        public const string DLG_EXTENSIONS_NAMESPACE = "http://dlg.krakow.pl/gpx/extensions/v1";
    }

    public class GpxPoint
    {
        private const double EARTH_RADIUS = 6371; // [km]
        private const double RADIAN = Math.PI / 180;


        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double? Elevation { get; set; }
        public DateTime? Time { get; set; }

        public double GetDistanceFrom(GpxPoint other)
        {
            double thisLatitude = Latitude * RADIAN;
            double otherLatitude = other.Latitude * RADIAN;
            double deltaLongitude = Math.Abs(Longitude - other.Longitude) * RADIAN;

            double cos = Math.Cos(deltaLongitude) * Math.Cos(thisLatitude) * Math.Cos(otherLatitude) +
                Math.Sin(thisLatitude) * Math.Sin(otherLatitude);

            return EARTH_RADIUS * Math.Acos(Math.Max(Math.Min(cos, 1), -1));
        }
    }

    
    public class GpxPointCollection
    {
        private readonly List<GpxPoint> Points_ = new List<GpxPoint>();

        public List<GpxPoint> ToGpxPoints() => Points_;
        public GpxPoint AddPoint(GpxPoint point)
        {
            Points_.Add(point);
            return point;
        }

        public GpxPoint StartPoint
        {
            get { return (Points_.Count == 0) ? null : Points_[0]; }
        }

        public GpxPoint EndPoint
        {
            get { return (Points_.Count == 0) ? null : Points_[Points_.Count - 1]; }
        }

        public double GetLength()
        {
            double result = 0;

            for (int i = 1; i < Points_.Count; i++)
            {
                double dist = Points_[i].GetDistanceFrom(Points_[i - 1]);
                result += dist;
            }

            return result;
        }

        public double? GetMinElevation()
        {
            return Points_.Select(p => p.Elevation).Min();
        }

        public double? GetMaxElevation()
        {
            return Points_.Select(p => p.Elevation).Max();
        }


        public int Count
        {
            get { return Points_.Count; }
        }

        public int IndexOf(GpxPoint item)
        {
            return Points_.IndexOf(item);
        }

        public void Insert(int index, GpxPoint item)
        {
            Points_.Insert(index, item);
        }

        public void RemoveAt(int index)
        {
            Points_.RemoveAt(index);
        }

        public GpxPoint this[int index]
        {
            get { return Points_[index]; }
            set { Points_[index] = value; }
        }

        public void Add(GpxPoint item)
        {
            Points_.Add(item);
        }

        public void Clear()
        {
            Points_.Clear();
        }

        public bool Contains(GpxPoint item)
        {
            return Points_.Contains(item);
        }

        public void CopyTo(GpxPoint[] array, int arrayIndex)
        {
            Points_.CopyTo(array, arrayIndex);
        }

        public bool IsReadOnly
        {
            get { return false; }
        }

        public bool Remove(GpxPoint item)
        {
            return Points_.Remove(item);
        }
    }

    public class GpxBounds
    {
        public double MinLatitude { get; set; }
        public double MinLongitude { get; set; }
        public double MaxLatitude { get; set; }
        public double MaxLongitude { get; set; }
    }
}