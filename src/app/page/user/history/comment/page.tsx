'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Star from '@/components/Star';
import { toast } from 'react-toastify';

const CommentPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!name || rating === 0) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            setIsLoading(false);
            return;
        }

        const payload = {
            name,
            description,
            rating,
            orderId: '123456', // ตัวอย่าง: ID ของคำสั่งซื้อ
            userId: 'user123', // ตัวอย่าง: ID ของผู้ใช้
        };
        console.log('Payload:', payload); // ตรวจสอบข้อมูล

        try {
            const response = await fetch('/api/data/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('Response:', response); // เพิ่ม debug เพื่อดู response

            if (!response.ok) {
                const errorResult = await response.json(); // รับข้อความข้อผิดพลาด
                toast.error(errorResult.error || 'Something went wrong');
                return;
            }

            const result = await response.json(); // รับผลลัพธ์สำเร็จ
console.log('Result:', result);
            toast.success('บันทึกข้อมูลสำเร็จ');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('มีข้อผิดพลาด:', error);
            toast.error('บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <main className="max-w-xl justify-center items-center p-9" style={{ marginTop: '-45px', marginLeft: '31%' }}>
            <div className=" justify-center items-center">
                <Card className="flex justify-center items-center ">
                    <div className="max-w-lg mx-auto bg-white rounded-md">
                        <>
                            <CardHeader>
                                <h1 className="text-2xl font-bold mb-4 mt-5 text-center">
                                    ขอบคุณสำหรับความคิดเห็นของคุณ
                                </h1>
                            </CardHeader>
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            {success && <div className="text-green-500 mb-4">{success}</div>}
                            <form onSubmit={handleSave}>
                                <CardContent>
                                    <Star onRatingChange={setRating} />
                                    <div className="mb-4 mt-5">
                                        <label className="block font-medium mb-1">ชื่อ:</label>
                                        <input
                                            type="text"
                                            placeholder="ชื่อ"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-medium mb-1">ความคิดเห็น:</label>
                                        <textarea
                                            placeholder="รายละเอียด"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                </CardContent>
                                <div className="flex justify-center mb-3">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-blue-800 text-white hover:bg-blue-700 hover:text-white px-4 py-2 rounded"
                                    >
                                        {isLoading ? 'กำลังส่งความคิดเห็น...' : 'ส่งความคิดเห็น'}
                                    </Button>
                                </div>
                            </form>
                        </>
                    </div>
                </Card>
            </div>
        </main>
    );


    // return (
    //     <main className="max-w-xl ml-96 justify-center items-center p-9" style={{ marginTop: '-15px' }}>
    //         <Card className="flex justify-center">
    //             <div className="max-w-lg mx-auto bg-white rounded-md">
    //                 <CardHeader>
    //                     <h1 className="text-2xl font-bold mb-4 mt-5 text-center">ขอบคุณสำหรับความคิดเห็นของคุณ</h1>
    //                 </CardHeader>
    //                 {error && <div className="text-red-500 mb-4">{error}</div>}
    //                 {success && <div className="text-green-500 mb-4">{success}</div>}
    //                 <form onSubmit={handleSave}>
    //                     <CardContent>
    //                         <Star onRatingChange={setRating} />
    //                         <div className="mb-4 mt-5">
    //                             <label className="block font-medium mb-1">ชื่อ:</label>
    //                             <input
    //                                 type="text"
    //                                 placeholder="ชื่อ"
    //                                 value={name}
    //                                 onChange={(e) => setName(e.target.value)}
    //                                 className="w-full border px-3 py-2 rounded"
    //                                 required
    //                             />
    //                         </div>
    //                         <div className="mb-4">
    //                             <label className="block font-medium mb-1">ความคิดเห็น:</label>
    //                             <textarea
    //                                 placeholder="รายละเอียด"
    //                                 value={description}
    //                                 onChange={(e) => setDescription(e.target.value)}
    //                                 className="w-full border px-3 py-2 rounded"
    //                                 required
    //                             />
    //                         </div>
    //                     </CardContent>
    //                     <div className="flex justify-center mb-3">
    //                         <Button
    //                             type="submit"
    //                             disabled={isLoading}
    //                             className="bg-blue-800 text-white hover:bg-blue-700 hover:text-white px-4 py-2 rounded"
    //                         >
    //                             {isLoading ? 'กำลังส่งความคิดเห็น...' : 'ส่งความคิดเห็น'}
    //                         </Button>
    //                     </div>
    //                 </form>
    //             </div>
    //         </Card>
    //     </main>
    // );
};

export default CommentPage;

// {previewImage && (
//     <div className="mt-3">
//         <img src={previewImage} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover" />
//     </div>
// )}