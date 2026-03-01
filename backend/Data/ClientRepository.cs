using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using DeviceInventory.Models;
using DeviceInventory.Mappers;

namespace DeviceInventory.Data
{
    // ADO.NET synchronous repository for clients (Framework-style)
    public class ClientRepository : IClientRepository
    {
        private readonly string _connectionString;

        public ClientRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public IEnumerable<Client> GetClients(string? name = null, int? type = null)
        {
            var list = new List<Client>();

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                var where = new List<string>();
                if (!string.IsNullOrWhiteSpace(name))
                {
                    where.Add("Name LIKE @Name");
                    cmd.Parameters.AddWithValue("@Name", "%" + name.Trim() + "%");
                }
                if (type.HasValue)
                {
                    where.Add("[Type] = @Type");
                    cmd.Parameters.AddWithValue("@Type", type.Value);
                }

                cmd.CommandText = "SELECT Id, Name, [Type], BirthDate FROM Clients" +
                                  (where.Count > 0 ? " WHERE " + string.Join(" AND ", where) : "") +
                                  " ORDER BY Id";

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read()) list.Add(ClientMapper.Map(rdr));
                }
            }

            return list;
        }

        public Client? GetClient(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "SELECT Id, Name, [Type], BirthDate FROM Clients WHERE Id = @Id";
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read()) return ClientMapper.Map(rdr);
                }
            }

            return null;
        }

        public Client CreateClient(Client client)
        {
            if (client == null) throw new ArgumentNullException(nameof(client));

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "sp_InsertClient";
                cmd.Parameters.AddWithValue("@Name", client.Name.Trim());
                cmd.Parameters.AddWithValue("@Type", (int)client.Type);
                if (client.BirthDate.HasValue)
                    cmd.Parameters.AddWithValue("@BirthDate", client.BirthDate.Value);
                else
                    cmd.Parameters.AddWithValue("@BirthDate", DBNull.Value);

                conn.Open();
                var result = cmd.ExecuteScalar();
                client.Id = Convert.ToInt32(result);
            }

            return client;
        }

        public bool UpdateClient(int id, Client client)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "UPDATE Clients SET Name = @Name, [Type] = @Type, BirthDate = @BirthDate WHERE Id = @Id";
                cmd.Parameters.AddWithValue("@Name", client.Name.Trim());
                cmd.Parameters.AddWithValue("@Type", (int)client.Type);
                cmd.Parameters.AddWithValue("@BirthDate", client.BirthDate.HasValue ? (object)client.BirthDate.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public bool DeleteClient(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "DELETE FROM Clients WHERE Id = @Id";
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }
    }
}
