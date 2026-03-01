namespace DeviceInventory.Models;

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    /// <summary>SHA-256 hex hash of the password (computed client-side).</summary>
    public string PasswordHash { get; set; } = string.Empty;
}
