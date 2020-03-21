using System;
using System.Collections.Generic;
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

        //Country = country; Province = province;
        //https://localhost:44353/api/country?Country=Mainland%20China&Province=Anhui
        public string Get([FromQuery] string Country)
        {
            try
            {
                return JsonConvert.SerializeObject(CovidData.CountryProvinces[Country].Provinces.ToList(), Formatting.Indented);
            }
            catch
            {
                return JsonConvert.SerializeObject(null);
            };
        }
    }
}
