using BikeRouteService.Controllers;
using Core.Common.Interfaces;
using Core.Common.SharedDataObjects;
using Microsoft.Extensions.Logging;

namespace BikeRouteService.Services
{
    public class RoutesService
    {
        private readonly ILogger<RoutesService> Logger;
        private readonly IDataRepository<Route> RoutesRepository;
        
        public RoutesService(ILogger<RoutesService> logger, IDataRepository<Route> routesDataRepo)
        {
            RoutesRepository = routesDataRepo;
            Logger = logger;
        }
    }
}