using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace COVID_19.Controllers
{
    [ApiController]
    [Route("api/{controller}")]
    public class CountryListController : ControllerBase
    {
        public string Get()
        {
            try
            {
                return JsonConvert.SerializeObject(CovidData.CountryRegions, Formatting.Indented);
            }
            catch
            {
                return String.Format("Unable to list countries/regions");
            };
        }
    }
}
