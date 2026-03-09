using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Persistence.Factory;

public class DbConnectionFactory
{
    private readonly string _connectionString;

    public DbConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
                            ?? throw new ApplicationException();
    }

    public SqlConnection CreateConnection() => new SqlConnection(_connectionString);
}
