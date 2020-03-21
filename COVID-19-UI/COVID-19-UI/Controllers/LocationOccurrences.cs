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
    [Route("StatusJSON")]
    public class LocationOccurrencesController : ControllerBase
    {

        [HttpGet]
        public string Get()
        {
            try
            {
                var occurrences = CovidData.SerializedLocationOccurrences.ToList();
                occurrences.Sort();
                return JsonConvert.SerializeObject(occurrences, Formatting.Indented);
            }
            catch
            {
                return JsonConvert.SerializeObject(null);
            }
        }
    }
}
