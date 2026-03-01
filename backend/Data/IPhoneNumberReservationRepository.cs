using DeviceInventory.Models;
using System.Collections.Generic;

namespace DeviceInventory.Data
{
    public interface IPhoneNumberReservationRepository
    {
        IEnumerable<PhoneNumberReservationDTO> GetReservations(int? clientId = null, int? phoneNumberId = null);

        /// <summary>Returns reservations that are currently effective (BED &lt; NOW &lt; EED or EED IS NULL).</summary>
        IEnumerable<PhoneNumberReservationDTO> GetActiveReservations(int? clientId = null);

        /// <summary>Creates a new reservation and returns it with the generated Id.</summary>
        PhoneNumberReservation AddReservation(PhoneNumberReservation reservation);

        /// <summary>Sets EED = NOW on the active reservation for the given client+phone number pair.</summary>
        bool UnreservePhoneNumber(int clientId, int phoneNumberId);

        bool DeleteReservation(int id);
    }
}
