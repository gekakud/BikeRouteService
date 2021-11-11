using System;
using BikeRouteService.Services;
using Core.Common.Interfaces;
using Core.Common.Mongo;
using Core.Common.SharedDataObjects;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

namespace BikeRouteService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // ConfigureServices is where you register dependencies. This gets
        // called by the runtime before the Configure method, below.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            
            //disable camelCase policy - serialize properties names as it appears in a model
            services.AddControllers().AddNewtonsoftJson(options =>
            {
                // Use the default property (Pascal) casing
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });
            
            // register mongo config section
            services.Configure<MongoDbConfig>(
                Configuration.GetSection(nameof(MongoDbConfig)));

            // register mongo config options
            services.AddSingleton<IMongoDbConfig>(sp =>
                sp.GetRequiredService<IOptions<MongoDbConfig>>().Value);
            
            services.AddSingleton<IDataRepository<Route>, DataRepository<Route>>();
            services.AddSingleton(typeof(RoutesService));
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = 
                    $"{Configuration.GetValue<string>("Redis:Server")}:{Configuration.GetValue<int>("Redis:Port")}";
            });

            services.AddSingleton(Configuration);

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "BikeRouteService", Version = "v1",
                    Description = "An API to perform Employee operations",
                    Contact = new OpenApiContact
                    {
                        Name = "Local dev map",
                        Url = new Uri("http://localhost:6001"),
                    }
                });
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot/build";
            });
        }
        
        // Inside of Configure method we set up middleware that handles
        // every HTTP request that comes to our application
        // Configure is where you add middleware. This is called after
        // ConfigureServices. You can use IApplicationBuilder.ApplicationServices
        // here if you need to resolve things from the container.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BikeRouteService v1"));
                app.ApplicationServices.GetRequiredService<IConfiguration>().GetSection("IsDevelopment").Value = "True";
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials()); // allow credentials
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "wwwroot";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
