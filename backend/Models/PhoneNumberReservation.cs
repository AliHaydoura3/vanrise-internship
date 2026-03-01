using System;

namespace DeviceInventory.Models
{
    public class PhoneNumberReservation
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public int PhoneNumberId { get; set; }
        /// <summary>Begin Effective Date — the date from which the reservation is active.</summary>
        public DateTime BED { get; set; }
        /// <summary>End Effective Date — null means the reservation has no end date.</summary>
        public DateTime? EED { get; set; }
    }
}
