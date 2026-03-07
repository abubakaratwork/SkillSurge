using System.Security.Cryptography;

namespace Services.Helpers;

public class PasswordHashHandler
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100_000;

    public string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password cannot be empty.", nameof(password));

        Span<byte> salt = stackalloc byte[SaltSize];
        RandomNumberGenerator.Fill(salt);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt.ToArray(), Iterations, HashAlgorithmName.SHA256);

        byte[] hash = pbkdf2.GetBytes(HashSize);
        byte[] hashBytes = new byte[sizeof(int) + SaltSize + HashSize];

        Buffer.BlockCopy(BitConverter.GetBytes(Iterations), 0, hashBytes, 0, sizeof(int));
        Buffer.BlockCopy(salt.ToArray(), 0, hashBytes, sizeof(int), SaltSize);
        Buffer.BlockCopy(hash, 0, hashBytes, sizeof(int) + SaltSize, HashSize);

        return Convert.ToBase64String(hashBytes);
    }

    public bool VerifyPassword(string password, string storedHash)
    {
        if (string.IsNullOrWhiteSpace(password))
            return false;

        byte[] hashBytes;

        try
        {
            hashBytes = Convert.FromBase64String(storedHash);
        }
        catch
        {
            return false;
        }

        int iterations = BitConverter.ToInt32(hashBytes, 0);

        byte[] salt = new byte[SaltSize];
        Buffer.BlockCopy(hashBytes, sizeof(int), salt, 0, SaltSize);

        byte[] storedHashBytes = new byte[HashSize];
        Buffer.BlockCopy(hashBytes, sizeof(int) + SaltSize, storedHashBytes, 0, HashSize);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);

        byte[] computedHash = pbkdf2.GetBytes(HashSize);

        return CryptographicOperations.FixedTimeEquals(storedHashBytes, computedHash);
    }
}