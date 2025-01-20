'use server'

import { NextRequest, NextResponse } from "next/server";
import firestore from "../../../../../utils/database";
import DB_COLLECTIONS from "../../../../../utils/constant";


export const GET = async (req: NextRequest) => {
    try {
        //ดึงข้อมูล จาก collection  แบบหลาย col
        const services = new firestore();
        const servicesdb = await services.getCollection(DB_COLLECTIONS.SERVICE).get();
        const ServiceData = servicesdb.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        const details = new firestore();
        const detaildb = await details.getCollection(DB_COLLECTIONS.DETAILS_SERVICE).get();
        const DetailData = detaildb.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        const delivery = new firestore();
        const deliverydb = await delivery.getCollection(DB_COLLECTIONS.DELIVERY_SERVICE).get();
        const DeliveryData = deliverydb.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        return NextResponse.json(
            {
                serviceData: ServiceData,
                detailData: DetailData,
                deliveryData: DeliveryData,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'เกิดข้อมูลผิดพลาด' }
        );
    }
};