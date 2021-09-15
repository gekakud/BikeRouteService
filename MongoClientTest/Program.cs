using MongoDB.Driver;
using System;

namespace MongoClientTest
{
    class Program
    {
        static void Main(string[] args)
        {
            var t = new Tester();
            t.Test();
            Console.WriteLine("Hello World!");
        }
    }

    class Tester
    {
        public void Test()
        {
            var settings = MongoClientSettings.FromConnectionString("mongodb+srv://AdminUser:Admin1234@cluster0.8l0uu.mongodb.net/routes_db?retryWrites=true&w=majority");
            var client = new MongoClient(settings);
            var database = client.GetDatabase("routes_db");
            var tt = client.ListDatabaseNames().ToList();

            foreach(var dec in tt)
            {
                Console.WriteLine(dec);
            }
        }
    }
}
