# BodaAPI/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Railway inyecta la variable PORT en tiempo de ejecución
EXPOSE 8080
CMD ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet BodaAPI.dll
