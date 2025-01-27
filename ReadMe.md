# Viewer for weather station collected data

Goal of this project is to display for end user data collected by the weather station device. The weather station is collecting weather related data from set of sensors. The collected information is periodically being sent to Azure storage. This application get the data from storage and display in a user-friendly way.

## Application settings

The behavior of the application is controlled by several environment variables. The following the list of these:

* **MeteoSettings_Services__History__StorageConnectionString** - Connection string for Azure storage service contains recent uploaded data. Can be get on Azure portal from: 
* **MeteoSettings_Services__IotHub__connectionString** - Connection string for Azure IotHub service the weather station posts data to. Can be get on Azure portal from:
* **MeteoSettings_Building_App_Locale** - Application location. Now supported values: "en-US" or "ru". Default: "en-US"

## Local server

In case if it is necessary to start local server with the application it is possible to create and run bat file with commands something like these:

```
set MeteoSettings_Services__History__StorageConnectionString=DefaultEndpointsProtocol=https;AccountName=...
set MeteoSettings_Services__IotHub__connectionString=Endpoint=sb://ihsu...
set MeteoSettings_Building_App_Locale=ru
dotnet run
```
