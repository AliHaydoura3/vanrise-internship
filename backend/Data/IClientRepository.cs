using System.Collections.Generic;
using DeviceInventory.Models;

namespace DeviceInventory.Data
{
    public interface IClientRepository
    {
        IEnumerable<Client> GetClients(string? name = null, int? type = null);
        Client? GetClient(int id);
        Client CreateClient(Client client);
        bool UpdateClient(int id, Client client);
        bool DeleteClient(int id);
    }
}
