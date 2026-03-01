namespace DeviceInventory.Models
{
    /// <summary>
    /// Report row returned by the "clients per type" report.
    /// </summary>
    public class ClientsPerTypeDTO
    {
        public int Type { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public int NoOfClients { get; set; }
    }
}
