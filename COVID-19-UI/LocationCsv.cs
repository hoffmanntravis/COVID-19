using System;

namespace COVID_19
{
    public class LocationCsv
    {
        public string ProvinceState { get; set; }
        public string CountryRegion { get; set; }
        public DateTime LastUpdate { get; set; }
        public int? Confirmed { get; set; }
        public int? Deaths { get; set; }
        public int? Recovered { get; set; }
    }
}