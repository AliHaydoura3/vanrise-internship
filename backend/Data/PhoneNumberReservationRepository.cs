using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using DeviceInventory.Models;
using DeviceInventory.Mappers;

namespace DeviceInventory.Data
{
    public class PhoneNumberReservationRepository : IPhoneNumberReservationRepository
    {
        private readonly string _connectionString;

        public PhoneNumberReservationRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public IEnumerable<PhoneNumberReservationDTO> GetReservations(int? clientId = null, int? phoneNumberId = null)
        {
            var list = new List<PhoneNumberReservationDTO>();

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                var where = new List<string>();

                if (clientId.HasValue)
                {
                    where.Add("r.ClientId = @ClientId");
                    cmd.Parameters.AddWithValue("@ClientId", clientId.Value);
                }

                if (phoneNumberId.HasValue)
                {
                    where.Add("r.PhoneNumberId = @PhoneNumberId");
                    cmd.Parameters.AddWithValue("@PhoneNumberId", phoneNumberId.Value);
                }

                cmd.CommandText =
                    "SELECT r.Id, r.ClientId, c.Name AS ClientName, " +
                    "       r.PhoneNumberId, pn.Number AS PhoneNumber, " +
                    "       r.BED, r.EED " +
                    "FROM   dbo.PhoneNumberReservations r " +
                    "LEFT JOIN dbo.Clients      c  ON c.Id  = r.ClientId " +
                    "LEFT JOIN dbo.PhoneNumbers pn ON pn.Id = r.PhoneNumberId " +
                    (where.Count > 0 ? "WHERE " + string.Join(" AND ", where) + " " : "") +
                    "ORDER BY r.Id";

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                        list.Add(PhoneNumberReservationMapper.MapToDTO(rdr));
                }
            }

            return list;
        }

        public IEnumerable<PhoneNumberReservationDTO> GetActiveReservations(int? clientId = null)
        {
            var list = new List<PhoneNumberReservationDTO>();

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "dbo.sp_GetActiveReservationsByClient";
                cmd.Parameters.AddWithValue("@ClientId", (object?)clientId ?? DBNull.Value);

                conn.Open();
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                        list.Add(PhoneNumberReservationMapper.MapToDTO(rdr));
                }
            }

            return list;
        }

        public PhoneNumberReservation AddReservation(PhoneNumberReservation reservation)
        {
            if (reservation == null) throw new ArgumentNullException(nameof(reservation));

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "dbo.sp_InsertPhoneNumberReservation";
                cmd.Parameters.AddWithValue("@ClientId", reservation.ClientId);
                cmd.Parameters.AddWithValue("@PhoneNumberId", reservation.PhoneNumberId);
                cmd.Parameters.AddWithValue("@BED", reservation.BED);
                cmd.Parameters.AddWithValue("@EED", (object?)reservation.EED ?? DBNull.Value);

                conn.Open();
                reservation.Id = (int)cmd.ExecuteScalar();
                return reservation;
            }
        }

        public bool UnreservePhoneNumber(int clientId, int phoneNumberId)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "dbo.sp_UnreservePhoneNumber";
                cmd.Parameters.AddWithValue("@ClientId", clientId);
                cmd.Parameters.AddWithValue("@PhoneNumberId", phoneNumberId);

                conn.Open();
                var rows = (int)cmd.ExecuteScalar();
                return rows > 0;
            }
        }

        public bool DeleteReservation(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "EXEC dbo.sp_DeletePhoneNumberReservation @Id";
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
