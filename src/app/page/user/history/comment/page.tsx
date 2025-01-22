'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'
import Star from '@/components/Star'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const CommentPage = () => {
    const [nameService, setNameService] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        if (!nameService || !description || !price) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/data/service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nameService, description, price, isActive }),
            })

            if (!response.ok) {
                const errorResponse = await response.json()
                throw new Error(errorResponse.error || 'Something went wrong')
            }

            const result = await response.json()
            console.log('บันทึกข้อมูลสำเร็จ:', result)
            setSuccess('บันทึกข้อมูลสำเร็จ')
            // ใช้ window.location.reload() เพื่อรีเฟรชหน้า
            setTimeout(() => {
                window.location.reload(); // รีเฟรชหน้าเว็บ
            }, 1000);
        } catch (error) {
            console.error('มีข้อผิดพลาด:', error)
            setError('บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="max-w-xl ml-80" style={{ marginTop: "-15px" }}>
            <Card className='flex justify-center '>
                <div className="max-w-lg mx-auto bg-white rounded-md">
                    <CardHeader>
                        <h1 className="text-2xl font-bold mb-4 mt-5 text-center">ขอบคุณสำหรับความเห็นของคุณ</h1>
                    </CardHeader>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {success && <div className="text-green-500 mb-4">{success}</div>}
                    <form onSubmit={handleSave}>
                        <CardContent >
                            <Star />
                            <div className="mb-4 mt-5">
                                <label className="block font-medium mb-1">ดึงชื่อผู้ใช้</label>
                                <input
                                    type="text"
                                    placeholder="ชื่อบริการ"
                                    value={nameService}
                                    onChange={(e) => setNameService(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 mt-5">
                                <label className="block font-medium mb-1">ชื่อบริการ:</label>
                                <input
                                    type="text"
                                    placeholder="ชื่อบริการ"
                                    value={nameService}
                                    onChange={(e) => setNameService(e.target.value)}
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
                                >
                                </textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block font-medium mb-1">สุ่มรูปโปรไฟล์</label>
                                <input
                                    type="number"
                                    placeholder="ราคา"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>
                        </CardContent>
                        <div className="flex justify-center mb-3">
                            <Button type="submit" disabled={isLoading} className="bg-green-500 text-white hover:bg-green-600 hover:text-white px-4 py-2 rounded">
                                {isLoading ? 'กำลังส่งความคิดเห็น...' : 'ส่งความคิดเห็น'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
            <div className="flex justify-center mt-9">
                <a href="/page/user/history">
                    <button className="text-white bg-black  px-4 py-2 rounded">
                        ย้อนกลับ
                    </button>
                </a>
            </div>
        </main>
    )
}

export default CommentPage
