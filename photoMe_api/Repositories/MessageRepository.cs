using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using photoMe_api.Data;
using photoMe_api.Models;

namespace photoMe_api.Repositories
{
    public interface IMessageRepository : IBaseRepository<Message>
    {
        IEnumerable<Guid> GetListUserIdContact(Guid senderId);
        Task<IEnumerable<Message>> GetTalkMessage(Guid senderId, Guid receiverId);
    }
    public class MessageRepository : BaseRepository<Message>, IMessageRepository
    {
        public MessageRepository(AppDbContext context) : base(context) { }

        public IEnumerable<Guid> GetListUserIdContact(Guid senderId)
        {
            List<Message> listMessagesSender = context.Messages.Where(m => m.SenderId.Equals(senderId)).ToList();
            List<Message> listReceiverId = listMessagesSender.GroupBy(m => m.ReceiverId).Select(m => m.First()).ToList();

            List<Message> listMessagesReceiver = context.Messages.Where(m => m.ReceiverId.Equals(senderId)).ToList();
            List<Message> listSenderId = listMessagesReceiver.GroupBy(m => m.SenderId).Select(m => m.First()).ToList();

            var result = new List<Guid>();
            foreach (var item in listReceiverId)
            {
                result.Add((Guid)item.ReceiverId);
            }

            foreach (var item in listSenderId)
            {
                result.Add((Guid)item.SenderId);
            }

            return result.Distinct();
        }

        public async Task<IEnumerable<Message>> GetTalkMessage(Guid senderId, Guid receiverId)
        {
            return await this.dbSet.Where(
                m => (m.ReceiverId.Equals(receiverId) && m.SenderId.Equals(senderId)) || (m.ReceiverId.Equals(senderId) && m.SenderId.Equals(receiverId))
            ).ToListAsync();
        }
    }
}