#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["BikeRouteService/BikeRouteService.csproj", "BikeRouteService/"]
COPY ["Core.Common/Core.Common.csproj", "Core.Common/"]
RUN dotnet restore "BikeRouteService/BikeRouteService.csproj"
COPY . .
WORKDIR "/src/BikeRouteService"
RUN dotnet build "BikeRouteService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BikeRouteService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BikeRouteService.dll"]