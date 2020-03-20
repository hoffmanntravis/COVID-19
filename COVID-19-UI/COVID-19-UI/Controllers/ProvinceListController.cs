using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace COVID_19.Controllers
{
    [ApiController]
    [Route("api/{controller}")]
    public class ProvinceListController : ControllerBase
    {
        public string Get()
        {
            try
            {
                return JsonConvert.SerializeObject(CovidData.ProvinceStates, Formatting.Indented);
            }
            catch
            {
                return JsonConvert.SerializeObject(null);
            };
        }
    }
}
