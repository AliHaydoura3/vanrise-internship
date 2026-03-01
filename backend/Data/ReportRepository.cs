using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using DeviceInventory.Models;

namespace DeviceInventory.Data
{
    public class ReportRepository : IReportRepository
    {
        private readonly string _connectionString;

        public ReportRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public IEnumerable<ClientsPerTypeDTO> GetClientsCountByType(int? type = null)
        {
            var list = new List<ClientsPerTypeDTO>();

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "dbo.sp_GetClientsCountByType";
                cmd.Parameters.AddWithValue("@Type", (object?)type ?? DBNull.Value);

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        var t = rdr.GetInt32(rdr.GetOrdinal("Type"));
                        list.Add(new ClientsPerTypeDTO
                        {
                            Type = t,
                            TypeName = rdr.GetString(rdr.GetOrdinal("TypeName")),
                            NoOfClients = rdr.GetInt32(rdr.GetOrdinal("NoOfClients"))
                        });
                    }
                }
            }

            return list;
        }

        public IEnumerable<PhoneNumberStatusReportDTO> GetPhoneNumberStatusByDevice(int? deviceId = null, string? status = null)
        {
            var list = new List<PhoneNumberStatusReportDTO>();

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "dbo.sp_GetPhoneNumberStatusByDevice";
                cmd.Parameters.AddWithValue("@DeviceId", (object?)deviceId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", (object?)status ?? DBNull.Value);

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        list.Add(new PhoneNumberStatusReportDTO
                        {
                            DeviceId = rdr.GetInt32(rdr.GetOrdinal("DeviceId")),
                            DeviceName = rdr.GetString(rdr.GetOrdinal("DeviceName")),
                            Status = rdr.GetString(rdr.GetOrdinal("Status")),
                            NoOfPhoneNumbers = rdr.GetInt32(rdr.GetOrdinal("NoOfPhoneNumbers"))
                        });
                    }
                }
            }

            return list;
        }
    }
}
