using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Linq;
using Core.Common.SharedDataObjects;
using System.Globalization;

namespace Core.Common.Extensions
{
    public static class Extensions
    {
        public static double ToDouble(this string value)
        {
            try
            {
                return double.Parse(value, CultureInfo.InvariantCulture.NumberFormat);
            }
            catch (System.Exception)
            {
                return 0;
            }
        }
        public static string Underscore(this string value)
            => string.Concat(value.Select((x, i) => i > 0 && char.IsUpper(x) ? "_" + x.ToString() : x.ToString()));

        public static TModel GetOptions<TModel>(this IConfiguration configuration, string section) where TModel : new()
        {
            var model = new TModel();
            configuration.GetSection(section).Bind(model);

            return model;
        }
    }

    public static class FormFileExtensions
    {
        public static byte[] GetBytes(this IFormFile formFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                formFile.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }
        
        public static FileExtension GetFileExtension(this IFormFile file)
        {
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];

            if (extension is ".gpx" or ".GPX")
            {
                return FileExtension.Gpx;
            }

            if (extension is ".geojson")
            {
                return FileExtension.GeoJson;
            }
            
            if (extension is ".KML" or ".kml")
            {
                return FileExtension.Kml;
            }
            
            return FileExtension.NotSupported;
        }
    }
}
