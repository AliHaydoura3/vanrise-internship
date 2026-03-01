using DeviceInventory.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<DeviceInventory.Data.IClientRepository, DeviceInventory.Data.ClientRepository>();
builder.Services.AddScoped<IPhoneNumberRepository, PhoneNumberRepository>();
builder.Services.AddScoped<DeviceInventory.Data.IPhoneNumberReservationRepository, DeviceInventory.Data.PhoneNumberReservationRepository>();
builder.Services.AddScoped<DeviceInventory.Data.IReportRepository, DeviceInventory.Data.ReportRepository>();
builder.Services.AddScoped<DeviceInventory.Data.IUserRepository, DeviceInventory.Data.UserRepository>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("http://localhost:8000")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");
app.UseAuthorization();

app.MapControllers();

app.Run();
