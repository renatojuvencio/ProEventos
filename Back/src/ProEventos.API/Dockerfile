#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ProEventos.Api/ProEventos.API.csproj", "ProEventos.Api/"]
COPY ["ProEventos.Application/ProEventos.Application.csproj", "ProEventos.Application/"]
COPY ["ProEventos.Domain/ProEventos.Domain.csproj", "ProEventos.Domain/"]
COPY ["ProEventos.Persistence/ProEventos.Persistence.csproj", "ProEventos.Persistence/"]
RUN dotnet restore "./ProEventos.Api/ProEventos.API.csproj"
COPY . .
WORKDIR "/src/ProEventos.Api"
RUN dotnet build "./ProEventos.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ProEventos.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProEventos.API.dll"]