﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Common.Interfaces;
using Core.Common.SharedDataObjects;
using MongoDB.Driver;

namespace Core.Common.Mongo
{
    public class DataRepository<TEntity> : IDataRepository<TEntity> where TEntity : IIdentifiable
    {
        protected IMongoCollection<TEntity> Collection { get; }

        public DataRepository(IMongoDbConfig mongoConfig)
        {
            var client = new MongoClient(mongoConfig.ConnectionString);
            var database = client.GetDatabase(mongoConfig.Database);

            Collection = database.GetCollection<TEntity>(mongoConfig.Collection);
        }

        public async Task<TEntity> GetAsync(Guid id)
            => await GetAsync(e => e.Id == id);

        public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> predicate)
            => await Collection.Find(predicate).SingleOrDefaultAsync();

        public async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
            => await Collection.Find(predicate).ToListAsync();

        public async Task<IEnumerable<TEntity>> GetAllAsync()
            => await Collection.Find(x => true).ToListAsync();
        
        public async Task<IEnumerable<TEntity>> GetAllDocsSpecificFieldsOnlyAsync(List<string> fieldsToInclude)
        {
            ProjectionDefinition<TEntity> projection = Builders<TEntity>.Projection.Exclude("_id");

            List<ProjectionDefinition<TEntity>> allProjections = new List<ProjectionDefinition<TEntity>>();
            fieldsToInclude.ForEach(f =>
            {
                allProjections.Add(Builders<TEntity>.Projection.Include(f));
            });
            ProjectionDefinition<TEntity> projectionMain = Builders<TEntity>.Projection.Combine(allProjections.ToArray());
            return await Collection.Find(x => true).Project<TEntity>(projectionMain).ToListAsync();
        }

        public async Task AddAsync(TEntity entity)
            => await Collection.InsertOneAsync(entity);

        public async Task UpdateAsync(TEntity entity)
            => await Collection.ReplaceOneAsync(e => e.Id == entity.Id, entity);

        public async Task DeleteAsync(Expression<Func<TEntity, bool>> predicate)
            => await Collection.DeleteOneAsync(predicate);

        public async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate)
            => await Collection.Find(predicate).AnyAsync();
    }
}
