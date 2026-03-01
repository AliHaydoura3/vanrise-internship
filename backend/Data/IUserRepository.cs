namespace DeviceInventory.Data;

public interface IUserRepository
{
    /// <summary>
    /// Returns (true, username) when a user row matching the
    /// username and SHA-256 hex password hash is found.
    /// </summary>
    Task<(bool success, string username)> LoginAsync(string username, string passwordHash);
}
