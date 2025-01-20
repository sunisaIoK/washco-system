'use client';

import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';

interface DetailField {
    fieldName: string;
    fieldValue: string;
}

interface Detail {
    id: string;
    nameDetail: string;
    fields: DetailField[];
    price: string;
    isActive: boolean;
}

const ListHistory = () => {
    const [details, setDetails] = useState<Detail[]>([]);
    // const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<Detail | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    // const [isSaving, setIsSaving] = useState(false);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/data/detail', { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to fetch details');
            }
            const { details } = await response.json();
            setDetails(details || []);
        } catch (err) {
            console.error('Error fetching details:', err);
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails(); // Fetch details when the component is mounted
    }, []);

    const toggleStatus = async (id: string, isActive: boolean) => {
        try {
            setLoading(true);
            const response = await fetch('/api/data/detail', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !isActive }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            await fetchDetails(); // Reload data after updating status
            alert('เปลี่ยนสถานะเรียบร้อย');
        } catch (err) {
            console.error('Error toggling status:', err);
            alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าจะลบรายการนี้?');
        if (!confirmDelete) return;

        try {
            setLoading(true);
            const response = await fetch('/api/data/detail', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error('การลบข้อมูลไม่สำเร็จ');

            await fetchDetails(); // Reload data after deletion
            alert('ลบข้อมูลเรียบร้อย');
        } catch (error) {
            console.error('Error deleting detail:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedDetail) return;

        try {
            // setIsSaving(true);
            const validFields = selectedDetail.fields.filter(
                (field) => field.fieldName.trim() && field.fieldValue.trim()
            );

            const response = await fetch('/api/data/detail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...selectedDetail,
                    fields: validFields,
                }),
            });

            if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');

            await fetchDetails(); // Reload data after saving
            alert('บันทึกข้อมูลสำเร็จ');
            // closeModal();
        } catch (error) {
            console.error('Error saving detail:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            // setIsSaving(false);
        }
    };

    // const openViewModal = (detail: Detail) => {
    //     setSelectedDetail(detail);
    //     setIsViewModalOpen(true);
    // };

    // const openEditModal = (detail: Detail) => {
    //     setSelectedDetail(detail);
    //     setIsEditModalOpen(true);
    // };

    // const closeModal = () => {
    //     setSelectedDetail(null);
    //     setIsViewModalOpen(false);
    //     setIsEditModalOpen(false);
    // };

    return (
        <main className="p-7 mr-32 ml-24 text-center">
            <div className="mb-4 flex flex-col items-center text-center " style={{ marginTop: '-40px' }}>
                <h1 className="text-2xl font-bold mb-4">รายอะเอียดการสั่งจอง
                </h1>
            </div>

            {error && <div className="text-red-500 my-4">{error}</div>}

            {loading ? (
                // Skeleton for loading
                <div className="flex justify-center mt-6 space-y-4 animate-pulse items-center">
                    <div className=' border border-gray-200 p-2 shadow-sm rounded-md'>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-sm w-full">
                                    <th className="border px-4 py-2">วันที่จอง</th>
                                    <th className="border px-4 py-2">ชื่อผู้จอง</th>
                                    <th className="border px-4 py-2">บริการ</th>
                                    <th className="border px-4 py-2">รายละเอียด</th>
                                    <th className="border px-4 py-2">วันที่รับผ้า</th>
                                    <th className="border px-4 py-2">วันที่คืนผ้า</th>
                                    <th className="border px-4 py-2">ราคา</th>
                                    <th className="border px-4 py-2">สถานะการชำระ</th>
                                    <th className="border px-4 py-2">การดำเนินงาน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center animate-pulse">
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="border px-4 py-2 ">&nbsp;</td>
                                    <td className="px-4 py-2 md:flex-row">
                                        <div
                                            className="flex items-center justify-center space-x-6 "
                                        >
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 flex md:flex-row">
                                        <div
                                            className="flex items-center justify-center space-x-6  m-1"
                                        >
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center justify-center space-x-6  m-1"
                                        >
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center justify-center space-x-6  m-1"
                                        >
                                            <div
                                                className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                                            >
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto mt-6">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-medium">
                                <th className="border px-4 py-2">วันที่จอง</th>
                                <th className="border px-4 py-2">ชื่อผู้จอง</th>
                                <th className="border px-4 py-2">บริการ</th>
                                <th className="border px-4 py-2">รายละเอียด</th>
                                <th className="border px-4 py-2">วันที่รับผ้า</th>
                                <th className="border px-4 py-2">วันที่คืนผ้า</th>
                                <th className="border px-4 py-2">ราคา</th>
                                <th className="border px-4 py-2">สถานะการชำระ</th>
                                <th className="border px-4 py-2">การดำเนินงาน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail) => (
                                <tr key={detail.id} className="text-center text-lg even:bg-gray-50 hover:bg-gray-100">
                                    {/* ชื่อรายละเอียด */}
                                    <td className="border px-4 py-2">{detail.nameDetail}</td>
                                    {/* ราคา */}
                                    <td className="border px-4 py-2">{detail.price} บาท</td>
                                    {/* สถานะ */}
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => toggleStatus(detail.id, detail.isActive)}
                                            className={`px-4 py-1 rounded ${detail.isActive ? 'bg-green-300 text-green-80' : 'bg-red-100 text-red-800'}`}
                                        >
                                            {detail.isActive ? 'เปิด' : 'ปิด'}
                                        </button>
                                    </td>
                                    {/* ดูข้อมูล */}
                                    <td className="border px-4 py-2">
                                        <button
                                            // onClick={() => openViewModal(detail)}
                                            className="bg-blue-200 text-blue-500 px-3 py-1 rounded hover:bg-blue-300 hover:text-blue-600"
                                        >
                                            ดูข้อมูล
                                        </button>
                                    </td>
                                    {/* การจัดการ */}
                                    <td className="border px-4 py-2 gap-2 ">
                                        {/* <button
                                            onClick={() => openEditModal(detail)}
                                            className="bg-yellow-400 text-white hover:text-white px-2 py-2 mr-1 rounded hover:bg-yellow-500"
                                        >
                                            <Icon icon="mdi:pencil" className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(detail.id)}
                                            className="bg-red-500 text-white px-2 py-2 rounded ml-1 hover:text-white hover:bg-red-600"
                                        >
                                            <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </main>
    );
};

export default ListHistory;