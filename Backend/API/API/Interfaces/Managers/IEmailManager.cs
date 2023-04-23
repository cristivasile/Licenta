using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IEmailManager
    {
        Task SendEmail(string destAddress, string title, string body);
    }
}
