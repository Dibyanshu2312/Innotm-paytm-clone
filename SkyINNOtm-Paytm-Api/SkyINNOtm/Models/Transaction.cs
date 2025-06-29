using System.Security.Cryptography.X509Certificates;

namespace SkyINNOtm.Models
{
    public class Transaction
    {
        public int TransactionId { get; set; }
        public int UserId { get; set; }

        public int RecieverId { get; set; } 

        public string TransactionType { get; set; } 

        public DateTime TransactionDate= DateTime.UtcNow;

        public decimal InitialAmount { get; set; }
        
        public decimal TransferAmount { get; set; }

    }
}
