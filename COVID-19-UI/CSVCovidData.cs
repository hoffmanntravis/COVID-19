using System;
using System.Collections.Generic;
using System.Linq;

namespace COVID_19
{

    public static class CSVCovidData
    {
        public static List<List<LocationCsv>> LocationCsvList = new List<List<LocationCsv>>();
        public static List<dynamic> RawDataConfirmed = new List<dynamic>();
        public static List<dynamic> RawDataDeaths = new List<dynamic>();
        public static List<dynamic> RawDataRecovered = new List<dynamic>();
    }

    public static class CovidData
    {
        public static Dictionary<LocationKey, Occurences> LocationOccurrences { get; set; } = new Dictionary<LocationKey, Occurences>();
        public static HashSet<string> CountryRegions { get; set; } = new HashSet<string>();
        public static HashSet<string> ProvinceStates { get; set; } = new HashSet<string>();
        public static Dictionary<string, Country> CountryProvinces { get; set; } = new Dictionary<string, Country>();
        public static List<KeyValuePair<LocationKey, Occurences>> SerializedLocationOccurrences
        {
            get { return LocationOccurrences.ToList(); }
            set { LocationOccurrences = value.ToDictionary(x => x.Key, x => x.Value); }
        }




        public static void convertCsvToDictionary(List<dynamic> LocationList, string type)
        {
            foreach (var lcsv in LocationList)
            {
                var dict = (IDictionary<string, object>)lcsv;
                string Country = lcsv.countryregion.ToLower();
                string Province = lcsv.provincestate.ToLower();


                if (!String.IsNullOrEmpty(Country))
                    CountryRegions.Add(Country.ToLower());
                if (!String.IsNullOrEmpty(Province))
                {
                    ProvinceStates.Add(Province.ToLower());
                    LocationKey lk = new LocationKey(Country, Province);
                    if (!CountryProvinces.ContainsKey(Country))
                        CountryProvinces.Add(Country, new Country());
                    //CountryProvinces.Add(lk, new Location(Country, Province, new Coordinates(lcsv.Lat, lcsv.Long)));
                    else
                    {
                        if (!CountryProvinces[Country].Provinces.Contains(Province))
                            CountryProvinces[Country].Provinces.Add(Province);
                    }
                }



                DateTime firstDate = DateTime.Parse("1/1/2020");
                DateTime endDate = DateTime.Now;
                int daysToAttempt = (endDate - firstDate).Days + 10;


                for (int i = 0; i < daysToAttempt; i++)
                {
                    StatusCount statusCount = new StatusCount();
                    DateTime dateToAttempt = firstDate.AddDays(i);
                    string targetDay = dateToAttempt.ToString("Mdyy");

                    if (dict.TryGetValue(targetDay, out var count) && !String.IsNullOrEmpty(count.ToString()))
                    {
                            int intcount = int.Parse(count.ToString());
                            if (type == "Confirmed")
                                statusCount.Confirmed = intcount;
                            else if (type == "Deaths")
                                statusCount.Deaths = intcount;
                            else if (type == "Recovered")
                                statusCount.Recovered = intcount;

                        Occurences occurences = new Occurences();
                        occurences.DateOccurrences.Add(dateToAttempt, statusCount);

                        LocationKey location = new LocationKey(Country.ToLower(), Province.ToLower());

                        if (!LocationOccurrences.ContainsKey(location))
                            LocationOccurrences.Add(location, occurences);


                        if (!LocationOccurrences[location].DateOccurrences.ContainsKey(dateToAttempt))
                            LocationOccurrences[location].DateOccurrences[dateToAttempt] = new StatusCount();

                        if (type == "Confirmed")
                            LocationOccurrences[location].DateOccurrences[dateToAttempt].Confirmed = statusCount.Confirmed;
                        else if (type == "Deaths")
                            LocationOccurrences[location].DateOccurrences[dateToAttempt].Deaths = statusCount.Deaths;
                        else if (type == "Recovered")
                            LocationOccurrences[location].DateOccurrences[dateToAttempt].Recovered = statusCount.Recovered;

                    }
                }
            }
        }
        public static void ConvertFromCsvLocationToDictionary()
        {
            convertCsvToDictionary(CSVCovidData.RawDataConfirmed, "Confirmed");
            convertCsvToDictionary(CSVCovidData.RawDataDeaths, "Deaths");
            convertCsvToDictionary(CSVCovidData.RawDataRecovered, "Recovered");
        }

        public class Country
        {
            public HashSet<string> Provinces { get; set; } = new HashSet<string>();
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
            private string _country;

            public string Country
            {
                get => _country;
                set
                {
                    if (value == null)
                        _country = value;
                    else
                        _country = value.ToLower();
                }
            }
            private string _province;
            public string Province
            {
                get => _province;
                set
                {
                    if (value == null)
                        _province = value;
                    else
                        _province = value.ToLower();
                }
            }
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
            public int Confirmed = 0;
            public int Deaths = 0;
            public int Recovered = 0;
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
