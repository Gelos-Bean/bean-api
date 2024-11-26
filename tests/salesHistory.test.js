import request from 'supertest';
import express from 'express';
import Product from '../models/Product.js';
import SalesHistory from '../models/SalesHistory.js';
import Router from '../routes/router.js';

const app = express();
app.use(express.json());
Router(app);

describe('SalesHistory Router', () => {
    const options = { timeZone: 'Australia/Sydney', year: 'numeric', month: 'numeric', day: 'numeric' };
    let salesHistory;
    let newDate;

    beforeAll(() => {
        newDate = new Date().toLocaleDateString('en-AU', options).split('/').reverse().join('-');
    });

    beforeEach(async () => {
        await SalesHistory.deleteMany({});
        salesHistory = await SalesHistory.create({
            date: newDate,
            sales: [],
            totalFood: 0,
            totalBev: 0,
            total: 0,
        });
    });

    describe('GET /today', () => {
        it('should return sales report for today if it exists', async () => {
            const response = await request(app).get('/reports/today');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveProperty('date', newDate);
            expect(response.body.newReport).toBe(false);
        });
        
        it('should create a new empty sales report if none exists for today', async () => {
            await SalesHistory.deleteMany({});
            const response = await request(app).get('/reports/today');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toMatch(`New empty sales reported created for ${newDate}`);
            expect(response.body.newReport).toBe(true);
        });
    });

    
    describe('GET /', () => {
        it('should return all sales reports', async () => {
            const response = await request(app).get('/reports');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBeInstanceOf(Array);
        });

        it('should return 400 if no sales reports are found', async () => {
            await SalesHistory.deleteMany({});
            const response = await request(app).get('/reports');
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('No sales reports found');
        });
    });

    describe('GET /:date', () => {
        it('should return the sales report for a specific date', async () => {
            await SalesHistory.create({
                date: "2024-11-20",
                sales: [],
                totalFood: 0,
                totalBev: 0,
                total: 0,
            });
            const response = await request(app).get(`/reports/2024-11-20`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveProperty('date', "2024-11-20");
        });

        it('should return 404 if no sales report exists for the date', async () => {
            const response = await request(app).get('/reports/2023-01-01');
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('No reports found for the given date.');
        });
    });


    describe('PUT /:id', () => {
        it('should update a sales report with new sales data', async () => {
            const products = await await Product.create([
                { name: 'Fries', price: 5.00, course: 'Side' },
                { name: 'Cheeseburger', price: 12.50, course: 'Main' },
                { name: 'Caesar Salad', price: 8.00, course: 'Starter' },
            ]);

            const sale = {tableNo: 1, pax: 2,
                products: [
                    {item: products[0], quantity: 2}, 
                    {item: products[1], quantity: 1},
                    {item: products[2], quantity: 4},
                ],
                total: 54.50}

            const response = await request(app).put(`/reports/${salesHistory._id}`).send({ sales: sale });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe('Sale added successfully and totals updated.');
            expect(response.body.report.total).toBe(54.50);
        });

        it('should return 400 if no sale data is provided', async () => {
            const response = await request(app).put(`/reports/${salesHistory._id}`).send({});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('No sale data provided.');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a sales report', async () => {
            const response = await request(app).delete(`/reports/${salesHistory._id}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`Sales report for ${salesHistory.date.split('T')[0]} deleted successfully`)
        });

        it('should return 400 if the sales report ID is invalid', async () => {
            const date = new Date();
            const response = await request(app).delete(`/reports/${date}`);
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Sales report not found');
        });
    });
});
