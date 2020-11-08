using System.Collections.Generic;

namespace photoMe_api.DTO
{
    public class PagedResultDto<T> where T : class
    {
        public int CurrentPage { get; set; }
        public int PageCount { get; set; }
        public int PageSize { get; set; }
        public int RowCount { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}