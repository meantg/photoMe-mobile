using System;

namespace photoMe_api.Models
{
    public class Notification : BaseModel
    {
        public Guid? SenderId { get; set; }
        public User Sender { get; set; }
        public Guid? ReceiverId { get; set; }
        public User Receiver { get; set; }
        public string NotiMessage { get; set; }
    }
}