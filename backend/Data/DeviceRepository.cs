using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using DeviceInventory.Models;
using DeviceInventory.Mappers;

namespace DeviceInventory.Data
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly string _connectionString;

        public DeviceRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public IEnumerable<Device> GetDevices(string? name = null)
        {
            var devices = new List<Device>();

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                if (string.IsNullOrWhiteSpace(name))
                {
                    cmd.CommandText = "SELECT Id, Name FROM Devices ORDER BY Id";
                }
                else
                {
                    cmd.CommandText = "SELECT Id, Name FROM Devices WHERE Name LIKE @Name ORDER BY Id";
                    cmd.Parameters.AddWithValue("@Name", "%" + name.Trim() + "%");
                }

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read()) devices.Add(DeviceMapper.Map(rdr));
                }
            }

            return devices;
        }

        public Device? GetDevice(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "SELECT Id, Name FROM Devices WHERE Id = @Id";
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read()) return DeviceMapper.Map(rdr);
                }
            }

            return null;
        }

        public Device CreateDevice(Device device)
        {
            if (device == null) throw new ArgumentNullException(nameof(device));

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "sp_InsertDevice";
                cmd.Parameters.AddWithValue("@Name", device.Name.Trim());

                conn.Open();
                var result = cmd.ExecuteScalar();
                int newId = Convert.ToInt32(result);
                device.Id = newId;
            }

            return device;
        }

        public bool UpdateDevice(int id, Device device)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "UPDATE Devices SET Name = @Name WHERE Id = @Id";
                cmd.Parameters.AddWithValue("@Name", device.Name.Trim());
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public bool DeleteDevice(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "DELETE FROM Devices WHERE Id = @Id";
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }
    }
}
