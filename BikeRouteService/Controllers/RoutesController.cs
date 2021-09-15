using Core.Common.Extensions;
using Core.Common.Interfaces;
using Core.Common.SharedDataObjects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Common.GpxUtils;

namespace BikeRouteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutesController : ControllerBase
    {
        private readonly ILogger<RoutesController> _logger;
        private readonly IDataRepository<Route> routesRepository;
        public RoutesController(ILogger<RoutesController> logger, IDataRepository<Route> _routesDataRepo)
        {
            _logger = logger;
            routesRepository = _routesDataRepo;
        }

        [HttpGet]
        [Route("GetAllRoutesInfo")]
        public async Task<IActionResult> GetAllRoutesInfo()
        {
            try
            {
                // TODO: list properties names should not be hardcoded
                var fieldsToFetch = new List<string> { "RouteLength", "RouteName", "RouteDifficulty" };
                IEnumerable<Route> routesInfos = await routesRepository.GetAllDocsSpecificFieldsOnlyAsync(fieldsToFetch);
                var jsonRes = new JsonResult(routesInfos);
                return jsonRes;
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpPost]
        [Route("UploadRouteFile")]
        public async Task<IActionResult> UploadRouteFile(IFormFile routeFile, string routeName)
        {
            try
            {
                //TODO: check if route already exist before doing anything
                Route geoJsonRouteObject = BuildGeoJsonRouteObject(routeFile, routeName);
                await AddNewRoute(geoJsonRouteObject);
                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }
        
        [HttpGet]
        [Route("DownloadRouteFile")]
        public async Task<IActionResult> DownloadRouteFile(string routeName, FileExtension fileExtension = FileExtension.NotSupported)
        {
            try
            {
                if (fileExtension == FileExtension.NotSupported)
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Must provide file extension");
                }
                
                //TODO: check if route already exist
                var res = await routesRepository.FindAsync(r => r.RouteName == routeName);
                Route routeFile = res.FirstOrDefault();

                if (routeFile == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, $"Route with name {routeName} not found");
                }

                if (fileExtension == FileExtension.GeoJson)
                {
                    return GetRouteAsGeoJsonFile(routeFile);
                }
                
                return GetRouteAsOriginalFile(routeFile);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpGet]
        [Route("DownloadRouteOriginalFile")]
        public async Task<IActionResult> DownloadRouteOriginalFile(string routeName)
        {
            try
            {
                //TODO: check if route already exist
                List<Route> routeFile = await routesRepository.FindAsync(r => r.RouteName == routeName) as List<Route>;

                if (routeFile==null || routeFile.Count == 0)
                {
                    return StatusCode(StatusCodes.Status404NotFound, $"Route with name {routeName} not found");
                }

                return GetRouteAsOriginalFile(routeFile.FirstOrDefault());
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }
        
        private FileContentResult GetRouteAsOriginalFile(Route routeData)
        {
            return new FileContentResult(routeData.OrigFileContent, $"application/{routeData.OrigFileExtension}")
            {
                FileDownloadName = $"{routeData.RouteName}.{routeData.OrigFileExtension}"
            };
        }
        
        private FileContentResult GetRouteAsGeoJsonFile(Route routeData)
        {
            return new FileContentResult(routeData.GeoJsonFileContent, "application/geojson")
            {
                FileDownloadName = $"{routeData.RouteName}.geojson"
            };
        }

        private Route BuildGeoJsonRouteObject(IFormFile routeFile, string routeName)
        {
            //TODO: add routeobject builder as intermidiate
            Route route = new Route
            {
                RouteName = routeName
            };

            switch (routeFile.GetFileExtension())
            {
                case FileExtension.Gpx:
                    
                    route.OrigFileExtension = "gpx";
                    route.OrigFileContent = routeFile.GetBytes();
                    GpxConverter.ConvertGpxToGeoJson(routeFile.OpenReadStream(), route);
                    break;
                
                case FileExtension.GeoJson:
                    
                    break;
                
                case FileExtension.Kml:
                    
                    break;
                
                default:
                    throw new Exception("Not supported file format");
            }
            
            return route;
        }

        private async Task AddNewRoute(Route route)
        {
            try
            {
                await routesRepository.AddAsync(route);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw;
            }
        }
    }
}
