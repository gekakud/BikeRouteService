using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using BikeRouteService.Services;
using Core.Common.Extensions;
using Core.Common.Interfaces;
using Core.Common.SharedDataObjects;
using Core.Common.GpxUtils;
using Microsoft.AspNetCore.Cors;

namespace BikeRouteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutesController : ControllerBase
    {
        private readonly ILogger<RoutesController> Logger;
        private readonly IDataRepository<Route> RoutesRepository;
        private readonly RoutesService RoutesService;
        public RoutesController(RoutesService routeService, ILogger<RoutesController> logger, IDataRepository<Route> routesDataRepo)
        {
            Logger = logger;
            RoutesRepository = routesDataRepo;
            RoutesService = routeService;
        }

        [EnableCors]
        [HttpGet]
        [Route("GetAllRoutesInfo")]
        public async Task<IActionResult> GetAllRoutesInfo()
        {
            try
            {
                // TODO: list properties names should not be hardcoded
                var fieldsToFetch = new List<string> { "VisibleToAll", "RouteLength", "RouteName", "RouteDifficulty", "RouteType", "StartLat", "StartLng", "ElevationGain" };
                IEnumerable<Route> routesInfos = await RoutesRepository.GetAllDocsSpecificFieldsOnlyAsync(fieldsToFetch);
                string routesInfosAsJson = GpxConverter.GetAllRoutesInfoPointsGeoJson(routesInfos.Where(r => r.VisibleToAll == true).ToList());
                var jsonRes = new JsonResult(routesInfosAsJson);
                return jsonRes;
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [EnableCors]
        [HttpPost]
        [Route("ApproveRoute")]
        public async Task<IActionResult> ApproveRoute(string routeName)
        {
            try
            {
                if (string.IsNullOrEmpty(routeName))
                {
                    throw new Exception("Route name parameter is incorrect!");
                }

                Route routeObject = await RoutesRepository.GetAsync(r => r.RouteName == routeName);

                if (routeObject == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, $"Route with name {routeName} not found");
                }
                routeObject.VisibleToAll = true;

                await RoutesRepository.UpdateAsync(routeObject);
                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                Logger.LogError(exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteRoute")]
        public async Task<IActionResult> DeleteRoute([FromQuery]string routeName)
        {
            try
            {
                if (string.IsNullOrEmpty(routeName))
                {
                    return StatusCode(StatusCodes.Status405MethodNotAllowed, $"Route name was not provided!");
                }
                
                Route routeObject = await RoutesRepository.GetAsync(r => r.RouteName == routeName);

                if (routeObject == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, $"Route with name {routeName} not found");
                }

                await RoutesRepository.DeleteAsync(r => r.RouteName == routeName);
                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }
        
        [EnableCors]
        [HttpGet]
        [Route("GetRouteGeoJsonByName")]
        public async Task<IActionResult> GetRouteGeoJsonByName([FromQuery]string routeName)
        {
            try
            {
                Route routeObject = await RoutesRepository.GetAsync(r => r.RouteName == routeName);

                if (routeObject == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, $"Route with name {routeName} not found");
                }

                var jsonRes = new JsonResult(GpxConverter.GetRouteGeoJson(routeObject));
                return jsonRes;
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }
        
        [EnableCors]
        [HttpPost]
        [Route("UploadRouteFile")]
        public async Task<IActionResult> UploadRouteFile([Required]IFormFile routeFile, string routeName, RouteDifficulty difficulty, RouteType routeType)
        {
            try
            {
                if (string.IsNullOrEmpty(routeName))
                {
                    throw new Exception("Route name parameter is incorrect!");
                }
                
                if (RoutesRepository.ExistsAsync(r => r.RouteName == routeName).Result)
                {
                    return StatusCode(StatusCodes.Status405MethodNotAllowed, $"Route with name {routeName} already exist");
                }
                
                Route geoJsonRouteObject = BuildGeoJsonRouteObject(routeFile, routeName, difficulty, routeType);
                await RoutesRepository.AddAsync(geoJsonRouteObject);
                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                Logger.LogError(exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }
        
        [EnableCors]
        [HttpGet]
        [Route("DownloadRouteFile")]
        public async Task<IActionResult> DownloadRouteFile([Required]string routeName, FileExtension fileExtension = FileExtension.GeoJson)
        {
            try
            {
                if (fileExtension == FileExtension.NotSupported)
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Must provide file extension");
                }
                
                Route routeObject = await RoutesRepository.GetAsync(r => r.RouteName == routeName);

                if (routeObject == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, $"Route with name {routeName} not found");
                }

                if (fileExtension == FileExtension.GeoJson)
                {
                    return GetRouteAsGeoJsonFile(routeObject);
                }
                
                return GetRouteAsOriginalFile(routeObject);
            }
            catch (Exception exception)
            {
                Logger.LogError(exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [EnableCors]
        [HttpGet]
        [Route("DownloadRouteOriginalFile")]
        public async Task<IActionResult> DownloadRouteOriginalFile([Required]string routeName)
        {
            try
            {
                Route routeObject = await RoutesRepository.GetAsync(r => r.RouteName == routeName);

                if (routeObject==null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, $"Route with name {routeName} not found");
                }

                return GetRouteAsOriginalFile(routeObject);
            }
            catch (Exception exception)
            {
                Logger.LogError(exception.Message);
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

        private Route BuildGeoJsonRouteObject(IFormFile routeFile, string routeName, RouteDifficulty difficulty, RouteType routeType)
        {
            //TODO: add routeobject builder as intermidiate
            Route route = new Route
            {
                RouteName = routeName,
                RouteDifficulty = difficulty,
                RouteType = routeType,
                VisibleToAll = false
            };

            switch (routeFile.GetFileExtension())
            {
                case FileExtension.Gpx:
                    route.OrigFileExtension = "gpx";
                    route.OrigFileContent = routeFile.GetBytes();
                    try
                    {
                        GpxConverter.ConvertGpxToGeoJson(routeFile.OpenReadStream(), route);
                    }
                    catch (Exception)
                    {
                        throw new Exception("Cannot correctly read GPX file. Please check file is in correct format.");
                    }
                    break;
                
                case FileExtension.GeoJson:
                    route.OrigFileExtension = "geojson";
                    route.OrigFileContent = routeFile.GetBytes();
                    route.GeoJsonFileContent = route.OrigFileContent;
                    break;
                
                //TODO: should we support this?
                case FileExtension.Kml:
                    
                    break;
                
                default:
                    throw new Exception("Not supported file format");
            }

            route.ElevationGain = GpxConverter.CalculateElevationGainFromRouteGeoJson(route);
            return route;
        }
    }
}
