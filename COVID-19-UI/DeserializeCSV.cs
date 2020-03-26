using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CsvHelper;
namespace COVID_19
{
    public static class CsvPaths
    {
        internal readonly static string CurrentPath = Directory.GetCurrentDirectory();
        internal readonly static string ZipPath = @CurrentPath + "/JH.zip";
        internal readonly static string ExtractPath = @CurrentPath;
        internal readonly static string DailyReportsPath = @CurrentPath + "/COVID-19-master/csse_covid_19_data/csse_covid_19_time_series";
    }
    public static class DeserializeCSV
    {

        private static void Deserialize(StreamReader sr, string filename)
        {

            using (CsvReader csv = new CsvReader(sr, CultureInfo.InvariantCulture))
            {
                //csv.Configuration.TypeConverterCache.RemoveConverter<bool>();
                //csv.Configuration.TypeConverterCache.AddConverter<bool>(new CustomBooleanTypeConverterCache());

                //csv.Configuration.HeaderValidated = null;
                csv.Configuration.MissingFieldFound = null;

                //remove slashes and spaces from the header names and make them lowercase
                csv.Configuration.PrepareHeaderForMatch = (header, index) => Regex.Replace(header, "[/' ']", string.Empty).ToLower();

                //CSVCovidData.LocationCsvList.Add(csv.GetRecords<LocationCsv>().ToList());

                if (filename.Contains("time_series_covid19_confirmed_global"))
                    CSVCovidData.RawDataConfirmed = csv.GetRecords<dynamic>().ToList();
                else if (filename.Contains("time_series_covid19_deaths_global"))
                    CSVCovidData.RawDataDeaths = csv.GetRecords<dynamic>().ToList();
                else if (filename.Contains("time_series_covid19_recovered_global"))
                    CSVCovidData.RawDataRecovered = csv.GetRecords<dynamic>().ToList();
            }
        }

        private static void DownloadGitZip(string url, string outLocation)
        {
            using (var client = new WebClient())
            {
                client.DownloadFile(url, outLocation);
            }
        }

        private static void ExtractGitZip(string ZipPath, string ExtractionPath)
        {
            ZipFile.ExtractToDirectory(ZipPath, ExtractionPath, true);
        }

        public static void DeserializeCsvs(string url)
        {
            DownloadGitZip(url, CsvPaths.ZipPath);
            ExtractGitZip(CsvPaths.ZipPath, CsvPaths.ExtractPath);
            string[] csvFiles = Directory.GetFiles(CsvPaths.DailyReportsPath, "*.csv*", SearchOption.AllDirectories);
            foreach (string csvFile in csvFiles)
            {
                Deserialize(new StreamReader(csvFile), csvFile);
            }
        }
    }
}



