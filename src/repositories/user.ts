import type { Collection, Db, WithId } from 'mongodb';

import type { User } from '../schemas/user.ts';

export default class UserRepository {
    private readonly collection: Collection<User>;

    constructor(db: Db) {
        const { USER_COLLECTION } = process.env;
        this.collection = db.collection(USER_COLLECTION!);
    }

    async findOneById(userID: string): Promise<WithId<User> | null> {
        return await this.collection.findOne({
            userID,
        });
    }

    async findOneByUsername(username: string): Promise<WithId<User> | null> {
        return await this.collection.findOne({
            username,
        });
    }

    async createIfNotExists(user: User): Promise<WithId<User> | null> {
        const result = await this.collection.findOneAndUpdate(
            {
                username: user.username,
            },
            {
                $setOnInsert: user,
                $set: {},
            },
            {
                collation: { locale: 'en', strength: 2 },
                upsert: true,
                returnDocument: 'after',
            },
        );

        return result;
    }
}
