using System.Net;

namespace ApiPeliculas.Tools
{
    //Esta es la estructura de lo que va a devolver la API

    public class RespuestaApi<T>
    {
        public HttpStatusCode StatusCode { get; set; }
        public bool IsSuccess { get; set; } = true;
        public List<string> ErrorMessages { get; set; } = new();
        public T Result { get; set; }

        public static RespuestaApi<T> Success(T result, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            return new RespuestaApi<T> { Result = result, StatusCode = statusCode };
        }

        public static RespuestaApi<T> Error(List<string> messages, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            return new RespuestaApi<T>
            {
                IsSuccess = false,
                ErrorMessages = messages,
                StatusCode = statusCode
            };
        }
   
    }
}
