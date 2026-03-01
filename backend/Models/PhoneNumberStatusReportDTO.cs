namespace DeviceInventory.Models
{
    /// <summary>
    /// Report row returned by the "phone number status per device" report.
    /// Status is "Reserved" or "Unreserved".
    /// </summary>
    public class PhoneNumberStatusReportDTO
    {
        public int DeviceId { get; set; }
        public string DeviceName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int NoOfPhoneNumbers { get; set; }
    }
}
