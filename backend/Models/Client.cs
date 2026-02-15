using System;

namespace DeviceInventory.Models
{
    public enum ClientType
    {
        Individual = 0,
        Organization = 1
    }

    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ClientType Type { get; set; }
        public DateTime? BirthDate { get; set; }
    }
}
