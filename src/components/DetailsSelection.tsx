'use client';

import React, { useState, useEffect } from 'react';

interface DetailField {
    fieldName: string;
    fieldValue: string;
    price?: number;
}

interface DetailData {
    id: string;
    nameDetail: string;
    fields: DetailField[];
    price: string;
    isActive: boolean;
}

interface DetailSelectionProps {
    selectedDetail: { [key: string]: DetailField };
    onSelectDetail: (details: { [key: string]: DetailField }) => void;
}

const DetailSelection: React.FC<DetailSelectionProps> = ({
    selectedDetail,
    onSelectDetail,
}) => {
    const [details, setDetails] = useState<DetailData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/data/booking', { method: 'GET' });
                if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
                const { detailData } = await response.json();
                setDetails(detailData || []);
            } catch (err) {
                console.error(err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    // เลือกรายละเอียด (หัวข้อละ 1 อัน)
    const handleDetailSelection = (detailId: string, field: DetailField, price: number) => {
        const updatedDetails = {
            ...selectedDetail,
            [detailId]: { ...field, price }, // เพิ่ม price เข้าไปในโครงสร้าง
        };

        console.log("Updated selected details:", updatedDetails); // Debugging
        onSelectDetail(updatedDetails); // ส่งกลับไปที่ BookingPage
    };

    const activeDetails = details.filter((detail) => detail.isActive);

    return (
        <div className="p-6 bg-white shadow-xl rounded-3xl mt-3">
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-1/3">&nbsp;</div>
                    <div className="h-4 bg-gray-300 rounded w-full">&nbsp;</div>
                    <div className="h-4 bg-gray-300 rounded w-full">&nbsp;</div>
                    <p className="text-sm bg-gray-300 rounded text-gray-600 mt-2">&nbsp;</p>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : activeDetails.length === 0 ? (
                <p className="text-center text-gray-500">ไม่มีรายละเอียดในขณะนี้</p>
            ) : (
                activeDetails.map((detail) => (
                    <div key={detail.id} className="rounded-lg bg-white p-3 mb-3">
                        <p className="font-semibold text-blue-800">
                            {detail.nameDetail} 
                            <span className="text-gray-400 text-sm ml-2">
                                ฿ {detail.price} บาท
                            </span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 text-center">
                            {detail.fields.map((field, index) => (
                                <div key={index} className="flex items-center p-1 space-x-3 shadow-gray-300">
                                    <input
                                        type="radio"
                                        name={`detail-${detail.id}`}
                                        className="form-radio hover:shadow-lg h-4 w-4 text-blue-300"
                                        checked={selectedDetail[detail.id]?.fieldName === field.fieldName}
                                        onChange={() => handleDetailSelection(detail.id, field, parseFloat(detail.price))} // ส่ง price กลับด้วย
                                    />
                                    <label className="text-md text-gray-600">{field.fieldValue}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default DetailSelection;
