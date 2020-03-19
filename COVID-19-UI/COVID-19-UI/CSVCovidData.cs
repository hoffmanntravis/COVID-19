using System;
using System.Collections.Generic;
using System.Linq;

namespace COVID_19
{

    public static class CSVCovidData
    {
        public static List<List<LocationCsv>> LocationCsvList = new List<List<LocationCsv>>();
    }

    public static class CovidData
    {
        public static Dictionary<LocationKey, Occurences> LocationOccurrences { get; set; } = new Dictionary<LocationKey, Occurences>();
        public static List<KeyValuePair<LocationKey, Occurences>> SerializedLocationOccurrences
        {
            get { return LocationOccurrences.ToList(); }
            set { LocationOccurrences = value.ToDictionary(x => x.Key, x => x.Value); }
        }


        public static void ConvertFromCsvLocationToDictionary()
        {
            foreach (List<LocationCsv> LocationData in CSVCovidData.LocationCsvList)
            {
                foreach (LocationCsv lcsv in LocationData)
                {
                    Occurences occurences = new Occurences();
                    StatusCount statusCount = new StatusCount
                    {
                        Confirmed = lcsv.Confirmed.GetValueOrDefault(),
                        Deaths = lcsv.Deaths.GetValueOrDefault(),
                        Recovered = lcsv.Recovered.GetValueOrDefault()
                    };
                    occurences.DateOccurrences.Add(lcsv.LastUpdate.Date, statusCount);

                    LocationKey location = new LocationKey(lcsv.CountryRegion, lcsv.ProvinceState);

                    if (!LocationOccurrences.ContainsKey(location))
                    {
                        LocationOccurrences.Add(location, occurences);
                    }
                    else
                    {
                        LocationOccurrences[location].DateOccurrences[lcsv.LastUpdate.Date] = statusCount;
                    }
                }
            }
        }


        public class LocationKey
        {
            public LocationKey() { }
            public LocationKey(string country, string province)
            {
                Country = country;
                Province = province;
            }
            public override bool Equals(object obj)
            {
                LocationKey l = obj as LocationKey;

                if (l == null)
                {
                    return false;
                }

                return l.Country + l.Province == this.Country + this.Province;
            }

            public override int GetHashCode()
            {
                return (Country + Province).GetHashCode();
            }
            public string Country { get; set; }
            public string Province { get; set; }
        }


        public class Location
        {
            public Location(string country, string province, Coordinates coordinates)
            {
                Country = country;
                Province = province;
                Coordinates = coordinates;
            }

            public Location(string country, string province)
            {
                Country = country;
                Province = province;
            }
            public string Country { get; set; }
            public string Province { get; set; }
            public Coordinates Coordinates { get; set; }
        }



        public class Occurences
        {
            public Dictionary<DateTime, StatusCount> DateOccurrences { get; set; } = new Dictionary<DateTime, StatusCount>();
        }


        public class StatusCount
        {
            //public DateTime Date { get; set; }
            public int Confirmed;
            public int Deaths;
            public int Recovered;
        }

        public class Coordinates
        {
            public double Lat { get; set; }
            public double Lng { get; set; }
            public Coordinates(double lat, double lng)
            {
                Lat = lat;
                Lng = lng;
            }
        }
    }
}
