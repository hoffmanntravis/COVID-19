using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace COVID_19_UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class USStatesController : ControllerBase
    {

        internal readonly static string USStatesJsonFile = "@CurrentPath/USStates.json";

        public string Get()
        {
            return System.IO.File.ReadAllText(USStatesJsonFile);
        }
    }
}