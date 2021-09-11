using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Core.Common.Interfaces
{
    public interface IIdentifiable
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public Guid Id { get; }
    }
}