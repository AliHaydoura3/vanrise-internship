using DeviceInventory.Models;
using System.Collections.Generic;

namespace DeviceInventory.Data
{
    public interface IReportRepository
    {
        /// <summary>Number of clients grouped by type. Pass type to filter to a single type.</summary>
        IEnumerable<ClientsPerTypeDTO> GetClientsCountByType(int? type = null);

        /// <summary>
        /// Count of phone numbers per device, split by reservation status.
        /// Pass deviceId and/or status ("Reserved"/"Unreserved") to filter.
        /// </summary>
        IEnumerable<PhoneNumberStatusReportDTO> GetPhoneNumberStatusByDevice(int? deviceId = null, string? status = null);
    }
}
