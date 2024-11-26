import request from 'supertest';
import express from 'express';
import Table from '../models/Table.js';
import SalesHistory from '../models/SalesHistory.js';
import Router from '../routes/router.js';

const app = express();
app.use(express.json());
Router(app);

describe('Tables API Tests', () => {

    describe('POST /add-table', () => {
        it('creates a new table', async () => {
            const response = await request(app)
                .post('/add-table')
                .send({tableNo: 1,pax: 4,total: 0});
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe('Table 1 created');
        });

        it('returns 409 if table already exists', async () => {
            await Table.create({ tableNo: 2, pax: 4, total: 0 });

            const response = await request(app)
                .post('/add-table')
                .send({tableNo: 2,pax: 4,total: 0});
            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Table 2 already exists');
        });

        it('returns 400 for missing fields', async () => {
            const response = await request(app)
                .post('/add-table')
                .send({tableNo: 3});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /tables', () => {
        beforeEach(async () => {
            await Table.create({ tableNo: 1, pax: 4, total: 10 });
            await Table.create({ tableNo: 2, pax: 2, total: 20 });
        });

        it('retrieves all tables', async () => {
            const response = await request(app).get('/tables');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(2);
        });

        it('still return success if no tables open', async () => {
            await Table.deleteMany({});
            const response = await request(app).get('/tables');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('GET /tables/:tableNo', () => {
        it('retrieves a table by table number', async () => {
            const table = await Table.create({ tableNo: 1, pax: 4, total: 10 });
            const response = await request(app).get(`/tables/${table.tableNo}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg.tableNo).toBe(table.tableNo);
        });

        it('returns 404 if table is not found', async () => {
            const response = await request(app).get('/tables/99');
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Table not found');
        });

        it('returns 400 for invalid table number', async () => {
            const response = await request(app).get('/tables/invalid');
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Not a number');
        });
    });

    describe('PUT /tables/:id', () => {
        it('updates a table', async () => {
            const table = await Table.create({ tableNo: 1, pax: 4, total: 10 });
            const response = await request(app).put(`/tables/${table._id}`).send({ pax: 6 });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`Table ${table.tableNo} updated`);

            const updatedTable = await Table.findById(table._id);
            expect(updatedTable.pax).toBe(6);
        });

        it('returns 400 if table not found', async () => {
            const response = await request(app).put('/tables/invalidId').send({ pax: 6 });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Table not found');
        });
    });

    describe('DELETE /tables/:id', () => {
        it('deletes a table and adds to sales history', async () => {
            const table = await Table.create({ tableNo: 1, pax: 4, total: 10 });
    
            const date = new Date().toLocaleString('en-AU', { year: 'numeric', month: '2-digit', day: '2-digit' });
            let salesHistory = new SalesHistory({ date: date, sales: table, totalFood: 0, totalBev: 0, total: 0 });
            await salesHistory.save();
        
            salesHistory = await SalesHistory.findOne({ date: date });
            expect(salesHistory.sales).toHaveLength(1);
            expect(salesHistory.sales[0].tableNo).toBe(table.tableNo);
            
            const response = await request(app).delete(`/tables/${table._id}`);         
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`Table ${table.tableNo} deleted successfully`);
    
            const deletedTable = await Table.findById(table._id);
            expect(deletedTable).toBeNull();
        });
    
        it('returns 400 if table not found', async () => {
            const response = await request(app).delete('/tables/invalidId');
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Table not found');
        });
    });
    
});
