'use client'
import React, { useState } from 'react'
import { Button } from 'src/components/ui/button'

const CreatService = () => {
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
    <main className="p-3 ">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">เพิ่มบริการ</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSave}>
          <div className="mb-4">
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
            <label className="block font-medium mb-1">รายละเอียด:</label>
            <textarea
              placeholder="รายละเอียด"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">ราคา:</label>
            <input
              type="number"
              placeholder="ราคา"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2 rounded"
              required
            />
            <label className="text-sm">เปิดใช้งานบริการ</label>
            <style jsx>{`
                        input[type='checkbox'] {
                          appearance: none;
                          width: 1.25rem;
                          height: 1.25rem;
                          border: 1px solid #ccc;
                          border-radius: 0.25rem;
                          background-color: white;
                          transition: all 0.3s ease;
                          cursor: pointer;
                          position: relative;
                        }

                        input[type='checkbox']:checked {
                          background-color: #22c55e; /* สีเขียว */
                          border-color: #22c55e;
                        }

                        input[type='checkbox']:checked::after {
                          content: '✔';
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 1rem;
                          color: white;
                        }
                      `}
            </style>
          </div>
          <div className="flex justify-center">
            <Button type="submit" disabled={isLoading} className="bg-green-500 text-white hover:bg-green-600 hover:text-white px-4 py-2 rounded">
              {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </form>
      </div>
      <div className="flex justify-center mt-9">
        <a href="/page/service">
          <button className="text-white bg-black  px-4 py-2 rounded">
          ย้อนกลับ
        </button>
        </a>
      </div>
    </main>
  )
}

export default CreatService
