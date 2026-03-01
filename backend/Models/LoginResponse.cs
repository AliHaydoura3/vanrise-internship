namespace DeviceInventory.Models;

public class LoginResponse
{
    public bool Success { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
