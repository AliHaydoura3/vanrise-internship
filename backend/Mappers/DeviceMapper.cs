using System.Data;
using DeviceInventory.Models;

namespace DeviceInventory.Mappers
{
    public static class DeviceMapper
    {
        public static Device Map(IDataRecord record)
        {
            return new Device
            {
                Id = record.GetInt32(record.GetOrdinal("Id")),
                Name = record.GetString(record.GetOrdinal("Name"))
            };
        }
    }
}
