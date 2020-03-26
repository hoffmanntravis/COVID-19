using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace COVID_19.Controllers
{
    [ApiController]
    [Route("api/{controller}")]

    
public class CountryProvincesController : ControllerBase
    {
        public string Get([FromQuery] string Country)
        {


            try
            {
                if (CovidData.CountryProvinces.ContainsKey(Country))
                {
                    HashSet<string> theseCountries = CovidData.CountryProvinces[Country].Provinces.ToHashSet();
                    if (Country == "us" || Country == "usa" || Country == "united states of america")
                        theseCountries = theseCountries.Intersect(CovidData.USStates.Values).ToHashSet();

                    return JsonConvert.SerializeObject(theseCountries.ToList(), Formatting.Indented);
                }
                else
                    return JsonConvert.SerializeObject(null);
            }
            catch
            {
                return JsonConvert.SerializeObject(null);
            };
        }
    }
}
