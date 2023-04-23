using API.Models.Input;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IBodyTypeManager
    {
        Task Create(BodyTypeCreateModel newBodyType);
        Task<List<string>> GetAll();
        Task Delete(string bodyTypeName);
    }
}
