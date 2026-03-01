using Microsoft.AspNetCore.Mvc;
using DeviceInventory.Models;
using DeviceInventory.Data;
using System.Collections.Generic;

namespace DeviceInventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportRepository _repo;

        public ReportsController(IReportRepository repo)
        {
            _repo = repo;
        }

        // GET /api/reports/clientspertype?type=0
        [HttpGet("clientspertype")]
        public ActionResult<IEnumerable<ClientsPerTypeDTO>> GetClientsPerType([FromQuery] int? type = null)
        {
            return Ok(_repo.GetClientsCountByType(type));
        }

        // GET /api/reports/phonenumberstatus?deviceId=1&status=Reserved
        [HttpGet("phonenumberstatus")]
        public ActionResult<IEnumerable<PhoneNumberStatusReportDTO>> GetPhoneNumberStatus(
            [FromQuery] int? deviceId = null,
            [FromQuery] string? status = null)
        {
            return Ok(_repo.GetPhoneNumberStatusByDevice(deviceId, status));
        }
    }
}
