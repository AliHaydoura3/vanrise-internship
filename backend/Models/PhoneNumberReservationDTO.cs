using System;

namespace DeviceInventory.Models
{
    /// <summary>
    /// Read model returned by the list endpoint.
    /// Includes denormalized client name and phone number string for display.
    /// </summary>
    public class PhoneNumberReservationDTO
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public int PhoneNumberId { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        /// <summary>Begin Effective Date.</summary>
        public DateTime BED { get; set; }
        /// <summary>End Effective Date — null means open-ended.</summary>
        public DateTime? EED { get; set; }
    }
}
