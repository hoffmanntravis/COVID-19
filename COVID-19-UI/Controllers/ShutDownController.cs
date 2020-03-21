using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace COVID_19_UI.Controllers
{
    [Route("api/{controller}")]
    public class ShutdownController : Controller
    {
        private string secret = "shutdowncovid";
        private IApplicationLifetime ApplicationLifetime { get; set; }

        public ShutdownController(IApplicationLifetime appLifetime)
        {
            ApplicationLifetime = appLifetime;
        }
        [HttpGet]
        public async Task<string> ShutdownSite([FromQuery] string shutdownCode)
        {
            if (shutdownCode == secret)
            {
                ApplicationLifetime.StopApplication();
                return "Done";
            }
            return "false";
        }

    }
}