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
        const { uid, dataStart, dataEnd, mccCode, merchant } = req.body;

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

module.exports = { getTotalSpentHandler, getAllMccCodes };