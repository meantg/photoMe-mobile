using System;
using AutoMapper;
using photoMe_api.DTO;
using photoMe_api.DTO.ReviewDto;
using photoMe_api.Models;

namespace photoMe_api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                    .ForMember(dest => dest.PhotoUrl, opt => opt
                    .MapFrom(src => src.Avatar.Url))
                    .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<UserRegisterDto, User>();
            CreateMap<UserLoginDto, User>();
            CreateMap<User, UserLoginDto>();
            CreateMap<UserForDetailDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<AlbumForCreationDto, Album>();
            CreateMap<User, UserForDetailDto>().ForMember(dest => dest.Albums, opt => opt.MapFrom(src => src.PhotographerAlbums));
            CreateMap<Album, AlbumForListDto>().ForMember(dest => dest.Photographer, opt => opt.MapFrom(src => src.Photographer));
            CreateMap<Review, ReviewForListDto>();
        }
    }
}