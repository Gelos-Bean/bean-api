import request from 'supertest';
import express from 'express';
import Option from '../models/Option.js';
import Router from '../routes/router.js';

const app = express();
app.use(express.json());
Router(app);

describe('Options API Tests', () => {
    // POST tests
    describe('POST /add-option', () => {
        it('create a new option', async () => {
            const response = await request(app)
                .post('/add-option')
                .send({name: 'Spam',price: 3.50});
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe('Spam saved');
        });

        it('return 400 for invalid data', async () => {
            const response = await request(app).post('/add-option').send({});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    // GET tests
    describe('GET /options', () => {
        it('should return all options', async () => {
            await Option.create([
                { name: 'Option 1', price: 50 },
                { name: 'Option 2', price: 20 }
            ]);

            const response = await request(app).get('/options');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(2);
        });
    });

    describe('GET /options/:name', () => {
        beforeEach(async () => {
            await Option.create([
                { name: 'Apple', price: 1.50 },
                { name: 'Appletini', price: 2.50 },
                { name: 'Banana', price: 1.00 },
                { name: 'Mango-Apple', price: 3.00 },
                { name: 'Mango', price: 2.00 }
            ]);
        });
        it('should return all instances of search params', async () => {
            const response = await request(app).get('/options/apple');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(3);

            const names = response.body.msg.map(item => item.name.toLowerCase());
            expect(names).toContain('apple');
            expect(names).toContain('appletini');
            expect(names).toContain('mango-apple');
        });

        it('should be case insensitive', async () => {
            const response = await request(app).get('/options/APPLE');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(3);
        });
    
        it('should handle partial matches', async () => {
            const response = await request(app).get('/options/app');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(3);
        });
    
        it('should return empty array for non-existent option', async () => {
            const response = await request(app).get('/options/wrong');
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Option not found');
        });
    });

    // PUT tests
    describe('PUT /options/:id', () => {
        it('should update option', async () => {
            const option = await Option.create({name: 'Namo',price: 12.50});
            const response = await request(app)
                .put(`/options/${option._id}`)
                .send({name: 'Name',price: 12.00});
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`Name updated`);
        });

        it('should return 400 for invalid ID', async () => {
            const response = await request(app)
                .put('/options/wrongId')
                .send({name: 'Updated Name',price: 2.00});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    // DELETE tests
    describe('DELETE /options/:id', () => {
        it('should delete option', async () => {
            const option = await Option.create({name: 'Delete Me',price: 15.00});
            const response = await request(app).delete(`/options/${option._id}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`${option.name} deleted successfully`);
        });

        it('should return 400 for invalid ID', async () => {
            const response = await request(app).delete('/options/wrongId');
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });
});
