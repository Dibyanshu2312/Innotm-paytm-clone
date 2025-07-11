using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using SkyINNOtm.Data;
using SkyINNOtm.Dto;
using SkyINNOtm.Models;

namespace SkyINNOtm.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Auth : Controller
    {
        private readonly AppDbContext _context;

        public Auth(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("Register")]
        public ApiResponse Register(RegisterDto dto)
        {
            ApiResponse response = new ApiResponse();

            try
            {
                if (_context.Users.Any(u => u.PhoneNumber == dto.PhoneNumber))
                {
                    response.Result = null;
                    response.ResponseCode = "200";
                    response.Response = "This Phone Number is Already exist please login";
                    return response; 
                }

                var user = new User
                {
                    UserName = dto.Username,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    Gender = dto.Gender,
                    Password = dto.Password,
                    ImageUrl = "", // or any valid placeholder image URL
                    Amount = 0,
                    IsAdmin = false

                };

                _context.Users.Add(user);
                _context.SaveChanges();

                response.Result = user;
                response.Response = "Registered Successfully";
                response.ResponseCode = "200";
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = "Bad request: " + ex.Message;
                response.ResponseCode = "400";
            }

            return response;
        }

        [HttpPost("Login")]
        public ApiResponse2 Login(LoginDto dto)
        {
            ApiResponse2 response = new ApiResponse2();

            try
            {
                var user = _context.Users
                    .Where(u => u.PhoneNumber == dto.PhoneNumber && u.Password == dto.Password)
                    .Select(u => new
                    {
                        userId = u.UserId,
                        username = u.UserName,
                        email = u.Email,
                        phoneNumber = u.PhoneNumber,
                        gender = u.Gender,
                        password = u.Password,
                        amount = 0,
                        imageUrl = u.ImageUrl,
                        createDate = u.CreateDate,
                        isAdmin = false,
                    })
                    .FirstOrDefault();

                if (user != null)
                {
                    response.Result = user;
                    response.Response = "Login Successfully !!";
                    response.ResponseCode = "200";
                }
                else
                {
                    response.Result = null;
                    response.Response = "Invalid phone number or password";
                    response.ResponseCode = "401";
                }
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.Response = "Bad request: " + ex.Message;
                response.ResponseCode = "400";
            }

            return response;
        }
    } 
}    
