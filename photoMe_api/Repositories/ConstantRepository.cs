using photoMe_api.Data;
using photoMe_api.Models;

namespace photoMe_api.Repositories
{
    public interface IConstantRepository : IBaseRepository<Constant> {
        
    }
    public class ConstantRepository : BaseRepository<Constant>, IConstantRepository
    {
        public ConstantRepository(AppDbContext context) : base(context)
        {
        }
    }
}