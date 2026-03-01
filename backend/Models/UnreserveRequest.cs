namespace DeviceInventory.Models
{
    /// <summary>
    /// Request body for the unreserve endpoint.
    /// </summary>
    public class UnreserveRequest
    {
        public int ClientId { get; set; }
        public int PhoneNumberId { get; set; }
    }
}
