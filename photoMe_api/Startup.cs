using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using photoMe_api.Data;
using photoMe_api.Helpers;
using photoMe_api.Hubs;
using photoMe_api.Repositories;
using photoMe_api.Services;

namespace photoMe_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                .AddNewtonsoftJson(opt =>
                {
                    opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    opt.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
                });

            services.AddCors();
            services.AddAutoMapper(typeof(UserRepository).Assembly);
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:SecretKey").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/chatsocket")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddScoped<IAlbumRepository, AlbumRepository>()
                .AddScoped<IUnitOfWork, UnitOfWork>()
                .AddScoped<IAuthRepository, AuthRepository>()
                .AddScoped<IConstantRepository, ConstantRepository>()
                .AddScoped<ILikeRepository, LikeRepository>()
                .AddScoped<IMessageRepository, MessageRepository>()
                .AddScoped<INotificationRepository, NotificationRepository>()
                .AddScoped<IPhotoRepository, PhotoRepository>()
                .AddScoped<IPhotoShootRepository, PhotoShootRepository>()
                .AddScoped<IReviewRepository, ReviewRepository>()
                .AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<IAlbumService, AlbumService>()
                .AddScoped<IAuthService, AuthService>()
                .AddScoped<IPhotoService, PhotoService>()
                .AddScoped<IUserService, UserService>()
                .AddScoped<IMessageService, MessageService>()
                .AddScoped<ILikeService, LikeService>()
                .AddScoped<IReviewService, ReviewService>();

            services.AddControllers();

            services.AddSwaggerGen();

            services.AddSingleton<IUserIdProvider, NameBaseUserIdProvider>();
            services.AddSignalR();

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder => builder.WithOrigins("http://localhost:4200")
                                                                   .AllowCredentials()
                                                                   .AllowAnyMethod()
                                                                   .AllowAnyHeader());
                options.AddPolicy("AllowAll", builder => builder.AllowAnyHeader()
                                                                   .AllowAnyOrigin()
                                                                   .AllowAnyMethod());
            });

            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));

            services.AddScoped<LogUserActivity>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = string.Empty;
            });

            app.UseCors("AllowAll");
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chatsocket");
            });
        }
    }
}