using SkyINNOtm.Dto;
using Microsoft.AspNetCore.Mvc;
using SkyINNOtm.Data;

using SkyINNOtm.Models;
using SkyINNOtm.DTO;
namespace Innotm_API_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WalletController : Controller
    {
        private readonly AppDbContext _context;
        public WalletController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public WalletResponse AddMoney(AddMoneyDto dto)
        {
            WalletResponse response = new WalletResponse();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == dto.phoneNumber);
                if (user == null)
                {
                    response.response = "User not found";
                    response.responseCode = "200";
                    response.amount = 0;
                    return response;
                }

                decimal initialAmount = user.Amount;
                user.Amount += dto.Amount;

                var transaction = new Transaction
                {
                    UserId = user.UserId,
                   RecieverId = user.UserId,
                    TransactionType = "Wallet",
                    TransactionDate = DateTime.UtcNow,
                    InitialAmount = initialAmount,
                    TransferAmount = dto.Amount
                };
                try
                {
                    _context.Transactions.Add(transaction);
                    _context.SaveChanges();

                    response.amount = user.Amount;
                    response.response = "Amount added succesfully!";
                    response.responseCode = "200";
                }
                catch (Exception ex)
                {
                    response.amount = 0;
                    response.response = "Bad Request !" + ex.Message;
                    response.responseCode = "400";
                }

            }
            catch (Exception ex)
            {
                response.amount = 0;
                response.response = "An error occured " + ex.Message;
                response.responseCode = "400";
            }
            return response;

        }
    }
}