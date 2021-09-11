using Core.Common.Extensions;
using Core.Common.Interfaces;
using Core.Common.SharedDataObjects;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace BikeRouteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestGpsController : ControllerBase
    {
        private readonly ILogger<TestGpsController> _logger;
        private readonly IDataRepository<Route> routesRepository;
        public TestGpsController(ILogger<TestGpsController> logger, IDataRepository<Route> _routesDataRepo)
        {
            _logger = logger;
            routesRepository = _routesDataRepo;
        }

        [HttpGet]
        [Route("GetTestGpsPoint")]
        public async Task<IActionResult> GetTestGpsPoint()
        {
            try
            {
                var rng = new Random();
                var t  = new GpsPoint
                {
                    time = DateTime.Now,
                    lattitude = rng.Next(-20, 55),
                    longitude = rng.Next(-20, 55)
                };
                var y = new JsonResult(t);
                return y;
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpGet]
        [Route("GetAllRoutesInfo")]
        public async Task<IActionResult> GetAllRoutesInfo()
        {
            try
            {
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
                //check if route already exist
                await AddNewRoute(ConvertFileToGeoJson(routeFile, routeName));
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
        public async Task<IActionResult> DownloadRouteFile(string routeName, string fileExt)
        {
            try
            {
                //check if route already exist
                List<Route> routeFile = await routesRepository.FindAsync(r => r.RouteName == routeName) as List<Route>;

                if (routeFile.Count == 0)
                {
                    return StatusCode(StatusCodes.Status404NotFound);
                }

                if (string.IsNullOrEmpty(fileExt))
                {
                    return ConvertRouteToOriginalFile(routeFile[0]);
                }

                // should add formatting for fileExt
                return ConvertRouteToOriginalFile(routeFile[0]);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        private FileContentResult ConvertRouteToOriginalFile(Route routeData)
        {

            return new FileContentResult(routeData.OrigFileContent, $"application/{routeData.OrigFileExtension}")
            {
                FileDownloadName = $"{routeData.RouteName}.{routeData.OrigFileExtension}"
            };
        }

        private Route ConvertFileToGeoJson(IFormFile routeFile, string routeName)
        {
            Route route = new Route();
            route.RouteName = routeName;

            if (!CheckIfGpxFile(routeFile))
            {
                route.OrigFileExtension = "gpx";
            }

            route.OrigFileContent = routeFile.GetBytes();
            
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

        private bool CheckIfGpxFile(IFormFile file)
        {
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            return extension is ".gpx" or ".GPX";
        }
    }
}
