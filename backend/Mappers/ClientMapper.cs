using System;
using System.Data;
using DeviceInventory.Models;

namespace DeviceInventory.Mappers
{
    public static class ClientMapper
    {
        public static Client Map(IDataRecord record)
        {
            var client = new Client
            {
                Id = record.GetInt32(record.GetOrdinal("Id")),
                Name = record.GetString(record.GetOrdinal("Name")),
                Type = (ClientType)record.GetInt32(record.GetOrdinal("Type"))
            };

            var bdOrd = record.GetOrdinal("BirthDate");
            client.BirthDate = record.IsDBNull(bdOrd) ? (DateTime?)null : record.GetDateTime(bdOrd);

            return client;
        }
    }
}
