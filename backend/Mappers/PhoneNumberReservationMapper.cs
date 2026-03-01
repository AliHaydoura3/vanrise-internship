using System;
using System.Data;
using DeviceInventory.Models;

namespace DeviceInventory.Mappers
{
    public static class PhoneNumberReservationMapper
    {
        public static PhoneNumberReservationDTO MapToDTO(IDataRecord record)
        {
            var dto = new PhoneNumberReservationDTO
            {
                Id = record.GetInt32(record.GetOrdinal("Id")),
                ClientId = record.GetInt32(record.GetOrdinal("ClientId")),
                ClientName = record.GetString(record.GetOrdinal("ClientName")),
                PhoneNumberId = record.GetInt32(record.GetOrdinal("PhoneNumberId")),
                PhoneNumber = record.GetString(record.GetOrdinal("PhoneNumber")),
                BED = record.GetDateTime(record.GetOrdinal("BED"))
            };

            var eedOrd = record.GetOrdinal("EED");
            dto.EED = record.IsDBNull(eedOrd) ? (DateTime?)null : record.GetDateTime(eedOrd);

            return dto;
        }
    }
}
