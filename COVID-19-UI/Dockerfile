FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
# Copy, restore, and publish

RUN apt install curl

RUN curl --silent --location https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --yes nodejs
RUN npm update
ADD . /app
WORKDIR /app
RUN dotnet restore && dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 as build


RUN curl --silent --location https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --yes nodejs
RUN npm update

EXPOSE 80
EXPOSE 443

WORKDIR /app
COPY --from=build-env /app/out/. .
ENTRYPOINT ["dotnet", "COVID-19-UI.dll"]