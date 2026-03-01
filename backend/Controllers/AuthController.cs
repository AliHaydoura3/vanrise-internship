using Microsoft.AspNetCore.Mvc;
using DeviceInventory.Data;
using DeviceInventory.Models;

namespace DeviceInventory.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepo;

    public AuthController(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    /// <summary>POST /api/auth/login — validate credentials.</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.PasswordHash))
            return BadRequest(new LoginResponse
            {
                Success = false,
                Message = "Username and password are required."
            });

        var (success, username) = await _userRepo.LoginAsync(
            request.Username.Trim().ToLowerInvariant(),
            request.PasswordHash.ToLowerInvariant());

        if (!success)
            return Unauthorized(new LoginResponse
            {
                Success = false,
                Message = "Invalid username or password."
            });

        return Ok(new LoginResponse
        {
            Success = true,
            Username = username,
            Message = "Login successful."
        });
    }
}
