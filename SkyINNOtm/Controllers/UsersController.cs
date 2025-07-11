using Microsoft.AspNetCore.Mvc;
using SkyINNOtm.Data;
using SkyINNOtm.Dto;

namespace SkyINNOtm.Controllers
{
    [ApiController]
    [Route("api / [controller]")]
    public class UsersController : Controller
    {

        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]

        public ApiResponse GetAllUsers(string phonenumber)
        {
            ApiResponse response = new ApiResponse();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == phonenumber);

                if (user != null || !user.IsAdmin)
                {
                    response.Result = null;
                    response.Response = "Only Admin can access this.";
                    response.ResponseCode = "401";
                    return response;
                }

                else
                {
                    response.Result = user;
                    response.Response = "Record Fetched Successfully";
                    response.ResponseCode = "200";
                }
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = "Bad request" + ex.Message;
                response.ResponseCode = "400";

            }
            return response;
        }

        [HttpGet("balance")]
        //bro you can create your own other api response for balance maane ki tu apna khud ka balanace api response bhej sakta h 
        //jaha tu bas response me amount ka data bhejega. aur usko apne balance wale api me get karega abhi meri takkat nai h itna karne ki
        //islye pura get kar raha
        public ApiResponse GetBalance(string phonenumber)
        {
            ApiResponse response = new ApiResponse();

            try
            {
                var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == phonenumber);

                if (user == null )
                {
                    response.Result = null;
                    response.Response = "User not Found";
                    response.ResponseCode = "401";
                    return response;
                }

                else
                {
                    response.Result = user;
                    response.Response = "Record Fetched Successfully";
                    response.ResponseCode = "200";
                }
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = "Bad request" + ex.Message;
                response.ResponseCode = "400";

            }
            return response;
        }


        [HttpGet("basic-list")]

        public UserResponse GetBasicUserResponse()
        {
            UserResponse response = new UserResponse();
            try
            {
                var users = _context.Users
                    .Select(u => new CustomDto
                    {
                        UserId = u.UserId,
                        UserName = u.UserName,
                        PhoneNumber = u.PhoneNumber,

                    })
                    .ToList();

                response.Result = users;
                response.Response = "Balance Fetched Successfully";
                response.ResponseCode = "200";
                return response;
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = "Bad request" + ex.Message;
                response.ResponseCode = "400";
            }
            return response;
            }
        }
    }


