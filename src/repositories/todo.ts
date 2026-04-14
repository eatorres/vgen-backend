import type { Collection, Db } from 'mongodb';

import type { Todo } from '../schemas/todo.ts';

export default class TodoRepository {
    private readonly collection: Collection<Todo>;

    constructor(db: Db) {
        const { TODO_COLLECTION } = process.env;
        this.collection = db.collection(TODO_COLLECTION!);
    }

    async insertOne(todo: Todo) {
        return await this.collection.insertOne(todo);
    }
}
