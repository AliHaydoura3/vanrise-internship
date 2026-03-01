using Microsoft.Data.SqlClient;

namespace DeviceInventory.Data;

public class UserRepository : IUserRepository
{
    private readonly IConfiguration _config;

    public UserRepository(IConfiguration config)
    {
        _config = config;
    }

    public async Task<(bool success, string username)> LoginAsync(
        string username, string passwordHash)
    {
        var connStr = _config.GetConnectionString("DefaultConnection");
        using var conn = new SqlConnection(connStr);
        await conn.OpenAsync();

        using var cmd = new SqlCommand("dbo.sp_LoginUser", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Username", username);
        cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);

        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
            return (true, reader["Username"].ToString()!);

        return (false, string.Empty);
    }
}
