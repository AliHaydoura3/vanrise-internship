using System;
using System.Data;
using DeviceInventory.Models;

namespace DeviceInventory.Mappers
{
    public static class PhoneNumberMapper
    {
        public static PhoneNumberDTO MapToDTO(IDataRecord record)
        {
            var phoneNumber = new PhoneNumberDTO
            {
                Id = record.GetInt32(record.GetOrdinal("Id")),
                Number = record.GetString(record.GetOrdinal("Number")),
                DeviceId = record.GetInt32(record.GetOrdinal("DeviceId"))
            };

            var deviceNameOrd = record.GetOrdinal("DeviceName");
            phoneNumber.DeviceName = record.IsDBNull(deviceNameOrd) ? null : record.GetString(deviceNameOrd);

            return phoneNumber;
        }
    }
}
