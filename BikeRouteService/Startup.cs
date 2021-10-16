using System;
using System.IO;
using Autofac;
using BikeRouteService.Services;
using Core.Common.Interfaces;
using Core.Common.Mongo;
using Core.Common.SharedDataObjects;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;

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
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "BikeRouteService", Version = "v1",
                    Description = "An API to perform Employee operations",
                    Contact = new OpenApiContact
                    {
                        Name = "Local dev map",
                        Url = new Uri("http://localhost:6002"),
                    }
                });
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
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            //app.UseStaticFiles(new StaticFileOptions() {
            //    FileProvider =  new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "client_web_app", "listing", "citybook")),
            //    RequestPath = new PathString("/listing")
            //});
            
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
        }
    }
}
