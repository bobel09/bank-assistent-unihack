// controllers/spendingController.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function getAllMccCodes() {
    const { data, error } = await supabase
        .from('mcc_codes')
        .select('id, mcc_code, category');

    if (error) {
        console.error('Eroare la obținerea MCC codurilor:', error);
        return null;
    }

    return data;
}

async function getTotalSpentHandler(req, res) {
    try {
        const {dataStart, dataEnd, mccCode, merchant } = req.body;
        const uid = req.user.uid

        // Validăm datele de intrare
        if (!uid || !dataStart || !dataEnd) {
            return res.status(400).json({
                success: false,
                error: 'Parametrii uid, dataStart și dataEnd sunt obligatorii'
            });
        }

        let query = supabase
            .from('transactions')
            .select('amount')
            .eq('uid', uid)
            .gte('date', dataStart)
            .lte('date', dataEnd);

        // Adăugăm filtrul pentru mccCode dacă există
        if (mccCode) {
            query = query.eq('mcc_code', mccCode);
        }

        // Adăugăm filtrul pentru merchant dacă există
        if (merchant) {
            query = query.ilike('merchant', `%${merchant}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                success: false,
                error: 'Eroare la interogarea bazei de date'
            });
        }

        if (!data || data.length === 0) {
            return res.json({
                success: true,
                total: 0,
                currency: 'RON',
                period: {
                    start: dataStart,
                    end: dataEnd
                },
                filters: {
                    mccCode: mccCode || 'all',
                    merchant: merchant || 'all'
                }
            });
        }

        const total = data.reduce((sum, transaction) => sum + transaction.amount, 0);

        return res.json({
            success: true,
            total: total,
            currency: 'RON',
            period: {
                start: dataStart,
                end: dataEnd
            },
            filters: {
                mccCode: mccCode || 'all',
                merchant: merchant || 'all'
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            error: 'Eroare internă server'
        });
    }
}


async function compareSpendingHandler(req, res) {
    try {
        const { ds1, de1, ds2, de2, mccCode, merchant } = req.body;
        const uid = req.user.uid;

        if (!uid || !ds1 || !de1 || !ds2 || !de2) {
            return res.status(400).json({ success: false, error: 'Parametrii ds1, de1, ds2, și de2 sunt obligatorii' });
        }

        const getSpendingForPeriod = async (start, end) => {
            let query = supabase
                .from('transactions')
                .select('amount')
                .eq('uid', uid)
                .gte('date', start)
                .lte('date', end);

            if (mccCode) query = query.eq('mcc_code', mccCode);
            if (merchant) query = query.ilike('merchant', `%${merchant}%`);

            const { data, error } = await query;
            if (error) throw error;
            return data.reduce((sum, transaction) => sum + transaction.amount, 0);
        };

        const spendingPeriod1 = await getSpendingForPeriod(ds1, de1);
        const spendingPeriod2 = await getSpendingForPeriod(ds2, de2);

        return res.json({
            success: true,
            period1: { start: ds1, end: de1, total: spendingPeriod1 },
            period2: { start: ds2, end: de2, total: spendingPeriod2 },
            difference: spendingPeriod2 - spendingPeriod1
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ success: false, error: 'Eroare internă server' });
    }
}

async function averageSpendingHandler(req, res) {
    try {
        const { dataStart, dataEnd, mccCode, merchant } = req.body;
        const uid = req.user.uid;

        if (!uid || !dataStart || !dataEnd) {
            return res.status(400).json({ success: false, error: 'Parametrii dataStart și dataEnd sunt obligatorii' });
        }

        let query = supabase
            .from('transactions')
            .select('amount')
            .eq('uid', uid)
            .gte('date', dataStart)
            .lte('date', dataEnd);

        if (mccCode) query = query.eq('mcc_code', mccCode);
        if (merchant) query = query.ilike('merchant', `%${merchant}%`);

        const { data, error } = await query;
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, error: 'Eroare la interogarea bazei de date' });
        }

        const totalSpending = data.reduce((sum, transaction) => sum + transaction.amount, 0);
        const averageSpending = totalSpending / data.length;

        return res.json({
            success: true,
            average: averageSpending,
            currency: 'RON',
            period: { start: dataStart, end: dataEnd }
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ success: false, error: 'Eroare internă server' });
    }
}

async function monthWithHighestSpendingHandler(req, res) {
    try {
        const uid = req.user.uid;

        let query = supabase
            .from('transactions')
            .select('amount, date')
            .eq('uid', uid);

        const { data, error } = await query;
        if (error) throw error;

        const monthlySpending = {};

        data.forEach(transaction => {
            const month = transaction.date.slice(0, 7);
            monthlySpending[month] = (monthlySpending[month] || 0) + transaction.amount;
        });

        const [highestSpendingMonth, highestSpendingAmount] = Object.entries(monthlySpending).reduce((acc, [month, amount]) =>
            amount > acc[1] ? [month, amount] : acc
        );

        return res.json({ success: true, month: highestSpendingMonth, total: highestSpendingAmount });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ success: false, error: 'Eroare internă server' });
    }
}

async function recurringPaymentsHandler(req, res) {
    try {
        const uid = req.user.uid;
        
        // Interogăm toate tranzacțiile pentru utilizatorul curent
        let query = supabase
            .from('transactions')
            .select('amount, date, provider, mcc_code')
            .eq('uid', uid);

        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length === 0) {
            return res.json({ success: true, recurringTransactions: [] });
        }

        // Grupăm tranzacțiile care îndeplinesc condițiile pentru a fi considerate recurente
        const recurringTransactions = data.reduce((acc, transaction) => {
            // Extragem ziua lunii din data tranzacției
            const dayOfMonth = new Date(transaction.date).getDate();
            const key = `${transaction.amount}-${dayOfMonth}-${transaction.provider?.slice(0, 10) || ''}`;

            if (!acc[key]) {
                acc[key] = {
                    amount: transaction.amount,
                    dayOfMonth,
                    provider: transaction.provider,
                    mcc_code: transaction.mcc_code,
                    occurrences: 0,
                };
            }
            acc[key].occurrences += 1;

            return acc;
        }, {});

        // Filtrăm doar tranzacțiile care au apărut în mod recurent (de exemplu, mai mult de 2 ori)
        const filteredRecurringTransactions = Object.values(recurringTransactions).filter(
            transaction => transaction.occurrences >= 2
        );

        return res.json({ success: true, recurringTransactions: filteredRecurringTransactions });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ success: false, error: 'Eroare internă server' });
    }
}




module.exports = { 
    getTotalSpentHandler,
    getAllMccCodes,
    compareSpendingHandler,
    averageSpendingHandler,
    monthWithHighestSpendingHandler,
    recurringPaymentsHandler
};