using System.Collections.Generic;
using DeviceInventory.Models;

namespace DeviceInventory.Data
{
    public interface IDeviceRepository
    {
        IEnumerable<Device> GetDevices(string? name = null);
        Device? GetDevice(int id);
        Device CreateDevice(Device device);
        bool UpdateDevice(int id, Device device);
        bool DeleteDevice(int id);
    }
}
