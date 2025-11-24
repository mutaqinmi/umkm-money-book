import { getChartData, getTotalTransactionLastMonth } from "@/src/db/query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user_id = req.cookies.get("user_id")?.value;

        if(!user_id){
            return NextResponse.json({ 
                message: "Missing user_id"
            }, { status: 400 });
        }

        const totalTransactions = await getTotalTransactionLastMonth(user_id);

        const chartDataRaw = await getChartData(user_id);

        // Transform to chart-friendly format
        const chartData: { [key: string]: { date: string; income: number; expense: number; net: number } } = {};
        
        chartDataRaw.forEach(item => {
            if (!chartData[item.date]) {
                chartData[item.date] = { date: item.date, income: 0, expense: 0, net: 0 };
            }
            
            if (item.transactionType === "pemasukan") {
                chartData[item.date].income = item.total;
            } else {
                chartData[item.date].expense = item.total;
            }
        });

        const chart = Object.values(chartData);

        return NextResponse.json({ 
            message: "Success",
            data: {
                totalTransactions,
                chart
            }
        }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ 
            message: "Error occurred",
            error: e
        }, { status: 500 });
    }
}