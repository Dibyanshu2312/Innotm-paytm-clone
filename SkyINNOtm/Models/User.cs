

namespace SkyINNOtm.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Gender { get; set; }

        public string Password { get; set; }

        public decimal Amount { get; set; }

        public string ImageUrl { get; set; }

        public DateTime CreateDate { get; set; } = DateTime.UtcNow;

        public bool IsAdmin { get; set; } = false;

    }
}
