using Microsoft.AspNetCore.Mvc;
using SkyINNOtm.Data;
using SkyINNOtm.Models;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace SkyINNOtm.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public ChatController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpGet("ask")]
        public async Task<IActionResult> Ask([FromQuery] string question, [FromQuery] string PhoneNumber)
        {
            if (string.IsNullOrWhiteSpace(question))
                return BadRequest("Question is required.");

            if (string.IsNullOrWhiteSpace(PhoneNumber))
                return BadRequest("Phone number is required.");

            if (!Regex.IsMatch(PhoneNumber, @"^\d{10}$"))
                return BadRequest("Phone number must be exactly 10 digits.");

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == PhoneNumber);
                if (user == null)
                    return NotFound("User not found.");

                string systemReply = "";
                var normalized = question.ToLower().Trim();
                decimal amountToTransfer = 0;
                string recipientPhone = null;
                string recipientUsername = null;

                if (normalized.Contains("transfer") || normalized.Contains("send") || Regex.IsMatch(normalized, @"भेजो|भेजिए"))
                {
                    var phoneMatch = Regex.Match(normalized, @"(?:transfer|send|भेजो|भेजिए)\D*?(\d+(?:\.\d{1,2})?)\D*?(\d{10})");
                    var userMatch = Regex.Match(normalized, @"(?:transfer|send|भेजो|भेजिए)\D*?(\d+(?:\.\d{1,2})?)\D*?to\s+([a-zA-Z0-9_]+)", RegexOptions.IgnoreCase);

                    if (phoneMatch.Success)
                    {
                        if (!decimal.TryParse(phoneMatch.Groups[1].Value, out amountToTransfer))
                            return BadRequest("Invalid amount format.");
                        recipientPhone = phoneMatch.Groups[2].Value;
                    }
                    else if (userMatch.Success)
                    {
                        if (!decimal.TryParse(userMatch.Groups[1].Value, out amountToTransfer))
                            return BadRequest("Invalid amount format.");
                        recipientUsername = userMatch.Groups[2].Value;
                    }
                    else
                    {
                        return BadRequest("Invalid transfer format. Use 'transfer <amount> <phone>' or 'transfer <amount> to <username>'.");
                    }

                    if (amountToTransfer <= 0)
                        return BadRequest("Amount must be greater than zero.");

                    if (amountToTransfer > 100000)
                        return BadRequest("Transfer amount exceeds ₹100,000.");

                    if (user.Amount < amountToTransfer)
                        return BadRequest($"Insufficient balance. Available balance: ₹{user.Amount:F2}");

                    User recipient = null;
                    if (!string.IsNullOrEmpty(recipientPhone))
                        recipient = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == recipientPhone);
                    else if (!string.IsNullOrEmpty(recipientUsername))
                        recipient = await _context.Users.FirstOrDefaultAsync(u => u.UserName.ToLower() == recipientUsername.ToLower());

                    if (recipient == null)
                        return NotFound("Recipient not found.");

                    if (recipient.UserId == user.UserId)
                        return BadRequest("Cannot transfer money to yourself.");

                    using var dbTransaction = await _context.Database.BeginTransactionAsync();
                    try
                    {
                        user.Amount -= amountToTransfer;
                        recipient.Amount += amountToTransfer;

                        _context.Transactions.Add(new Transaction
                        {
                            UserId = user.UserId,
                            RecieverId = recipient.UserId,
                            TransactionType = "Debit",
                            TransactionDate = DateTime.UtcNow,
                            InitialAmount = user.Amount + amountToTransfer,
                            TransferAmount = amountToTransfer
                        });

                        _context.Transactions.Add(new Transaction
                        {
                            UserId = recipient.UserId,
                            RecieverId = user.UserId,
                            TransactionType = "Credit",
                            TransactionDate = DateTime.UtcNow,
                            InitialAmount = recipient.Amount - amountToTransfer,
                            TransferAmount = amountToTransfer
                        });

                        await _context.SaveChangesAsync();
                        await dbTransaction.CommitAsync();

                        systemReply = $"₹{amountToTransfer:F2} transferred to {recipient.UserName} successfully.";
                    }
                    catch
                    {
                        await dbTransaction.RollbackAsync();
                        return StatusCode(500, "Transaction failed.");
                    }
                }

                var userInfoJson = JsonSerializer.Serialize(new
                {
                    user.UserName,
                    user.PhoneNumber,
                    AmountInRupees = $"₹{user.Amount:F2}"
                });

                bool isHindi = Regex.IsMatch(question, @"[\p{IsDevanagari}]+")
                    || question.Contains("बैलेंस") || question.Contains("भेजो")
                    || question.Contains("भुगतान") || question.Contains("पैसे");

                string langInstruction = isHindi
                    ? "आपसे अनुरोध है कि उत्तर केवल हिंदी में दें। स्पष्ट और औपचारिक भाषा का उपयोग करें।"
                    : "Please respond in English only. Be clear and helpful.";

                var apiKey = _config["DeepSeek:ApiKey"];
                var endpoint = "https://openrouter.ai/api/v1/chat/completions";
                var model = "deepseek/deepseek-chat";

                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://skyinnotm.com");
                httpClient.DefaultRequestHeaders.Add("X-Title", "SkyINNOtm");

                var payload = new
                {
                    model,
                    messages = new[]
                    {
                        new { role = "system", content = $"You are a helpful banking assistant. {langInstruction}" },
                        new { role = "user", content = $"User asked: {question}\nUser Info: {userInfoJson}\nSystem Reply: {systemReply}" }
                    },
                    temperature = 0.7,
                    max_tokens = 500
                };

                var response = await httpClient.PostAsync(endpoint,
                    new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, new { error = errorContent });
                }

                var result = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
                var chatbotReply = result.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

                return Ok(new
                {
                    Response = chatbotReply?.Trim(),
                    UserBalance = $"₹{user.Amount:F2}",
                    TransactionCompleted = !string.IsNullOrEmpty(systemReply)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
