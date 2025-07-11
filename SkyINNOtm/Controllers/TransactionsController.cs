using Microsoft.AspNetCore.Mvc;
using SkyINNOtm.Data;
using SkyINNOtm.Dto;
using SkyINNOtm.Models;

namespace Innotm_API_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : Controller
    {
        private readonly AppDbContext _context;
        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("history")]
        public TransactionResponse GetHistory(string phoneNumber)
        {
            TransactionResponse response = new TransactionResponse();
            List<TransactionCustom> retlist = new List<TransactionCustom>();

            try
            {
                var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == phoneNumber);
                if (user == null)
                {
                    response.Result = null;
                    response.Response = "User not found";
                    response.ResponseCode = "200";
                    return response;
                }

                var sentTransactions = _context.Transactions
                    .Where(t => t.UserId == user.UserId)
                    .ToList();

                var receivedTransactions = _context.Transactions
                    .Where(t => t.RecieverId == user.UserId)
                    .ToList();

                // Add Sent transactions
                foreach (var transaction in sentTransactions)
                {
                    var receiver = _context.Users.FirstOrDefault(rec => rec.UserId == transaction.RecieverId);

                    retlist.Add(new TransactionCustom
                    {
                        TransactionId = transaction.TransactionId,
                        UserId = transaction.UserId,
                        ReceiverId = transaction.RecieverId,
                        ReceiverName = receiver?.UserName ?? "Unknown",
                        ReceiverPhoneNumber = receiver?.PhoneNumber ?? "N/A",
                        TransactionType = "debit", // Sent
                        TransactionDate = transaction.TransactionDate,
                        InitialAmount = transaction.InitialAmount,
                        TransferAmount = transaction.TransferAmount
                    });
                }

                // Add Received transactions
                foreach (var transaction in receivedTransactions)
                {
                    var sender = _context.Users.FirstOrDefault(sender => sender.UserId == transaction.UserId);

                    retlist.Add(new TransactionCustom
                    {
                        TransactionId = transaction.TransactionId,
                        UserId = transaction.UserId,
                        ReceiverId = transaction.RecieverId,
                        ReceiverName = sender?.UserName ?? "Unknown",
                        ReceiverPhoneNumber = sender?.PhoneNumber ?? "N/A",
                        TransactionType = "credit", // Received
                        TransactionDate = transaction.TransactionDate,
                        InitialAmount = transaction.InitialAmount,
                        TransferAmount = transaction.TransferAmount
                    });
                }

                // Sort by date descending
                response.Result = retlist.OrderByDescending(t => t.TransactionDate).ToList();
                response.Response = "Successfully fetched history";
                response.ResponseCode = "200";
                return response;
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = ex.Message;
                response.ResponseCode = "400";
                return response;
            }
        }

        [HttpPost("pay")]
        public ApiResponse MakePayment(PayMoneyDto dto)
        {
            ApiResponse response = new ApiResponse();
            try
            {
                var sender = _context.Users.FirstOrDefault(u => u.PhoneNumber == dto.senderPhoneNumber);
                if (sender == null)
                {
                    response.Result = null;
                    response.Response = "User not found";
                    response.ResponseCode = "200";
                    return response;
                }
                var receiver = _context.Users.FirstOrDefault(u => u.PhoneNumber == dto.receiverPhoneNumber);
                if (receiver == null)
                {
                    response.Result = null;
                    response.Response = "Receiver not found";
                    response.ResponseCode = "200";
                    return response;
                }
                if (sender.Amount < dto.Amount)
                {
                    response.Result = null;
                    response.Response = "Insufficient balance";
                    response.ResponseCode = "200";
                    return response;
                }
                decimal senderinitial = sender.Amount;
                decimal receiverinitial = receiver.Amount;
                sender.Amount -= dto.Amount;
                receiver.Amount += dto.Amount;
                var senderTransaction = new Transaction
                {
                    UserId = sender.UserId,
                    RecieverId = receiver.UserId,
                    TransactionType = "Debit",
                    TransactionDate = DateTime.UtcNow,
                    InitialAmount = senderinitial,
                    TransferAmount = dto.Amount
                };
                var receiverTransaction = new Transaction
                {
                    UserId = receiver.UserId,
                    RecieverId = sender.UserId,
                    TransactionType = "Credit",
                    TransactionDate = DateTime.UtcNow,
                    InitialAmount = receiverinitial,
                    TransferAmount = dto.Amount
                };
                _context.Transactions.Add(senderTransaction);
                _context.Transactions.Add(receiverTransaction);
                _context.SaveChanges();
                response.Result = null;

                response.Response = "Payment successful";
                response.ResponseCode = "200";
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = "An error occurred: " + ex.Message;
                response.ResponseCode = "400";
            }
            return response;
        }

        [HttpDelete("DeleteTransactionById")]

        public TransactionResponse DeleteTransactionById(int Tid)
        {
            TransactionResponse response = new TransactionResponse();
            try
            {
                var transaction = _context.Transactions.FirstOrDefault(t => t.TransactionId == Tid);
                _context.Transactions.RemoveRange(transaction);
                _context.SaveChanges();
                response.Result = null;
                response.Response = "Transaction deleted successfully";
                response.ResponseCode = "200";
                return response;
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = "An error occurred: " + ex.Message;
                response.ResponseCode = "400";
            }
            return response;
        }

        [HttpDelete("DeleteHistory")]

        public TransactionResponse DeleteHistory(string phoneNumber)
        {
            TransactionResponse response = new TransactionResponse();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == phoneNumber);
                if (user == null)
                {
                    response.Result = null;
                    response.Response = "User not found";
                    response.ResponseCode = "200";
                    return response;
                }
                var transactions = _context.Transactions.Where(t => t.UserId == user.UserId);
                _context.Transactions.RemoveRange(transactions);
                _context.SaveChanges();
                response.Result = null;
                response.Response = "All transactions deleted successfully";
                response.ResponseCode = "200";
                return response;
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = ex.Message;
                response.ResponseCode = "400";
            }
            return response;
        }
    }
}