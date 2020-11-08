using photoMe_api.Data;
using photoMe_api.Models;

namespace photoMe_api.Repositories
{
    public interface IPhotoShootRepository: IBaseRepository<PhotoShoot>{

    }
    public class PhotoShootRepository : BaseRepository<PhotoShoot>, IPhotoShootRepository
    {
        public PhotoShootRepository(AppDbContext context) : base(context)
        {
        }
    }
}