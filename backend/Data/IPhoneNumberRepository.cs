using DeviceInventory.Models;
using System.Collections.Generic;

namespace DeviceInventory.Data
{
    public interface IPhoneNumberRepository
    {
        IEnumerable<PhoneNumberDTO> GetPhoneNumbers(string? number = null, int? deviceId = null);
        PhoneNumber? GetPhoneNumber(int id);
        PhoneNumber CreatePhoneNumber(PhoneNumber phoneNumber);
        bool UpdatePhoneNumber(int id, PhoneNumber phoneNumber);
        bool DeletePhoneNumber(int id);
    }
}
