using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using DeviceInventory.Models;
using DeviceInventory.Mappers;

namespace DeviceInventory.Data
{
    public class PhoneNumberRepository : IPhoneNumberRepository
    {
        private readonly string _connectionString;

        public PhoneNumberRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public IEnumerable<PhoneNumberDTO> GetPhoneNumbers(string? number = null, int? deviceId = null)
        {
            var list = new List<PhoneNumberDTO>();

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                var where = new List<string>();
                if (!string.IsNullOrWhiteSpace(number))
                {
                    where.Add("Number LIKE @Number");
                    cmd.Parameters.AddWithValue("@Number", "%" + number.Trim() + "%");
                }
                if (deviceId.HasValue)
                {
                    where.Add("DeviceId = @DeviceId");
                    cmd.Parameters.AddWithValue("@DeviceId", deviceId.Value);
                }

                cmd.CommandText = "SELECT pn.Id, pn.Number, pn.DeviceId, d.Name as DeviceName FROM PhoneNumbers pn " +
                                  "LEFT JOIN Devices d ON pn.DeviceId = d.Id " +
                                  (where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "") +
                                  " ORDER BY pn.Id";

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read()) list.Add(PhoneNumberMapper.MapToDTO(rdr));
                }
            }

            return list;
        }

        public PhoneNumber? GetPhoneNumber(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "SELECT pn.Id, pn.Number, pn.DeviceId FROM PhoneNumbers pn WHERE pn.Id = @Id";
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        return new PhoneNumber
                        {
                            Id = rdr.GetInt32(rdr.GetOrdinal("Id")),
                            Number = rdr.GetString(rdr.GetOrdinal("Number")),
                            DeviceId = rdr.GetInt32(rdr.GetOrdinal("DeviceId"))
                        };
                    }
                }
            }

            return null;
        }

        public PhoneNumber CreatePhoneNumber(PhoneNumber phoneNumber)
        {
            if (phoneNumber == null) throw new ArgumentNullException(nameof(phoneNumber));

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "sp_InsertPhoneNumber";
                cmd.Parameters.AddWithValue("@Number", phoneNumber.Number.Trim());
                cmd.Parameters.AddWithValue("@DeviceId", phoneNumber.DeviceId);

                conn.Open();
                var result = cmd.ExecuteScalar();
                phoneNumber.Id = Convert.ToInt32(result);
            }

            return phoneNumber;
        }

        public bool UpdatePhoneNumber(int id, PhoneNumber phoneNumber)
        {
            if (phoneNumber == null) throw new ArgumentNullException(nameof(phoneNumber));

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "sp_UpdatePhoneNumber";
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Number", phoneNumber.Number.Trim());
                cmd.Parameters.AddWithValue("@DeviceId", phoneNumber.DeviceId);

                conn.Open();
                var affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }

        public bool DeletePhoneNumber(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "sp_DeletePhoneNumber";
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                var affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }
    }
}
